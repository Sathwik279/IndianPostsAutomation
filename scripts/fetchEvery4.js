
// logic for autofetch every 4 minutes to keep typing lists in the search box and to be in session instead of being logged out every 5 min of inactivity acc to server.
let fetchBtn = null
let fetchBox = null
window.addEventListener("load", () => {
    fetchBtn = document.querySelector("#Button3087042")
    fetchBox = document.getElementById("CustomAgentRDAccountFG.ACCOUNT_NUMBER_FOR_SEARCH");

    if (fetchBtn) {
        console.log("fetch btn found")
        setInterval(() => {
            fetchBtn.click();
            console.log("clicked the fetch button")
    }, 240000)
    }
    else
        console.log("fetch btn not found")


});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request.action);
    if (request.action === "tickAllCheckboxes") {
        processTable(true);
    } else if (request.action === "untickAllCheckboxes") {
        processTable(false);
    } else if (request.action === "fillInput") {
        console.log(fetchBox, request.value)
        if (fetchBox) {

            fetchBox.value += "\n" + request.value + ",";

            fetchBox.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }
    sendResponse({ status: "completed" });
});


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function processTable(boolean) {
    console.log('starting the processing')
    let accntTable = document.querySelector("#SummaryList")
    let tbody = accntTable.children[0]
    let tbodyChildren = tbody.children
    let startIdx = 2
    let lastIdx = tbody.children.length - 2

    for (let i = startIdx; i <= lastIdx; i++) {
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
        checkBox.dispatchEvent(new Event('change', { bubbles: true })) // to send the event to the server  

    }
}