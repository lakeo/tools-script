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
    //localStorage.removeItem('auto_like_all_status');
    //localStorage.removeItem('auto_cancel_attention_status_times');
    //localStorage.removeItem('auto_cancel_attention_status')

    deleteCookie('auto_pay_attention_status');
    deleteCookie('auto_pay_attention_status_times');

    deleteCookie('auto_like_all_status');

    deleteCookie('auto_cancel_attention_status');
    deleteCookie('auto_cancel_attention_status_times');
    deleteCookie('auto_cancel_attention_status_times_times')
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
    //while(!jQuery('div .W_fl a[action-type="batselect"]')[0]);
    jQuery('div .W_fl a[action-type="batselect"]')[0].click();
}

function afterClick() {
    //while(!jQuery('div .W_fl a[node-type="cancelFollowBtn"]')[0]);
    jQuery('div .W_fl a[node-type="cancelFollowBtn"]')[0].click()
    //while(!jQuery('div .W_layer_btn a[node-type="ok"]')[0]);
    jQuery('div .W_layer_btn a[node-type="ok"]')[0].click()
}

function cancelSingleUser() {
    setTimeout(function(){
        beforeClick();
    },1000);

    console.log('in cancelSingleUser')
    setTimeout(function(){
        jQuery('.member_li').each(function(index){
            val = jQuery(this).find('.statu em:first');
            if( val.text() == 'Y' ){
                jQuery(this).click()
            }
        });
        setTimeout(function(){
            afterClick();
        },1500);
    },2500);
}

function cancelAllUser() {
    setTimeout(function(){
        beforeClick();
    },1000);

    console.log('in cancelAllUser')
    setTimeout(function(){
        jQuery('.member_li').each( function(index){
            jQuery(this).click();
        });
        setTimeout(function(){
            afterClick();
        },1500);
    },2500);
}

