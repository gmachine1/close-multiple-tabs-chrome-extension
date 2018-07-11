function run() {
	chrome.storage.local.get('auto_remove_duplicates', function(properties) {
		if (properties['auto_remove_duplicates']) {
			removeDuplicates()
		}
	})
	chrome.storage.local.get('auto_group_tabs', function(properties) {
    	if (properties['auto_group_tabs']) {
    		organizeTabs()
    	}
	})
	document.title = chrome.i18n.getMessage("title");
	$('#usage_instructions').html(chrome.i18n.getMessage("usage_instructions"));
    chrome.tabs.query({currentWindow: true}, displayTabs);
};

function eventDispatcher(e) {
	if ((e.keyCode || e.which) == 8) { // delete
		closeSelected()
	} else if ((e.keyCode || e.which) == 220) { // \ (backslash)
		removeDuplicates()
	} else if ((e.keyCode || e.which) == 13) { // enter
		gotoSelected()
	}
}

const MAX_SELECT_SIZE = 20

function displayTabs(tabs) {
    tabs.sort(tabComparator)

    var tabDescription = getDomainName(tabs[0].url) +' *** ' + tabs[0].title
    $('#tabs').append('<option value=\"' + tabs[0].id + '\" selected>' + tabDescription + '</option>')
    for (var i = 1; i < tabs.length; i++) {
    	var tabDescription = getDomainName(tabs[i].url) + ' *** ' + tabs[i].title
		$('#tabs').append('<option value=\"' + tabs[i].id + '\">' + tabDescription + '</option>')
    }
    $('#tabs').attr('size', Math.min(tabs.length, MAX_SELECT_SIZE))
    document.onkeyup = eventDispatcher;
    $('#tabs option').dblclick(function () {
		gotoTabId(parseInt(this.value));
    })
};

window.onload = run