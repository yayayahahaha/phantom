var page = require('webpage').create(),
	system = require('system'),
	time = Date.now(),
	captureNumber = 0,
	browserInfo = {
		url: "http://localhost:8080",
		// url: "https://dartnote.com/posts",
		imageInfo: {
			directory: 'images/',
			name: 'lv',
			type: '.png'
		},
		size: {
			width: 1024,
			height: 400
		},
		clipSize: {
			width: 1024,
			height: 400
		}
	},
	loginInfo = {
		userAccount: 'flycchung',
		userPassword: '123qwe'
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

page.onUrlChanged = function(input) {
	console.log('onUrlChanged: ' + input);
};

page.onLoadFinished = function(input) {
	console.log('onLoadFinished: ' + input);
	capture(page);
};

page.onResourceRequested = function(req) {
	if (/ag_fish/.test(req.url)) {
		console.log("onResourceRequested: " + req.url);
		capture(page);
	}
};

page.onLoadFinished = function(input) {
	console.log('onLoadFinished');
	console.log(input);
};

page.onResourceReceived = function(res) {
	if (/ag_fish/.test(res.url)) {
		console.log('get fished!');
		console.log(res.url);

		setTimeout(function() {
			capture(page, {
				name: 'fish'
			});
			page.evaluate(function() {
				document.querySelector(".s-pop-container .enter").click();
			});
		}, 0);
	}

	if (/apis\/my\/wallet\/transfer/.test(res.url)) {
		setTimeout(function() {
			capture(page, {
				name: 'click_transfer'
			});

			exit();

		}, 0);
	}
};

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

function login() {
	page.evaluate(function(loginInfo) {
		document.querySelector("#nzc-header-account").value = loginInfo.userAccount;
		document.querySelector("#nzc-header-password").value = loginInfo.userPassword;
		document.querySelector("#nzc-header-login").click();
	}, loginInfo);
}

function start() {
	console.log('\n***************');
	console.log('*Phantom Start*');
	console.log('***************\n');

	// main javascrpit part
	page.open(browserInfo.url, function(status) {
		console.log("Status: " + status);
		if (status === "success") {
			login();

			setTimeout(function() {
				capture(page, browserInfo.imageInfo);
				page.evaluate(function() {
					document.querySelector("#nzc-nav-fish").click();
				});
			}, 1000);

		} else {
			console.log("Load Page Failed!");
		}
	});
}

function exit() {
	console.log('\n**************');
	console.log('*exit Phantom*');
	console.log('**************');
	console.log('total time spend: ' + Math.round(((Date.now() - time) / 100)) / 10 + 'sec');
	phantom.exit();
}

start();