console.log('Indian post Automation script loaded')

chrome.storage.onChanged.addListener(async (changes, areaName)=>{
    let data = await chrome.storage.local.get(["firstLoadDone"])

    if(changes.running && changes.running.newValue===true){
        console.log("start trigger received");
        console.log(changes.running.newValue)


        let { firstLoadDone } = await chrome.storage.local.get(["firstLoadDone"])
        
        if(firstLoadDone === undefined || firstLoadDone === false){
            await chrome.storage.local.set({firstLoadDone: true, fetched: true})
            startAutomation(false, 0);
        }
    }
})

initialExec()

async function initialExec(){
    let data = await chrome.storage.local.get(["firstLoadDone","fetched","currentIndex"])
    if(data.firstLoadDone===true){
        startAutomation(data.fetched,data.currentIndex);
    }
}

async function startAutomation(fetched, currentIndex){

  
    // load the accounts
    let data = await chrome.storage.local.get(["accountNumbers"]);
    if(!data.accountNumbers) return;
    
    let accounts = data.accountNumbers.split("\n").filter(line=>line.trim())
    
    if(currentIndex >= accounts.length){
        console.log("All accounts have been sccessfully processed");
        await chrome.storage.local.set({running:false, firstLoadDone: false, fetched: false, currentIndex:0});
        return;
    }

    let currentAccount = accounts[currentIndex]
    console.log(`processing account ${currentIndex}`)
    
    let searchBar = document.querySelector("#CustomAgentRDAccountFG\\.ACCOUNT_NUMBER_FOR_SEARCH")
    let searchBtn = document.querySelector("#Button3087042")

    if(!searchBar || !searchBtn){
        console.log("required page elements are missing from this page");
        return;
    }
   
    if(fetched === false){

        searchBar.value = currentAccount;

        searchBar.dispatchEvent(new Event("input", {bubbles: true}));
        searchBar.dispatchEvent(new Event("change", {bubbles: true}))

        await delay(500)

        await chrome.storage.local.set({fetched:true})
        searchBtn.click()
        return;
    }

    if(fetched === true){

        console.log("Search complete. Evaluating table rows...")

        await delay(3000); // wait

        processTable(currentAccount)  
        
        await delay(1000)

        await chrome.storage.local.set({
            fetched:false,
            currentIndex: currentIndex+1
        })

        await delay(1000);

        startAutomation(false,currentIndex+1)
    }
}

function delay(ms){
    return new Promise(resolve=>setTimeout(resolve,ms))
}

function processTable(currentAccount){
    let accntTable = document.querySelector("#SummaryList")
    let tbody = accntTable.children[0]
    let tbodyChildren = tbody.children
    let startIdx = 2
    let lastIdx = tbody.children.length-2

    for(let i=startIdx;i<=lastIdx;i++){
        console.log(tbodyChildren[i])
        //2nd child in each row
        let currentRow = tbodyChildren[i]
        let accAnchor = currentRow.children[1].children[0]
        let checkBox = currentRow.children[0].children[0]
        let accId = accAnchor.textContent
        console.log(currentRow)
        console.log(accAnchor)
        console.log(checkBox)
        console.log(accId)

        if(accId === currentAccount){
            checkBox.checked = true;
            checkBox.dispatchEvent(new Event('change', {bubbles: true})) // to send the event to the server  
        }
    }
}