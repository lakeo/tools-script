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
function beforeClick() {
    console.log('before click')
    jQuery('div .W_fl a[action-type="batselect"]')[0].click();
}
function afterClick() {
    jQuery('div .W_fl a[node-type="cancelFollowBtn"]')[0].click()
    jQuery('div .W_layer_btn a[node-type="ok"]')[0].click()
}
function getSinglelUser() {
    beforeClick();
    console.log('select user')
    jQuery('.member_li').each(function(index){val = jQuery(this).find('em:first').text();if( !val || val == 'Y' ){jQuery(this).click()}  })
    afterClick();
}

function getAllUser() {
    console.log('select user')
    beforeClick();
    jQuery('.member_li').each(function(index){val = jQuery(this).find('em:first').text();if( true ){jQuery(this).click()}  })
    afterClick();
}
initListener();
