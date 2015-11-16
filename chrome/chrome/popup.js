// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/*
message:
{
cmd: cmd string required
data: option
}
* */

function checkTime(callback) {
    chrome.storage.sync.get(['soulPayAttendCnt','soul_secret'], function(value) {
        var secret=null
        var val = null
        var showalert = false;
        if(typeof value === "undefined") {
            val = 1
        }else {
            secret = value['soul_secret'];
            val = value['soulPayAttendCnt']
        }
        console.log(value)
        if(typeof val !== 'number') {
            val = 1
        }
        chrome.storage.sync.set({'soulPayAttendCnt':(val+1)})

        if (val % 50 == 0) {
            showalert = true;
            console.log('已经使用了五十次该功能，作为友情赞助会打开我们的网站。sorry');
            var newURL = "http://www.gouwu168.com/";
            chrome.tabs.create({ url: newURL });
        }else if (val % 500 == 0) {
            console.log('已经使用了五百次该功能，作为友情赞助会打开我们的网站。sorry');
            var newURL = "http://www.gouwu168.com/";
            chrome.tabs.create({ url: newURL });
        }
        if(false) {
            var secret = prompt("万分抱歉，广告时间：请微信关注“索尔眼镜”。如果不想出现次对话框，请联系微信客服免费获取密码")
            console.log(secret)
            if (secret != null) {
                chrome.storage.sync.set({'soul_secret': secret})
            }
        }
        callback();
    })
}
function initListener() {
  document.getElementById('url').onclick = function() {
      var newURL = "http://www.gouwu168.com/weibotool";
      chrome.tabs.create({ url: newURL });
  }

  document.getElementById('cancelUserBtn').onclick = function(){
      checkTime(function(){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {cmd: "cancelSingleAttentionUser"}, function(response) {
                  console.log(response);
              });
          });
      })
  }

  document.getElementById('cancelAllUserBtn').onclick = function(){
      checkTime(function(){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {cmd: "cancelAllAttentionUser"}, function(response) {
                  console.log(response);
              });
          });
      })
    }

    document.getElementById('likeBtn').onclick = function(){
        checkTime(function(){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {cmd: "likeAllUser"}, function(response) {
                    console.log(response);
                });
            });
        })
    }

    document.getElementById('payAttendToAllBtn').onclick = function(){
        checkTime(function(){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {cmd: "payAttendToAll",alert:false, msg:''}, function(response) {
                    console.log(response);
                });
            });
        })
    }


    document.getElementById('openAutoModelBtn').onclick = function(){
        checkTime(function(){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {cmd: "openAutoModelBtn",alert:false, msg:''}, function(response) {
                    console.log(response);
                });
            });
        })
    }

    document.getElementById('closeAutoModelBtn').onclick = function(){
        checkTime(function(){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {cmd: "closeAutoModelBtn",alert:false, msg:''}, function(response) {
                    console.log(response);
                });
            });
        })
    }
}

//main logic
document.addEventListener('DOMContentLoaded', function() {
        initListener();
    }
);