var page = require('webpage').create(),
	system = require('system'),
	time = Date.now(),
	captureNumber = 0,
	captureSort = 0,
	browserInfo = {
		url: "http://localhost:8090",
		// url: "http://localhost:8091",
		imageInfo: {
			directory: 'images/',
			name: 'lv',
			type: '.png'
		},
		size: {
			width: 1024,
			height: 500
		},
		clipSize: {
			width: 1024,
			height: 500
		}
	},
	loginInfo = {
		userAccount: 'admin',
		userPassword: 'abc123'
	}; //admin
/*	loginInfo = {
		userAccount: 'bcp88888',
		userPassword: 'bcp88888'
	}; //reseller*/

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
	// console.log('onUrlChanged: ' + input);
};

page.onLoadFinished = function(input) {
	console.log('onLoadFinished: ' + input);
	page.evaluate(function() {
		console.log(window.location.href + '\n');
	});
};

page.onResourceRequested = function(req) {

};

page.onResourceReceived = function(res) {
	if (/ag_fish/.test(res.url)) {
		console.log('get fished!');
		console.log(res.url);

		setTimeout(function() {
			capture({
				name: 'fish'
			});
			page.evaluate(function() {
				document.querySelector(".s-pop-container .enter").click();
			});
		}, 0);
	}

	if (/apis\/my\/wallet\/transfer/.test(res.url)) {
		setTimeout(function() {
			capture({
				name: 'click_transfer'
			});

			exit();

		}, 0);
	}
};

function capture(imageInfo) {
	captureNumber++;
	captureSort++;
	imageInfo = imageInfo ? imageInfo : {};
	imageInfo.name = imageInfo.name ? (function() {
		captureNumber--;
		return imageInfo.name;
	})() : 'image_' + captureNumber;
	imageInfo.type = imageInfo.type ? imageInfo.type : '.png';
	imageInfo.directory = imageInfo.directory ? imageInfo.directory : 'images/';
	try {
		var imagePath = imageInfo.directory + captureSort + '_' + imageInfo.name + imageInfo.type;
		page.render(imagePath);
		console.log("Capture: " + imagePath + "\n");
	} catch (e) {
		console.log("Capture Failed!: " + imageInfo.directory + imageInfo.name + imageInfo.type + "\n");
	}
}


function login() {

	// account
	page.evaluate(function(loginInfo) {
		/*
		document.querySelector("#nzc-header-account").value = loginInfo.userAccount;
		document.querySelector("#nzc-header-password").value = loginInfo.userPassword;
		document.querySelector("#nzc-header-login").click();
		*/
		document.querySelector("input[name=username]").value = loginInfo.userAccount;
		document.querySelector("input[name=username]").focus();
	}, loginInfo);
	page.sendEvent('keypress', page.event.key.A);
	page.evaluate(function() {
		document.querySelector("input[name=username]").blur();
		document.querySelector("input[name=username]").focus();
	});
	page.sendEvent('keypress', page.event.key.Backspace);
	page.evaluate(function() {
		document.querySelector("input[name=username]").blur();
	});


	// password
	page.evaluate(function(loginInfo) {
		document.querySelector("input[name=password]").value = loginInfo.userPassword;
		document.querySelector("input[name=password]").focus();
	}, loginInfo);
	page.sendEvent('keypress', page.event.key.A);
	page.evaluate(function() {
		document.querySelector("input[name=password]").blur();
		document.querySelector("input[name=password]").focus();
	});
	page.sendEvent('keypress', page.event.key.Backspace);
	page.evaluate(function() {
		document.querySelector("input[name=password]").blur();
	});

	// opt
	page.evaluate(function() {
		document.querySelector('input[data-bind="textInput: otp"]').focus();
	});
	page.sendEvent('keypress', page.event.key[1]);
	page.evaluate(function() {
		document.querySelector('input[data-bind="textInput: otp"]').blur();
	});
}

function start() {
	console.log('\n***************');
	console.log('*Phantom Start*');
	console.log('***************\n');

	// main javascrpit part
	page.open(browserInfo.url, function(status) {


		console.log("Status: " + status);
		if (status === "success") {
			capture();
			login();

			capture();

			page.evaluate(function() {
				document.querySelector("button").click();
			});

			setTimeout(function() {
				capture();
				exit();
			}, 1000);

			setTimeout(function() {
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
	console.log('total time spend: ' + Math.round(((Date.now() - time) / 100)) / 10 + 'sec\n');
	phantom.exit();
}

start();