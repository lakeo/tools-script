function initListener() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.cmd == "getSingleAttentionUser"){
                getSinglelUser();
                sendResponse(
                    {
                        cmd:'userList',
                        data:'empty'
                    }
                )
            }else if (request.cmd == "getAllAttentionUser"){
                getAllUser();
                sendResponse(
                    {
                        cmd:'userList',
                        data:'empty'
                    }
                )
            }
        });
}
//console.log($.fn.jquery)
function getSinglelUser() {
    console.log('select user')
    jQuery('.member_li').each(function(index){val = jQuery(this).find('em:first').text();if( !val || val == 'Y' ){jQuery(this).click()}  })
}

function getAllUser() {
    console.log('select user')
    jQuery('.member_li').each(function(index){val = jQuery(this).find('em:first').text();if( true ){jQuery(this).click()}  })
}
initListener();