function cancelNotVipUser() {
    setTimeout(function(){
        beforeClick();
    },1000);

    console.log('in cancelNotVipUser')
    setTimeout(function(){
        jQuery('.member_li').each( function(index){
            var flag = true;
            jQuery(this).find('i[title="微博个人认证 "]').each(function(){
                flag = false;
            });
            if (flag) {
                jQuery(this).click();
            }
        })
        setTimeout(function(){
            afterClick();
        },1500);
    },2500);
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
    var url = WEIBO+uid+'/follow?ignoreg=1';
    if(typeof time != 'undefined') {
        url += '&Pl_Official_RelationMyfollow__108_page='+ time;
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
    var currStatus = getCookie(AUTO_PAY_ATTENTION_STATUS);
    var times = getCookie("auto_pay_attention_status_times");
    var lastTime = getCookie("auto_pay_attention_status_run_time");

    if (null == times || isNaN(times) || typeof times == 'undefined') {
        times = 1
    }
    if (null == lastTime || isNaN(lastTime) || typeof lastTime == 'undefined') {
        lastTime = 0;
    }
    console.log('auto attention status ' + currStatus + ' val='+times)
    if (currStatus == null || typeof(currStatus) == 'undefined' || currStatus == 'gotoPageFan') {
        setCookie('auto_pay_attention_status','gotoPageFanFan');
        setCookie("auto_pay_attention_status_times",1);
        gotoPageFan();
    } else if (currStatus == 'gotoPageFanFan'){
        //must be in fan's page
        setTimeout(function(){
            try{
                var cnt = jQuery('a[usercard]').length;
                var uid = jQuery(jQuery('a[usercard]')[parseInt(Math.random()*100) % cnt]).attr('usercard').substring(3);
                var url = WEIBO+uid+'/fans';
                setCookie('auto_pay_attention_status','payingAttention');
                window.location.href = url;
            }catch(err) {
                console.log(err)
                setCookie('auto_pay_attention_status','gotoPageFan');
                setTimeout(function(){
                    gotoPageFan();
                },1500);
            }
        },1500);
    } else if (currStatus == 'payingAttention') {
        if(parseInt(times) > 3) {
            var now = new Date();
            var ELAPSE = 15 * 60 * 1000;
            var timeStep = ELAPSE + parseInt(lastTime) - now.getTime()
            if (timeStep > ELAPSE) {
                timeStep = ELAPSE;
            }else if (timeStep < 0) {
                timeStep = 1000;	
            }
            console.log('timestep:' + timeStep+ ' now:'+now.toString() + ' lasttime:'+lastTime);
            //休息300s
            setTimeout(function() {
                setCookie('auto_pay_attention_status','gotoPageFan');
                setCookie('soul_main_status',AUTO_LIKE_ALL_STATUS);
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
    var currStatus = getCookie('auto_cancel_attention_status');
    var times = getCookie('auto_cancel_attention_status_times');
    var times_times = getCookie('auto_cancel_attention_status_times_times');

    times = parseInt(times);
    if(null == times || isNaN(times) || typeof times == 'undefined') {
        times = 0;
    }
    times_times = parseInt(times_times);
    if(null == times_times || isNaN(times_times) || typeof times_times == 'undefined') {
        times_times = 1;
    }
    console.log('in autoCancelAttention ' + currStatus + ' val '+times);
    if(typeof currStatus == 'undefined' || currStatus == 'gotoPage' || currStatus == null) {
        setCookie('auto_cancel_attention_status','cancel');
        gotoPageMyFollow(50);
    } else if (currStatus == 'cancelNotVipUser') {
        if (times >= 40) {
            clearAllStatus();
            setCookie('soul_main_status',AUTO_PAY_ATTENTION_STATUS);
            gotoPageFan();
        }
        setCookie('auto_cancel_attention_status_times',times + 1);
        try{
            cancelNotVipUser();
        }catch(err) {
            console.log(err);
        }
        setTimeout(function(){
            gotoPageMyFollow(88-times);
        },4500);
    } else {
        try {
            cancelSingleUser();
        }catch(err) {
            console.log(err);
        }
        if (typeof times == 'undefined') {
            times = 0 
        } else if (isNaN(times) || times < 0 || times > 100) {
            times = 0;
        }
        setCookie('auto_cancel_attention_status_times',parseInt(times) + 1);
        if(times >= 70 && times_times >= 1) {
            //获取当前关注用户数目
            try{
                var users = jQuery('em[class="num S_txt1"]:first').text();
                if (isNaN(users) || null == users) {
                    users = 0;
                } else {
                    users = parseInt(users);
                }
                if (users >= 2850) {
                    clearAllStatus();
                    setCookie('auto_cancel_attention_status_times',0);
                    setCookie('auto_cancel_attention_status','cancelNotVipUser');
                    gotoPageMyFollow(40);
                }
            } catch(err) {
                console.log(err);
            }
            clearAllStatus();
            setCookie('soul_main_status',AUTO_PAY_ATTENTION_STATUS);
            gotoPageFan();
        } else if (times>=70) {
            times_times += 1;
            times = 0;
            setCookie('auto_cancel_attention_status_times',times);
            setCookie('auto_cancel_attention_status_times_times',times_times);
        }
        if (parseInt(times) <= 0) {
            times = 0;
        }
        setTimeout(function(){
            gotoPageMyFollow(88-times);
        },5500);
    }
}

/*
status:
a: gotopage
b: likeall
* */
function autoLikeAll() {
    var currStatus = getCookie('auto_like_all_status');

    if(currStatus == null || typeof currStatus == 'undefined' || currStatus == 'gotoPage' ) {
        setCookie('auto_like_all_status','likeAll')
        gotoHomePage();
    } else {
        likeAll();
        setTimeout(function() {
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
    setCookie('soul_main_status',MANUALLY);
}

function openAutoCancelNotVipUser() {
    clearAllStatus();
    setCookie('auto_cancel_attention_status_times',0);
    setCookie('auto_cancel_attention_status','cancelNotVipUser');
    gotoPageMyFollow(40);
}
