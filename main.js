var page = require('webpage').create(),
	system = require('system'),
	time = Date.now(),

	browserInfo = {
		// url: "http://localhost:3000",
		url: "https://dartnote.com/posts",
		imageInfo: {
			directory: 'images/',
			name: 'adonuxt',
			type: '.png'
		},
		size: {
			width: 1920,
			height: 950
		},
		clipSize: {
			width: 1920,
			height: 950
		}
	};

//this listenter could make javascript console.log in web show on terminal!
page.onConsoleMessage = function(msg) {
	// console.log(msg);
};

// the size of browser
page.viewportSize = {
	width: browserInfo.size.width,
	height: browserInfo.size.height
};

// the clip range of screen shut
page.clipRect = {
	top: 0,
	left: 0,
	width: browserInfo.clipSize.width,
	height: browserInfo.clipSize.height
};

// main javascrpit part
page.open(browserInfo.url, function(status) {
	console.log("Status: " + status);
	if (status === "success") {
		page.render(browserInfo.imageInfo.directory + browserInfo.imageInfo.name + browserInfo.imageInfo.type);

		var divs = page.evaluate(function() {
			var str = [];
			var div = document.querySelectorAll('.item > a > img');
			for (var i = 0; i < div.length; i++) {
				str.push(div[i].src);
			}
			return str;
		});

		console.log(JSON.stringify(divs));

	} else {
		console.log("Load Page Failed!");
	}

	phantom.exit();
});