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


/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

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
  //chrome.tabs.executeScript(null, {file: "jquery-2.1.4.min.js"});
  //chrome.tabs.executeScript(null, {file: "my.js"});
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

}


//main logic
var users = []
document.addEventListener('DOMContentLoaded', function() {
      initListener();
    }
);
