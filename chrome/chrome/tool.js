var WEIBO = 'http://weibo.com/';
var MAIN_STATUS = 'soul_main_status';
var MANUALLY = 'manually';
var AUTO_PAY_ATTENTION_STATUS = 'auto_pay_attention_status';
var AUTO_CANCELL_ATTENTION_STATUS = 'auto_cancel_attention_status';
var AUTO_LIKE_ALL_STATUS = 'auto_like_all_status';

function setCookie(c_name,value)
{
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+1)
    document.cookie=c_name+ "=" +escape(value)+ ";expires="+ exdate.toGMTString()+ ";domain=.weibo.com;path=/";
    //localStorage.setItem(c_name,value)
}

function getCookie(c_name)
{
    //return localStorage.getItem(c_name);
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return null;
}

function deleteCookie( name ) {
    document.cookie = name + '=; domain=.weibo.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    //localStorage.removeItem(name)
}

function clearAllStatus() {
    //localStorage.removeItem('auto_pay_attention_status');
    //localStorage.removeItem('auto_pay_attention_status_times');
    //localStorage.removeItem('auto_cancel_attention_status');
    //localStorage.removeItem('auto_cancel_attention_status_times');
    //localStorage.removeItem('auto_cancel_attention_status')

    deleteCookie('auto_pay_attention_status');
    deleteCookie('auto_pay_attention_status_times');
    deleteCookie('auto_cancel_attention_status');
    deleteCookie('auto_cancel_attention_status_times');
    deleteCookie('auto_cancel_attention_status');
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

    sleepRun(0,list,5500,function(index, array){
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

function payAttentionToAll() {
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
    var currStatus = getCookie(AUTO_PAY_ATTENTION_STATUS);//.auto_pay_attention_status;
    var times = getCookie("auto_pay_attention_status_times");// localStorage.auto_pay_attention_status_times;
    var lastTime = getCookie("auto_pay_attention_status_run_time");//localStorage.auto_pay_attention_status_run_time;

    if (typeof times == 'undefined') {
        times = 1
    }
    if (typeof lastTime == 'undefined') {
        lastTime = 0;
    }
    console.log('auto attention status ' + currStatus + ' val='+times)
    if (currStatus == null || typeof(currStatus) == 'undefined' || currStatus == 'gotoPageFan') {
        setCookie('auto_pay_attention_status','gotoPageFanFan');//localStorage.auto_pay_attention_status = 'gotoPageFanFan';
        setCookie("auto_pay_attention_status_times",1);//localStorage.auto_pay_attention_status_times = 1;
        gotoPageFan();
    } else if (currStatus == 'gotoPageFanFan'){
        //must be in fan's page
        setTimeout(function(){
            try{
                var cnt = jQuery('a[usercard]').length;
                var uid = jQuery(jQuery('a[usercard]')[parseInt(Math.random()*100) % cnt]).attr('usercard').substring(3);
                var url = WEIBO+uid+'/fans';
                //localStorage.auto_pay_attention_status = 'payingAttention';
                setCookie('auto_pay_attention_status','payingAttention');
                window.location.href = url;
            }catch(err) {
                console.log(err)
                //localStorage.auto_pay_attention_status = 'gotoPageFan';
                setCookie('auto_pay_attention_status','gotoPageFan');
                setTimeout(function(){
                    gotoPageFan();
                },1500);
            }
        },1500);
    } else if (currStatus == 'payingAttention') {
        if(parseInt(times) > 3) {
            var now = new Date();
            var timeStep = 600000 + parseInt(lastTime) - now.getTime()
            if (timeStep > 600000) {
                timeStep = 600000;
            }else if (timeStep < 0) {
                timeStep = 1000;	
            }
            console.log('timestep:' + timeStep+ ' now:'+now.toString() + ' lasttime:'+lastTime);
            //休息300s
            setTimeout(function() {
                //localStorage.auto_pay_attention_status = 'gotoPageFan';
                setCookie('auto_pay_attention_status','gotoPageFan');
                setCookie('soul_main_status',AUTO_LIKE_ALL_STATUS);
                //localStorage.setItem('soul_main_status', AUTO_LIKE_ALL_STATUS);
                clearAllStatus();
                gotoPageFan();
            },timeStep);
        } else {
	        try{
                console.log('pay attention');
                setTimeout(function() {
          	    payAttentionToAll();
            	},1500);
            }catch(err) {
            	console.log(err)
            }
            //localStorage.auto_pay_attention_status_times = parseInt(times) + 1;
            //localStorage.auto_pay_attention_status_run_time = (new Date()).getTime();
            setCookie('auto_pay_attention_status_times',parseInt(times) + 1);
            setCookie('auto_pay_attention_status_run_time',(new Date()).getTime());
            setTimeout(function(){
                try{
                    var text = jQuery(jQuery('dd[node-type="inner"] p[node-type="textLarge"]')[0]).text();
                    if (text.indexOf('上限') != -1) {
                        clearAllStatus();
                        //localStorage.soul_main_status = AUTO_CANCELL_ATTENTION_STATUS;
                        setCookie('soul_main_status',AUTO_CANCELL_ATTENTION_STATUS);
                        gotoPageFan();
                    }
                }catch (err) {
                    console.log(err)
                }
                //goto next page
                url = window.location.href;
		        url = url.substring(0,url.indexOf('fans')+4);
                url += '?&page='+ (parseInt(times)+1); 
                console.log('go to next page url:' + url);
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
    var currStatus = getCookie('auto_cancel_attention_status')//localStorage.auto_cancel_attention_status;
    var times = getCookie('auto_cancel_attention_status_times');//localStorage.auto_cancel_attention_status_times;
    times = parseInt(times);
    console.log('in autoCancelAttention ' + currStatus + ' val '+times);
    if(typeof currStatus == 'undefined' || currStatus == 'gotoPage' ) {
        //localStorage.auto_cancel_attention_status = 'cancel';
        setCookie('auto_cancel_attention_status','cancel');
        gotoPageMyFollow();
    }else {
        try {
            cancelSingleUser();
        }catch(err) {
            console.log(err);
        }
        if (typeof times == 'undefined') {
            times = 2 
        } else if (times < 0 || times > 100) {
            times = 2;
        }

        //localStorage.auto_cancel_attention_status_times = parseInt(times) + 1;
        setCookie('auto_cancel_attention_status_times',parseInt(times) + 1);
        if(times >= 60) {
            clearAllStatus();
            //localStorage.setItem('soul_main_status', AUTO_PAY_ATTENTION_STATUS);
            setCookie('soul_main_status',AUTO_PAY_ATTENTION_STATUS);
            gotoPageFan();
        }
        if (parseInt(times) <= 0) {
            times = 2;
        }
        setTimeout(function(){
            gotoPageMyFollow(60-times);
        },2000);
    }
}

/*
status:
a: gotopage
b: likeall
* */
function autoLikeAll() {
    var currStatus = getCookie('auto_cancel_attention_status')//localStorage.auto_cancel_attention_status;

    if(typeof currStatus == 'undefined' || currStatus == 'gotoPage' ) {
        //localStorage.auto_cancel_attention_status = 'likeAll';
        setCookie('auto_cancel_attention_status','likeAll')
        gotoHomePage();
    } else {
        likeAll();
        setTimeout(function() {
            //localStorage.setItem('soul_main_status', AUTO_PAY_ATTENTION_STATUS);
            setCookie('soul_main_status',AUTO_PAY_ATTENTION_STATUS)
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
    //localStorage.setItem('soul_main_status', AUTO_PAY_ATTENTION_STATUS);
    setCookie('soul_main_status',AUTO_PAY_ATTENTION_STATUS);
    clearAllStatus();
    window.location.href = WEIBO;
}

function closeAutoModel() {
    console.log('change auto model');
    if(typeof(Storage) === "undefined") {
        console.log('Sorry! No Web Storage support..');
        return;
    }
    //localStorage.setItem('soul_main_status', MANUALLY);
    setCookie('soul_main_status',MANUALLY);
}
