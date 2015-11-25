console.log('run in event page:' + (new Date()).toString())
setTimeout(function(){
    console.log('auto refresh page:' + (new Date()).toString());
    window.location.reload();
},20*60*1000);