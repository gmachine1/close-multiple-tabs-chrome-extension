function getDomainName(url) {
	hostname = (new URL(url)).hostname;
	if (hostname.startsWith('www.')) {
		hostname = hostname.slice('www.'.length)
	}
	return hostname
};

tabComparator = function(tab1, tab2) {
	function stringComparator(s1, s2) {
		s1Lower = s1.toLowerCase()
		s2Lower = s2.toLowerCase()
		if (s1Lower < s2Lower)
			return -1
		else if (s1Lower == s2Lower)
			return 0
		return 1
	};
	var dn1 = getDomainName(tab1.url)
	var dn2 = getDomainName(tab2.url)
	sc = stringComparator(dn1, dn2)
	return sc == 0 ? stringComparator(tab1.title, tab2.title) : sc
};

function getDuplicates(tabs) {
	tabs.sort(tabComparator)
	var toCloseIds = [];
	var toCloseElems = [];
	var options = document.getElementsByTagName("option");
	urls = new Set()
	titles = new Set()
    
    prevUrl = null
    prevDomain = null
    prevTitle = null

    for (var i = 0; i < tabs.length; i++) {
    	var curDomain = getDomainName(tabs[i].url)
    	if (curDomain != prevDomain) {
    		prevDomain = curDomain
    		urls.clear()
    		titles.clear()
    	} else if (urls.has(tabs[i].url) || titles.has(tabs[i].title)) {
    		toCloseIds.push(tabs[i].id)
    		toCloseElems.push(options[i])
    	}
    	urls.add(tabs[i].url)
    	titles.add(tabs[i].title)
    }
    return {'toCloseIds': toCloseIds, 'toCloseElems': toCloseElems}
};

function getTabsToMove(tabs, index) {
	if (index >= tabs.length) return {'tabsToMove': null, 'targetIndex': null};
	domainName = getDomainName(tabs[index].url)
	while (index+1 < tabs.length && getDomainName(tabs[index+1].url) == domainName) {
		index++
	}
	targetIndex = index+1
	tabsToMove = []
	for (j = targetIndex; j < tabs.length; j++) {
		curDomain = getDomainName(tabs[j].url)
		if (curDomain == domainName) {
			tabsToMove.push(tabs[j].id);
		}
	}
	return {'tabsToMove': tabsToMove, 'targetIndex': targetIndex}
};

// for testing purposes
if (typeof module !== 'undefined' && module.exports != null) {
    exports.getTabsToMove = getTabsToMove;
    exports.getDuplicates = getDuplicates;
    exports.tabComparator = tabComparator;
}