updateCount();

function updateCount(){
	chrome.windows.getLastFocused({populate:true},function(currentWindow){
		var count = currentWindow.tabs.length;
		chrome.browserAction.setBadgeText({text:count+""});
		chrome.browserAction.setBadgeBackgroundColor({color:'#FF6A00'})

	});
}

function setDefaultOptions() {
	chrome.storage.local.set({'auto_group_tabs': true}, function() {
      console.log('auto_group_tabs set to ' + true + ' by default on installation')
    })
	chrome.storage.local.set({'auto_remove_duplicates': false}, function() {
      console.log('auto_remove_duplicates set to ' + false + ' by default on installation')
    })
}

chrome.tabs.onRemoved.addListener(updateCount);
chrome.tabs.onCreated.addListener(updateCount);

chrome.runtime.onInstalled.addListener(setDefaultOptions);
