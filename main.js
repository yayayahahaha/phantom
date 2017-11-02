var page = require('webpage').create(),
	system = require('system'),
	time = Date.now(),

	browserInfo = {
		url: "http://localhost:8080",
		// url: "https://dartnote.com/posts",
		imageInfo: {
			directory: 'images/',
			name: 'lv',
			type: '.png'
		},
		size: {
			width: 1920,
			height: 789
		},
		clipSize: {
			width: 1920,
			height: 789
		}
	};

// add server response timeout handler
page.settings.resourceTimeout = 60000;


// the size of browser
/*page.viewportSize = {
	width: browserInfo.size.width,
	height: browserInfo.size.height
};*/

// the clip range of screen shut
/*page.clipRect = {
	top: 0,
	left: 0,
	width: browserInfo.clipSize.width,
	height: browserInfo.clipSize.height
};*/



page.onResourceTimeout = function(request) {
	add_message("error", "ResourceTimeout (60s)");
	render_message();
};

//this listenter could make javascript console.log in web show on terminal!
page.onConsoleMessage = function(msg) {
	console.log(msg);
};


page.onUrlChanged = function(input) {
	console.log('onUrlChanged: ' + input);
};

var captureNumber = 0;
page.onLoadFinished = function(input) {
	console.log('onLoadFinished: ' + input);
	capture(page);
};


// main javascrpit part
page.open(browserInfo.url, function(status) {
	// console.log("Status: " + status);
	if (status === "success") {

		setTimeout(function() {

			page.evaluate(function() {
				document.querySelector("#nzc-header-account").value = 'flycchung';
				document.querySelector("#nzc-header-password").value = '123qwe';
				document.querySelector("#nzc-header-login").click();
			});

			setTimeout(function() {
				capture(page, browserInfo.imageInfo);

				page.evaluate(function() {
					document.querySelector("#nzc-nav-fish").click();
				});

				setTimeout(function() {
					console.log("click fished");
					capture(page);

					setTimeout(function() {
						console.log('another 3sec');
						capture(page);
						phantom.exit();
					}, 3000);

				}, 3000);

			}, 1000);

		}, 3000);

	} else {
		console.log("Load Page Failed!");
	}
});

function capture(page, imageInfo) {
	captureNumber++;
	imageInfo = imageInfo ? imageInfo : {};
	imageInfo.name = imageInfo.name ? (function() {
		captureNumber--;
		return imageInfo.name;
	})() : 'image_' + captureNumber;
	imageInfo.type = imageInfo.type ? imageInfo.type : '.png';
	imageInfo.directory = imageInfo.directory ? imageInfo.directory : 'images/';
	try {
		page.render(imageInfo.directory + imageInfo.name + imageInfo.type);
		console.log("Capture: " + imageInfo.directory + imageInfo.name + imageInfo.type + "\n");
	} catch (e) {
		console.log("Capture Failed!: " + imageInfo.directory + imageInfo.name + imageInfo.type + "\n");
	}

}