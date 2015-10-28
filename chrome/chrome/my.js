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
//console.log($.fn.jquery)
function getUserList() {
jQuery('.member_li').each(function(index){var val=jQuery(this).find('em:first').text();if(val == 'Y'){ jQuery(this).css('border','3px solid red')};})
jQuery('.member_li').each(function(index){var val=jQuery(this).find('em:first').text();if(val == 'Y'){ jQuery(this).css('border','3px solid red')}; var str = jQuery(this).attr('action-data'); console.log(str.substring(0,str.indexOf('&')))})
jQuery('.member_li').each(function(index){var val=jQuery(this).find('em:first').text();if(val == 'Y'){ jQuery(this).css('border','3px solid red')}; var str = jQuery(this).attr('action-data'); uid=str.substring(1,str.indexOf('&')); jQuery.ajax({url:'http://weibo.com/aj/f/unfollow?ajwvr=6&__rnd=1446035556178',data:{'uid':uid,refer_flag:'unfollow_all',_t:0}})})
jQuery('.member_li').each(function(index){var val=jQuery(this).find('em:first').text();if(val == 'Y'){ jQuery(this).css('border','3px solid red')}; var str = jQuery(this).attr('action-data'); uid=str.substring(4,str.indexOf('&')); console.log(uid);jQuery.ajax({url:'http://weibo.com/aj/f/unfollow?ajwvr=6&__rnd=1446035556178',data:{'uid':uid,refer_flag:'unfollow_all',_t:0}})})
}
initListener();
