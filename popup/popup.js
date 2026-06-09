let loginBtn = document.getElementById("login")
let tickBtn = document.getElementById("tick")

const inputEl = document.getElementById("accountNumbers")


// 1. initial loading
async function initializePopup(){
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

let untickBtn = document.getElementById("untick")

tickBtn.addEventListener("click", async ()=>{
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {action: "tickAllCheckboxes"})
    console.log('tick message sent')
})

untickBtn.addEventListener("click", async ()=>{
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {action: "untickAllCheckboxes"})
    console.log('untick message sent')
})

// 2. event listeners
loginBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/login.js"]
    });
});
    
// inputEl.addEventListener(("input"),(event)=>{
//     const currentText = event.target.value
//     console.log(currentText);
//     chrome.storage.local.set({
//         accountNumbers: currentText
//     })
// });

// accountsBtn.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     const data = await chrome.storage.local.get(["running"]);
//     const currentRunning = data.running ?? false;
//     const nextRunning = !currentRunning
//     await chrome.storage.local.set({
//         running: nextRunning
//     })
//     if(nextRunning===false){
//     await chrome.storage.local.set({running:false, firstLoadDone: false, fetched: false, currentIndex:0});

//     }
//     updateButtonUI(nextRunning)
// });



