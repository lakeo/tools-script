function initListener() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.cmd == "getSingleAttentionUser"){
                sendResponse(
                    {
                        cmd:'userList',
                        data:'empty'
                    }
                )
            }
        });
}
console.log('before init')
initListener();