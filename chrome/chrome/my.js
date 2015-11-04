function initListener() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            if (request.cmd == "cancelSingleAttentionUser"){

                cancelSingleUser();
                sendResponse(
                    {
                        cmd:'userList',
                        data:'empty'
                    }
                )
            }else if (request.cmd == "cancelAllAttentionUser"){

                cancelAllUser();
                sendResponse(
                    {
                        cmd:'userList',
                        data:'empty'
                    }
                )
            }else if (request.cmd == "payAttendToAll"){
                checkAlert(request);
                payAttendToAll();
                sendResponse(
                    {
                        cmd:'userList',
                        data:'empty'
                    }
                )
            } else if (request.cmd == 'likeAllUser') {
                likeAll();
            }
        });
}

function sleepRun(index,list,time,callback){
    if (index >= list.length) {
        return;
    }
    setTimeout(function(){
        callback(index,list);
        sleepRun(index+1, list, time,callback);
    },time);
}
function likeAll() {

    var list = jQuery('a[action-type="fl_like"][title="赞"]');
    var total = list.length;

    sleepRun(0,list,2500,function(index, array){
        array[index].click();
        jQuery('div[node-type="outer"]').css('display','none')
        jQuery('.W_layer').css('display','none')
        jQuery('a[action-type="ok"][node-type="ok"]').click()
        var page = jQuery('a[action-type="feed_list_page"]')
        if(page.length == 0) {
            window.scrollTo(0,document.body.scrollHeight);
        }
    })
}
function checkAlert(request) {
    if(request.alert) {
        var secret = prompt(request.msg+"万分抱歉，广告时间：请微信关注“索尔眼镜”。如果不想出现次对话框，请联系微信客服免费获取密码")
        console.log(secret)
        if (secret != null) {
            chrome.storage.sync.set({'soul_secret': secret})
        }
    }
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
function cancelSingleUser() {
    beforeClick();
    jQuery('.member_li').each(function(index){val = jQuery(this).find('.statu em:first');console.log(val);if( val.text() == 'Y' ){jQuery(this).click()}})
    afterClick();
}

function cancelAllUser() {
    console.log('select user')
    beforeClick();
    jQuery('.member_li').each(function(index){val = jQuery(this).find('em:first').text();if( true ){jQuery(this).click()}  })
    afterClick();
}

function payAttendToAll() {
    jQuery('a[action-type="follow"]').each(function(){this.click()})
    jQuery('a[action-type="cancel"]')[0].click()
}
initListener();
