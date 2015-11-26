console.log('run in event page:' + (new Date()).toString())
setTimeout(function(){
    console.log('auto refresh page:' + (new Date()).toString());
    window.location.href='weibo.com';
},10*60*1000);