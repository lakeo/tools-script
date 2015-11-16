var WEIBO = 'http://weibo.com/'
var MANUALLY = 'manually';
var AUTO_PAY_ATTENTION_STATUS = 'auto_pay_attention_status';
var AUTO_CANCELL_ATTENTION_STATUS = 'auto_cancel_attention_status';
var AUTO_LIKE_ALL_STATUS = 'auto_like_all_status';

function clearAllStatus() {
    localStorage.removeItem('auto_pay_attention_status');
    localStorage.removeItem('auto_pay_attention_status_times');
    localStorage.removeItem('auto_cancel_attention_status');
    localStorage.removeItem('auto_cancel_attention_status_times');
    localStorage.removeItem('auto_cancel_attention_status')
}

function getCurrentUserId() {
    var url = jQuery(jQuery('a[nm="name"]')[0]).attr('href');
    console.log('url '+url)
    if (url.indexOf('weibo.com') != -1) {
        ret= url.substring(WEIBO.length, url.indexOf('/','http://weibo.com/'.length+1));
    } else {
        ret = url.substring(1,url.indexOf('/',1));
    }
    console.log(ret)
    return ret;
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
    try{
        jQuery('a[action-type="follow"]').each(function(){this.click()})
        jQuery('a[action-type="cancel"]')[0].click()
    }catch(err) {
        console.log(err);
    }
}

function gotoPageFan() {
    var uid = getCurrentUserId();
    var url = WEIBO+uid+'/fans?Pl_Official_RelationFans__103_page='+parseInt(Math.random()*10 % 5);
    window.location.href = url;
}

function gotoPageMyFollow(time) {
    var uid = getCurrentUserId();
    var url = WEIBO+uid+'/follow';
    if(typeof time != 'undefined') {
        url += '?Pl_Official_RelationMyfollow__108_page='+ time;
    }
    window.location.href = url;
}

function gotoHomePage(){
    var uid = getCurrentUserId();
    var url = WEIBO+uid+'/home';
    window.location.href = url;
}
/*
status
a: gotoPageFan
b: gotoPageFanFan
c: payingAttention
*/
function autoPayAttention() {
    var currStatus = localStorage.auto_pay_attention_status;
    var times = localStorage.auto_pay_attention_status_times;
    var lastTime = localStorage.auto_pay_attention_status_run_time;

    if (typeof times == 'undefined') {
        times = 1
    }
    if (typeof lastTime == 'undefined') {
        lastTime = 0;
    }
    console.log('auto attention status ' + currStatus + ' val='+times)
    if (typeof(currStatus) == 'undefined' || currStatus == 'gotoPageFan') {
        localStorage.auto_pay_attention_status = 'gotoPageFanFan';
        localStorage.auto_pay_attention_status_times = 1;
        gotoPageFan();
    } else if (currStatus == 'gotoPageFanFan'){
        //must be in fan's page
        try{
            var cnt = jQuery('a[usercard]').length;
            var uid = jQuery(jQuery('a[usercard]')[parseInt(Math.random()*100) % cnt]).attr('usercard').substring(3);
            var url = WEIBO+uid+'/fans';
            localStorage.auto_pay_attention_status = 'payingAttention';
            window.location.href = url;
        }catch(err) {
            console.log(err)
            localStorage.auto_pay_attention_status = 'gotoPageFan';
            setTimeout(function(){
                gotoPageFan();
            },1500);
        }
    } else if (currStatus == 'payingAttention') {
        if(parseInt(times) > 2) {
            var now = new Date();
            var timeStep = 300000 + parseInt(lastTime) - now.getTime()
            if (timeStep > 300000) {
                timeStep = 300000;
            }else if (timeStep < 0) {
                timeStep = 1000;	
            }
            console.log('timestep:' + timeStep+ ' now:'+now.toString() + ' lasttime:'+lastTime);
            //休息300s
            setTimeout(function(){
                localStorage.auto_pay_attention_status = 'gotoPageFan';
                localStorage.setItem('soul_main_status', AUTO_LIKE_ALL_STATUS);
                clearAllStatus();
                gotoPageFan();
            },timeStep);
        } else {
	    try{
                setTimeout(function() {
          	    payAttendToAll();
            	},1500);
            }catch(err) {
            	console.log(err)
            }
            localStorage.auto_pay_attention_status_times = parseInt(times) + 1;
            localStorage.auto_pay_attention_status_run_time = (new Date()).getTime();
        
            setTimeout(function(){
                try{
                    var text = jQuery(jQuery('dd[node-type="inner"] p[node-type="textLarge"]')[0]).text();
                    if (text.indexOf('上限') != -1) {
                        clearAllStatus();
                        localStorage.soul_main_status = AUTO_CANCELL_ATTENTION_STATUS;
                        gotoPageFan();
                    }
                }catch (err) {
                    console.log(err)
                }
                //goto next page
                console.log('go to next page');
                url = window.location.href + '?&page='+ (parseInt(times)+1);
                window.location.href = url;
            },3000)
        }
    } else {
        console.log('error in auto autoPayAttention');
    }
}

/*
* status:
* a:gotoPage
* b:cancel
* */
function autoCancelAttention() {
    var currStatus = localStorage.auto_cancel_attention_status;
    var times = localStorage.auto_cancel_attention_status_times;
    console.log('in autoCancelAttention ' + currStatus + ' val '+times);
    if(typeof currStatus == 'undefined' || currStatus == 'gotoPage' ) {
        localStorage.auto_cancel_attention_status = 'cancel';
        gotoPageMyFollow();
    }else {
        try {
            cancelSingleUser();
        }catch(err) {
            console.log(err);
        }
        if (typeof times == 'undefined') {
            times = 10
        }

        localStorage.auto_cancel_attention_status_times = parseInt(times) + 1;
        if(times >= 60) {
            clearAllStatus();
            localStorage.setItem('soul_main_status', AUTO_PAY_ATTENTION_STATUS);
            gotoPageFan();
        }
        if (parseInt(times) <= 1) {
            times = 2;
        }
        setTimeout(function(){
            gotoPageMyFollow(times);
        },2000);
    }
}

/*
status:
a: gotopage
b: likeall
* */
function autoLikeAll() {
    var currStatus = localStorage.auto_cancel_attention_status;
    if(typeof currStatus == 'undefined' || currStatus == 'gotoPage' ) {
        localStorage.auto_cancel_attention_status = 'likeAll';
        gotoHomePage();
    } else {
        likeAll();
        setTimeout(function() {
            localStorage.setItem('soul_main_status', AUTO_PAY_ATTENTION_STATUS);
            gotoPageFan();
        },30000);
    }
}
function openAutoModel() {
    console.log('change auto model');
    if(typeof(Storage) === "undefined") {
        console.log('Sorry! No Web Storage support..');
        return;
    }
    localStorage.setItem('soul_main_status', AUTO_PAY_ATTENTION_STATUS);
    clearAllStatus();
    window.location.href = WEIBO;
}

function closeAutoModel() {
    console.log('change auto model');
    if(typeof(Storage) === "undefined") {
        console.log('Sorry! No Web Storage support..');
        return;
    }
    localStorage.setItem('soul_main_status', MANUALLY);
}
