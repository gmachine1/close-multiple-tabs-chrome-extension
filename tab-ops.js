function closeSelected() {
	var toCloseIds = [];
	var toCloseElems = [];
	var options = document.getElementsByTagName("option");
	
	var highestIndex = -1;
	var len = tabs.length;
	for (var i = 0; i < len; i++)
	{
	    if (options[i].selected)
	    {
			toCloseIds.push(parseInt(options[i].value));
			toCloseElems.push(options[i]);
			highestIndex = i;
	    }
	}
	chrome.tabs.remove(toCloseIds);
	for (i = 0; i < toCloseElems.length; i++)
	{
	    toCloseElems[i].remove();
	}

	// select the next tab after the closed ones
	if (highestIndex >= 0) {
		var nextFocusIndex = -1;
		if (highestIndex == len-1) {
			nextFocusIndex = len-1-toCloseIds.length
		} else {
			nextFocusIndex = highestIndex+1-toCloseIds.length
		}
		options[nextFocusIndex].selected = true;
	}
};

function organizeTabs() {
	function moveTabs(tabsToMove, targetIndex) {
		// console.log(tabsToMove + " left to move")
		if (tabsToMove.length == 0) {
			groupTabsAt(targetIndex)
		} else {
			chrome.tabs.move(tabsToMove.pop(), {'index': targetIndex}, function(movedTab) {
				// console.log("moved tab " + movedTab.url + " " + movedTab.id + " to index " + targetIndex)
				moveTabs(tabsToMove, targetIndex+1)
			})
		}
	}

	function groupTabsAt(index) {
		chrome.tabs.query({currentWindow: true}, function(tabs) {
			// console.log('groupTabsAt: ' + index)
			let {tabsToMove, targetIndex} = getTabsToMove(tabs, index)
			if (tabsToMove == null)
				return;

			if (tabsToMove.length == 0)
				groupTabsAt(targetIndex)
			else
				moveTabs(tabsToMove.reverse(), targetIndex)
		})
	}

	groupTabsAt(0)
};

function gotoTabId(tabId) {
	chrome.tabs.get(tabId, function(tab) {
		chrome.tabs.highlight({'tabs': tab.index}, function() {});
	})
}

function gotoSelected() {
	chrome.tabs.query({currentWindow: true}, function(tabs) { 
		tabs.sort(tabComparator)
		var tabId = null
		var options = document.getElementsByTagName("option");
		for (var i = 0; i < tabs.length; i++)
		{
		    if (options[i].selected)
		    {
				tabId = tabs[i].id
				break
		    }
		}
		if (tabId) {
			gotoTabId(tabId)
		}
	})
}

// same url or same domain plus title
function removeDuplicates() {
	console.log("enter function removeDuplicates")
	chrome.tabs.query({currentWindow: true}, function(tabs) { 
		let {toCloseIds, toCloseElems} = getDuplicates(tabs)
	    chrome.tabs.remove(toCloseIds);
		for (i = 0; i < toCloseElems.length; i++)
		{
		    toCloseElems[i].remove();
		}
	} );
}