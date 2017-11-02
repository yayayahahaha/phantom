var page = require('webpage').create(),
	system = require('system'),
	time = Date.now(),

	browserInfo = {
		url: "http://localhost:8080",
		// url: "https://dartnote.com/posts",
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

// add server response timeout handler
page.settings.resourceTimeout = 60000;

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

page.onResourceTimeout = function(request) {
	add_message("error", "ResourceTimeout (60s)");
	render_message();
};

//this listenter could make javascript console.log in web show on terminal!
page.onConsoleMessage = function(msg) {
	console.log(msg);
};

// main javascrpit part
page.open(browserInfo.url, function(status) {
	console.log("Status: " + status);
	if (status === "success") {

		window.setTimeout(function() {
			// page.render(browserInfo.imageInfo.directory + browserInfo.imageInfo.name + browserInfo.imageInfo.type);

			var inputValue = page.evaluate(function() {
				document.querySelector("#nzc-header-account").value = 'flycchung';
				document.querySelector("#nzc-header-password").value = '123qwe';
				document.querySelector("#nzc-header-login").click();
			});

			setTimeout(function() {

				page.render(browserInfo.imageInfo.directory + browserInfo.imageInfo.name + browserInfo.imageInfo.type);
				phantom.exit();

			}, 3000);

		}, 3000);

	} else {
		console.log("Load Page Failed!");
	}
});