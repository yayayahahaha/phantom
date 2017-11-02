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

var finishedCount = 1;
page.onLoadFinished = function(input) {
	capture(page, {
		name: 'finished' + finishedCount,
		type: '.png',
		directory: 'images/'
	});
	finishedCount++;
	console.log('onLoadFinished: ' + input);
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
				phantom.exit();
			}, 1000);

		}, 3000);

	} else {
		console.log("Load Page Failed!");
	}
});

function capture(page, imageInfo) {
	try {
		page.render(imageInfo.directory + imageInfo.name + imageInfo.type);
		console.log('capture success!');
	} catch (e) {
		console.log('capture failed!');
	}
}