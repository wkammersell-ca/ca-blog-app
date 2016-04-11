Ext.define('CustomApp', {
	extend: 'Rally.app.App',
	componentCls: 'app',
	layout: {
		type: 'vbox',
		align: 'left'
	},
	launch: function() {
		// other blog options (that don't work yet)
		// var blog_feed_url = "http://www.ca.com/us/rss/news/feed.aspx";
		// var blog_feed_url = "https://medium.com/feed/ca-rabu-life";
		// var blog_feed_url = "https://blogs.ca.com/feed/";
		
		// initialize variables
		var blog_feed_url = "https://www.rallydev.com/blog/all-blogs.xml";
		var blog_feed;
		var xmlhttp;
		
		// load blog feed
		// code for IE7+, Firefox, Chrome, Opera, Safari, SeaMonkey
		if ( window.XMLHttpRequest ) {
			xmlhttp=new XMLHttpRequest();
		} else { // code for IE6, IE5
			xmlhttp=new ActiveXObject( "Microsoft.XMLHTTP" );
		}
		xmlhttp.onreadystatechange=function() {
			if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
				blog_feed = xmlhttp.responseXML;
			}
		};
		xmlhttp.open( "GET", blog_feed_url, false );
		xmlhttp.send();
		
		// convert the XML to DOM for navigation
		//var parser = new DOMParser();
		//var doc = parser.parseFromString(blog_feed, "text/xml");
		
		// display an entry for each item
		var output_html = "";
		var items = blog_feed.getElementsByTagName( "item" );
		for ( var i = 0; i < items.length; i++ ) {
			// add the title as a header
			var title = items[i].getElementsByTagName( "title" )[0].childNodes[0].nodeValue;
			output_html += "<h3>" + title + "</h3>";
			
			// add the author and date
			var author = items[i].getElementsByTagName( "creator" )[0].childNodes[0].nodeValue;
			// the link to a post's author is their first and last name, separated by '-'
			var author_link = "https://www.rallydev.com/blog/authors/" + author.replace( ' ', '-' ).toLowerCase();
			var date_string = items[i].getElementsByTagName( "pubDate" )[0].childNodes[0].nodeValue;
			output_html += "by " + "<a href='" + author_link + "' target='_blank' >" + author + "</a>";
			output_html += " on " + new Date(date_string).toLocaleDateString();
			
			// add a separator
			output_html += "<hr/>";
		}
		
        this.add({
            xtype: 'component',
            html: output_html
        });
	} 
});
