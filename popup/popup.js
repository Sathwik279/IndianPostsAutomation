
// popup DOM elements
let loginBtn = document.getElementById("login")
let tickBtn = document.getElementById("tick")
let untickBtn = document.getElementById("untick")
let inputEl = document.getElementById("accountNumbers")
let fileinput = document.getElementById("fileinput")
let records = null

// Event Listeners

fileinput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    processExcel(arrayBuffer)
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

    console.log(records)

}


// we need a trie implementation now 
class TrieNode{
    constructor(){
        this.children = {}; // map
        this.isEnd = false;
    }
}
const root = new TrieNode();

function insert(root, word){
    let node = root;

    for(let char of word){
        if(!node.children[char]){
            node.children[char] = new TrieNode();
        }
        node = node.children[char]
    }
    node.isEnd = true;
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

    console.log(children)

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

insert(root,"sa")
insert(root,"sat")
insert(root,"san")

returnChildren(root,"sa")