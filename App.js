Ext.define('CustomApp', {
	extend: 'Rally.app.App',
	componentCls: 'app',
	layout: {
		type: 'fit',
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
		var days_for_new_post = 3;
		
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
		
		// display an entry for each item
		var output_html = "";
		var items = blog_feed.getElementsByTagName( "item" );
		for ( var i = 0; i < items.length; i++ ) {
			// if the post is new, give it visual distinction
			var date = new Date( items[i].getElementsByTagName( "pubDate" )[0].childNodes[0].nodeValue );
			var new_post = Date.now() - date <= ( 86400000 * days_for_new_post );
			
			output_html += "<div class='post'>";
						
			// add the title
			var title = items[i].getElementsByTagName( "title" )[0].childNodes[0].nodeValue;
			var post_link = items[i].getElementsByTagName( "link" )[0].childNodes[0].nodeValue;
			if ( new_post ) {
				output_html += "<div class='title new'>";
			} else {
				output_html += "<div class='title'>";
			}
			output_html += "<a href='" + post_link + "' target='_blank'>" + title + "</a></div>";
			
			// add the author and date
			var author = items[i].getElementsByTagName( "creator" )[0].childNodes[0].nodeValue;
			// the link to a post's author is their first and last name, separated by '-'
			var author_link = "https://www.rallydev.com/blog/authors/" + author.replace( ' ', '-' ).toLowerCase();
			var date_string = items[i].getElementsByTagName( "pubDate" )[0].childNodes[0].nodeValue;
			output_html += "<div class='metadata'>";
			output_html += "by " + "<a href='" + author_link + "' target='_blank' >" + author + "</a>";
			output_html += " on " + date.toLocaleDateString();
			output_html += "</div>";
			
			// add a thumbnail
			var content_html = items[i].getElementsByTagName( "description" )[0].childNodes[0].nodeValue;
			// search for the first img src as creating a DOM would trigger loading or all the images
			var thumbnail_srcs = content_html.match( /src="(.*?)"/ );
			if ( thumbnail_srcs !== null ) {
				var first_thumbnail = thumbnail_srcs[0].substring(5, thumbnail_srcs[0].length - 1 );
				var thumbnail = "https://www.rallydev.com" + first_thumbnail;
				output_html += "<div class='thumbnail'><img src='" + thumbnail + "' /></div>";
			}
			
			// add a preview of the text
			// create a copy of the html without image src to avoid loading all images
			output_html += "<div class='text'>";
			var content_html_no_images = content_html.replace( /src=".*?"/g, 'src=""' );
			var div = document.createElement( "div" );
			div.innerHTML = content_html_no_images;
			var content_text = div.textContent || div.innerText || "";
			output_html += content_text;
			output_html += "</div>";
			
			// add "read more..."
			output_html += "<div class='readmore'><a href='" + post_link + "'>Read More...</a></div>";
			
			// add a separator
			output_html += "</div><hr/>";
		}
		
        this.add({
            xtype: 'component',
            html: output_html
        });
	} 
});
