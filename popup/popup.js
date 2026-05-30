let loginBtn = document.getElementById("login")
let accountsBtn = document.getElementById("accounts")
const inputEl = document.getElementById("accountNumbers")

// 1. initial loading
async function initializePopup(){
    const data = await chrome.storage.local.get(["accountNumbers", "running"]);

    if(data.accountNumbers){
        inputEl.value = data.accountNumbers
    }

    const isRunning = data.running ?? false;
    updateButtonUI(isRunning)
}

function updateButtonUI(isRunning){
     if (isRunning === false) {
        accountsBtn.textContent = "Start";
        accountsBtn.style.backgroundColor = "green";
    } else {
        accountsBtn.textContent = "Stop";
        accountsBtn.style.backgroundColor = "red";
    }
}

initializePopup();

// 2. event listeners
loginBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/login.js"]
    });
});
    
inputEl.addEventListener(("input"),(event)=>{
    const currentText = event.target.value
    console.log(currentText);
    chrome.storage.local.set({
        accountNumbers: currentText
    })
});

accountsBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const data = await chrome.storage.local.get(["running"]);
    const currentRunning = data.running ?? false;
    const nextRunning = !currentRunning
    await chrome.storage.local.set({
        running: nextRunning
    })
    if(nextRunning===false){
    await chrome.storage.local.set({running:false, firstLoadDone: false, fetched: false, currentIndex:0});

    }
    updateButtonUI(nextRunning)
});
