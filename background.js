// [Extensions: maximize the Chrome browsing experience - Google Chrome](https://developer.chrome.com/home '0.0')
var saveAs = function(blob, name) {
    // [Deprecation] 'webkitURL' is deprecated. Please use 'URL' instead.
    // var object_url = window.webkitURL.createObjectURL(blob);
    var object_url = window.URL.createObjectURL(blob);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    save_link.href = object_url;
    save_link.download = name;
    var event = new MouseEvent("click");
    save_link.dispatchEvent(event);
}


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // https://stackoverflow.com/questions/38166241/how-can-chrome-tabs-query-show-information-of-all-tabs
    chrome.tabs.query({
        currentWindow: true,
        // https://stackoverflow.com/questions/16124285/how-to-move-a-tab-after-the-last-pinned-tab
        pinned: false
    }, function(tabs) {
        var tabsCount = tabs.length;
        var count = 0;
        var downloadStr = '';
        tabs.forEach(function(tab) {
            count += 1;
            var tabStr = tab.url + '    |    ' + tab.title + '\n';
            downloadStr += tabStr;
            if (count == tabsCount) {
                var miblob = new Blob([downloadStr], {
                    type: 'text/plain'
                });
                saveAs(miblob, Date.now() + '.mhtmlxs');
                return false;
            }
            chrome.tabs.remove(tab.id, function() {});
            // https://developer.chrome.com/extensions/tabs#type-Tab
            // alert("id+title+index: " + tab.id + tab.title + tab.index);
        });
    });

});


function updateIcon(tabId, changeInfo, tab) {
    chrome.tabs.query({},
        function(tabs) {
            var ntabs = tabs.length.toString();
            chrome.browserAction.setBadgeText({
                text: ntabs
            });
            // chrome.browserAction.setBadgeText({text:ntabs});
        });
}

chrome.tabs.onCreated.addListener(updateIcon);
chrome.tabs.onRemoved.addListener(updateIcon);
chrome.tabs.onReplaced.addListener(updateIcon);

updateIcon();

function copy(text) {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input)
    return result;
}
function covertLink(title,url){
// [How do I copy to the clipboard in JavaScript? - Stack Overflow](https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript)
    return "[" + title +"]"+"( " +url+ " \'0.0\')";

}

function copyMDLink(argument) {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        // TODO:这里只会有一个 tab 吗? <09-09-18, Me> //
        tabs.forEach(function(tab) {
            var result_link = covertLink(tab.title,tab.url);
            alert(result_link);
            copy(result_link);
        });
    });
    // alert(1);
    // 写入 系统剪切板
    copy("testExx");

}

chrome.commands.onCommand.addListener(function(command) {
    switch (command) {
        case 'close-download-bar':
            chrome.browsingData.remove({}, {
                "appcache": false,
                "cache": false,
                "cookies": false,
                "downloads": true,
                "fileSystems": false,
                "formData": false,
                "history": false,
                "indexedDB": false,
                "localStorage": false,
                "pluginData": false,
                "passwords": false,
                "webSQL": false
            }, null);
        case 'copy-current-tab-link': copyMDLink();
            break;
    }
});


// https://stackoverflow.com/questions/32718645/google-chrome-extension-add-the-tab-to-context-menu
// https://stackoverflow.com/questions/37000136/check-if-item-is-already-in-the-context-menu

// Or removeAll and create all

chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        id: "left",
        title: "left",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        id: "right",
        title: "right",
        contexts: ["all"]
    });

});

function saveTabs(tabs) {}

function saveLeftRight(index, isLeft) {
    if (isLeft === 1) {
        chrome.tabs.query({
            currentWindow: true,
            pinned: false
        }, function(tabs) {
            var downloadStr = '';
            tabs.forEach(function(tab) {
                if (tab.index < index) {
                    var tabStr = tab.url + '    |    ' + tab.title + '\n';
                    downloadStr += tabStr;
                    chrome.tabs.remove(tab.id, function() {});
                }
            });
            var miblob = new Blob([downloadStr], {
                type: 'text/plain'
            });
            saveAs(miblob, Date.now() + '.mhtmlxs');

        });
    } else {
        chrome.tabs.query({
            currentWindow: true,
            pinned: false
        }, function(tabs) {
            var downloadStr = '';
            tabs.forEach(function(tab) {
                if (tab.index > index) {
                    var tabStr = tab.url + '    |    ' + tab.title + '\n';
                    downloadStr += tabStr;
                    chrome.tabs.remove(tab.id, function() {});
                }
            });
            var miblob = new Blob([downloadStr], {
                type: 'text/plain'
            });
            saveAs(miblob, Date.now() + '.mhtmlxs');

        });

    }
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case 'left':
            saveLeftRight(tab.index, 1);
            break;
        case 'right':
            saveLeftRight(tab.index);
            break;
    }
});
