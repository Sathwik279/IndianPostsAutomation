
// popup DOM elements
let loginBtn = document.getElementById("login")
let tickBtn = document.getElementById("tick")
let untickBtn = document.getElementById("untick")
let accountNumbers = document.getElementById("accountNumbers")
let fileinput = document.getElementById("fileinput")
let queryInput = document.getElementById("query")
let records = null
let recordMap = {};

// Trie implementation
class TrieNode {
    constructor() {
        this.children = {}; // map
        this.isEnd = false;
    }
}
const root = new TrieNode();

function insert(root, word) {
    let node = root;
    for (let char of word) {
        if (!node.children[char]) {
            node.children[char] = new TrieNode();
        }
        node = node.children[char];
    }
    node.isEnd = true;
}

// Load records and recordMap from chrome storage if they exist
chrome.storage.local.get(["records", "recordMap"], (result) => {
    if (result.records && result.recordMap) {
        records = result.records;
        recordMap = result.recordMap;
        console.log("Loaded records and recordMap from chrome storage:", records);
        for (let record of records) {
            insert(root, record.account_no + '');
        }
    }
});


// Event Listeners

function createTextDivs(text){
   let node = document.createElement("div");
   
   let accountNo = document.createElement("div");
   accountNo.innerText = text;
   
   let depositer = document.createElement("div");
   depositer.innerText = recordMap[text].name_of_the_depositor

   node.appendChild(accountNo);
   node.appendChild(depositer)

   node.style.padding = "6px";
   node.style.margin = "4px 0";
   node.style.border = "1px solid #ccc";

   return node;
}

queryInput.addEventListener("input", async (e)=>{
   let children = returnChildren(root,e.target.value);
   accountNumbers.innerHTML = ''
   children = children.map((child)=>{
    return createTextDivs(child)
   })

   children.map((childNode)=>{
    return childNode.addEventListener("click", async (e)=>{
        // Apply green border to clicked childNode
        childNode.style.border = "2px solid green";

        let value = childNode.children[0].innerText;
        console.log(value)

        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.tabs.sendMessage(tab.id, {
            action: "fillInput",
            value: value
        });
    })})

    children.map((child)=>{
        accountNumbers.appendChild(child)
    })   
})

fileinput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    await processExcel(arrayBuffer);
    records = cleanRecords(records);
    console.log(records);
    for(let record of records){
        insert(root,record.account_no+'');
    }
    // building the record map
    for (let record of records) {
        recordMap[String(record.account_no)] = record;
    }

    // Save to chrome local storage
    chrome.storage.local.set({ records, recordMap }, () => {
        console.log("Saved records and recordMap to chrome storage");
    });
})

tickBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: "tickAllCheckboxes" })
    console.log('tick message sent')
})

untickBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: "untickAllCheckboxes" })
    console.log('untick message sent')
})

loginBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/login.js"]
    });
});



async function processExcel(buffer) {
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

    // Get all sheet names
    const sheetNames = workbook.SheetNames;

    // Pick one sheet (by name or index)
    const sheet = workbook.Sheets[sheetNames[0]]; // or specific name

    const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1
    });

    const headers = rows[1]

    records = rows.slice(2).map(row => {
        const obj = {};
        headers.forEach((key, i) => {
            if (i <= 4)
                obj[key] = row[i];
        });
        return obj;
    });

    // console.log(records)

}




function checkExistence(root,word){
     let node = root;

    for(let char of word){
        if(!node.children[char]){
            return false;
        }
        node = node.children[char]
    }

    return node;
}

function returnChildren(root, word){
    let children = []
    let node = checkExistence(root,word)
    if(node===false){
        return [];
    }

    // we got the node whose children we need to do the dfs
    
    dfs(node,word,children);

    // console.log(children)

    return children

}

function dfs(node,tmpword,childCont){
    // the base condition is node has 0 length children
    if(node.isEnd === true){
        childCont.push(tmpword);
    }
    if(Object.keys(node.children).length===0){
        // add the strign to the array
        return;
    }
    // means there are children
    for(let child of Object.keys(node.children)){
        let tmp = tmpword+child
        dfs(node.children[child],tmp,childCont);
    }
}

function normalizeKey(key) {
    return key
        .toLowerCase()
        .replace(/\s+/g, "_") // replace spaces with _
        .replace(/[^\w]/g,"") // remove special charachters
}

function cleanRecords(records){
    return records.map( record => {
        const newRec = {};
        for (let key in record) {
            const newKey = normalizeKey(key);
            newRec[newKey] = record[key];
        }
        return newRec;
    })
}

