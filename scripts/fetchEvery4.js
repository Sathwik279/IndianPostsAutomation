
let fetchBtn = document.querySelector("#Button3087042")

if(fetchBtn)
{
    console.log("fetch btn found")
    setInterval(()=>{
    fetchBtn.click();
    console.log("clicked the fetch button")
},240000)}
else
console.log("fetch btn not found")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request.action);
    if(request.action === "tickAllCheckboxes"){
        processTable(true);
    } else if(request.action === "untickAllCheckboxes"){
        processTable(false);
    }
    sendResponse({status: "completed"});
});

function delay(ms){
    return new Promise(resolve=>setTimeout(resolve,ms))
}


function processTable(boolean){
    console.log('starting the processing')
    let accntTable = document.querySelector("#SummaryList")
    let tbody = accntTable.children[0]
    let tbodyChildren = tbody.children
    let startIdx = 2
    let lastIdx = tbody.children.length-2

    for(let i=startIdx;i<=lastIdx;i++){
        delay(1000)
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

            checkBox.checked = boolean;
            checkBox.dispatchEvent(new Event('change', {bubbles: true})) // to send the event to the server  
        
    }
}