// Passive Cache
// By Brian Baskin
// brian@thebaskins.com

// 0.1 - First release, just google cache
// 0.2 - Put window loads into new tab instead of current window
// 0.3 - Added Wayback Machine (archive.org)
// 0.4 - Small fixes and typos
// 0.5 - Pulls the url from the last instance of "http", to remove redirecters
// 1.0 - No content change, just update it to work with Firefox 1.5.
// 1.1 - Same as above, now to work with 2.0
// 1.2 - New changes made to work with 3.0
// 1.3 - Changes to meta files to support 3.6 and 4.0+. Added in filter for new Google tail
// 1.3.1 - Wrapped loose variables to be compliant with new testing

var pcache = {

	// Control which right-click items show up when.
	pcacheinit : function() {
	  document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",pcache.pcachehide,false);
	},	



	// Here, if you Right click on selected text, link, image, or text input, it'll 	
	// hide the current page lookup. Elsewise, it'll hide the link lookup
	// Current lookup is disabled at the moment
	pcachehide : function() {
	  var cm = gContextMenu;

	  cm.showItem("pcache.pcachelink", cm.onLink);
	  cm.showItem("pcache.parccachelink", cm.onLink);

	},


	pcuntaglink : function() {
	  var realURL;
	  var tempURL;
	  var URLLength;
	  var httpindex;
	  var googletailindex;


	  // full tag is: http://www.google.com/url?sa=t&ct=res&cd=?&url=

	  tempURL = gContextMenu.getLinkURL();
	  URLLength = tempURL.length;


	  //remove redirect header
	  httpindex = tempURL.lastIndexOf("http");


	  //if you find http somewhere	
	  if (httpindex != -1)
	    tempURL = tempURL.substring(httpindex, URLLength);


	  //remove Google tail
	  googletailindex = tempURL.lastIndexOf("&ei=");
	  if (googletailindex != -1)
	    tempURL = tempURL.substring(0, googletailindex);

	  // 1.3 - remove new Google tail
	  googletailindex2 = tempURL.lastIndexOf("&rct=j&q=");
	  if (googletailindex2 != -1)
	    tempURL = tempURL.substring(0, googletailindex2);


	  realURL = tempURL;
	  return realURL;
	},

	pcachelink : function() {
	  var URLheader = "http://google.com/search?q=cache:";
	  var URLfooter = "&strip=1";
	  var pageURI = pcache.pcuntaglink();

	  // 1.2 - Added decodeURIComponent - old system worked under FF2, 3.0 needs this
	  //  var finalsite = encodeURI(URLheader) + encodeURI(pageURI) + encodeURI(URLfooter);
	  var finalsite = URLheader + decodeURIComponent(pageURI) + URLfooter;

	  var tBrowser = document.getElementById("content");
	  var tab = tBrowser.addTab(finalsite);
	},


	parccachelink : function() {
  	  // 1.3 - Updated to new Wayback site
	  var URLheader = "http://web.archive.org/*/";
	  var targetURI = pcache.pcuntaglink();

	  // 1.2 - Doh, updated to decodeURIComponents; should've used this long ago
	  var finalsite = URLheader + decodeURIComponent(targetURI);

	  var tBrowser = document.getElementById("content");
	  var tab = tBrowser.addTab(finalsite);
	}

}

// Upon load, run pcacheinit()
window.addEventListener("load", pcache.pcacheinit, false);
