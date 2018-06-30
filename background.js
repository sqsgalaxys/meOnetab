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
            if(count == tabsCount){
                var miblob = new Blob([downloadStr], {
                    type: 'text/plain'
                });
                saveAs(miblob, Date.now()+ '.mhtmlxs');
                return false;
            }
            chrome.tabs.remove(tab.id, function() { });
        });
    });

});


function updateIcon(tabId, changeInfo, tab) {
    chrome.tabs.query({},
        function(tabs){
            var ntabs = tabs.length.toString();
            chrome.browserAction.setBadgeText({text:ntabs});
            // chrome.browserAction.setBadgeText({text:ntabs});
        });
}

chrome.tabs.onCreated.addListener(updateIcon);
chrome.tabs.onRemoved.addListener(updateIcon);
chrome.tabs.onReplaced.addListener(updateIcon);

updateIcon();

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
            break;
    }
});
