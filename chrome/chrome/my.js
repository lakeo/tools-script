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
            }else if (request.cmd == "payAttentionToAll"){
                checkAlert(request);
                payAttentionToAll();
                sendResponse(
                    {
                        cmd:'userList',
                        data:'empty'
                    }
                )
            } else if (request.cmd == 'likeAllUser') {
                likeAll();
            } else if (request.cmd == 'openAutoModelBtn') {
                openAutoModel();
            } else if (request.cmd == 'closeAutoModelBtn') {
                closeAutoModel();
            } else if (request.cmd == 'cancelNotVIPUser') {
                cancelNotVipUser();
            }
        });
}

function main() {
    //if(typeof(Storage) === "undefined") {
    //    console.log('Sorry! No Web Storage support..');
    //    return;
    //}

    var mainStatus =  getCookie(MAIN_STATUS);//localStorage.soul_main_status;
    if (typeof(mainStatus) === 'undefined') {
        console.log('soul_main_status is null')
        return;
    }
    console.log('current status is ' + mainStatus);

    //避免错误发生，在300秒之后如果无事情发生，必然会刷新
    //此处无法解决所有问题，其他js错误可能导致下面的代码无法执行
    //解决方案是使用一个自动刷新插件，协作操作
    setTimeout(function(){
        if (mainStatus != MANUALLY)
            window.location.href='http://weibo.com';
    },305000);

    try{
        if (mainStatus == MANUALLY) {
            console.log('do nothing');
        } else if (mainStatus == AUTO_PAY_ATTENTION_STATUS) {
            autoPayAttention();
        } else if (mainStatus == AUTO_CANCELL_ATTENTION_STATUS) {
            autoCancelAttention();
        } else if (mainStatus == AUTO_LIKE_ALL_STATUS) {
            autoLikeAll();
        }
    }catch(err) {
        console.log(err);
    }
}

initListener();
main();
