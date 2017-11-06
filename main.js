var page = require('webpage').create(),
	system = require('system'),
	time = Date.now(),
	captureNumber = 0,
	captureSort = 0,
	baseUrl = "8080",
	// baseUrl = "8090",
	// baseUrl = "8091",
	browserInfo = {
		url: baseUrl,
		imageInfo: {
			directory: baseUrl === '8080' ? 'images/web/' : baseUrl === '8090' ? 'images/admin/' : baseUrl === '8091' ? 'images/reseller/' : 'wrong port',
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
		userAccount: browserInfo.url === '8080' ? 'flycchung' : browserInfo.url === '8090' ? 'admin' : browserInfo.url === '8091' ? 'bcp88888' : 'wrong port',
		userPassword: browserInfo.url === '8080' ? '123qwe' : browserInfo.url === '8090' ? 'abc123' : browserInfo.url === '8091' ? 'bcp88888' : 'wrong port',
	};

function _capture(pageObj, input) {
	imageInfo = typeof input === 'object' ? input : {
		name: input
	};

	imageInfo.name = imageInfo.name ? imageInfo.name : 'image';
	imageInfo.name += ('_' + Date.now());
	imageInfo.type = imageInfo.type ? imageInfo.type : '.png';
	imageInfo.directory = imageInfo.directory ? imageInfo.directory : 'images/';

	try {
		var imagePath = imageInfo.directory + imageInfo.name + imageInfo.type;
		pageObj.render(imagePath);
		console.log("Capture: " + imagePath + "\n");
	} catch (e) {
		console.log("Capture Failed!: " + imageInfo.directory + imageInfo.name + imageInfo.type + "\n");
	}
}

function capture(input) {
	captureNumber++;
	captureSort++;

	imageInfo = typeof input === 'object' ? input : {
		name: input
	};

	imageInfo.name = imageInfo.name ? (function() {
		captureNumber--;
		return imageInfo.name;
	})() : 'image_' + captureNumber;
	imageInfo.type = imageInfo.type ? imageInfo.type : '.png';
	imageInfo.directory = imageInfo.directory ? imageInfo.directory : browserInfo.imageInfo.directory;

	try {
		var imagePath = imageInfo.directory + captureSort + '_' + imageInfo.name + imageInfo.type;
		page.render(imagePath);
		console.log("Capture: " + imagePath + "\n");
	} catch (e) {
		console.log("Capture Failed!: " + imageInfo.directory + imageInfo.name + imageInfo.type + "\n");
	}
}

function _login(page, info) {
	// login
	page.evaluate(function(loginInfo) {
		document.querySelector("#login-username").value = loginInfo.userAccount;
		document.querySelector("#login-password").value = loginInfo.userPassword;
	}, loginInfo);
	page.evaluate(function() {
		document.querySelector('#login-button').click();
	});
	// console.log(info.name + ' login function trigger ' + info.mode);
}

function login(page, o) {
	// account and password
	page.evaluate(function(loginInfo) {
		document.querySelector("#login-username").value = loginInfo.userAccount;
		document.querySelector("#login-password").value = loginInfo.userPassword;

		setTimeout(function() {
			document.querySelector('#login-button').click();
		}, 500);
	}, loginInfo);

	return;
	// account
	page.evaluate(function(loginInfo) {
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

	if (loginInfo.userAccount === 'admin') {
		// opt
		page.evaluate(function() {
			document.querySelector('input[data-bind="textInput: otp"]').focus();
		});
		page.sendEvent('keypress', page.event.key[1]);
		page.evaluate(function() {
			document.querySelector('input[data-bind="textInput: otp"]').blur();
		});
	}
}

var success = 0,
	fail = 0;

var testList = [{
	name: 'lv',
	mode: 'debug',
	url: 'http://54.65.82.189:8005/'
}, {
	name: 'hy',
	mode: 'debug',
	url: 'http://52.78.16.76:8005/'
}, {
	name: 'ls',
	mode: 'debug',
	url: 'http://13.229.24.190:8005/'
}, {
	name: 'c7',
	mode: 'debug',
	url: 'http://13.229.32.176:8005/'
}, {
	name: 'c8',
	mode: 'debug',
	url: 'http://13.229.18.197:8005/'
}, {
	name: 'bh',
	mode: 'debug',
	url: 'http://13.229.26.202:8005/'
}, {
	name: 'tz',
	mode: 'debug',
	url: 'http://13.228.189.233:8005/'
}];

var testList2 = [{
	name: 'lv',
	mode: 'uat',
	url: 'http://lv-web-uat.paradise-soft.com.tw/'
}, {
	name: 'hy',
	mode: 'uat',
	url: 'http://hy-web-uat.paradise-soft.com.tw/'
}, {
	name: 'ls',
	mode: 'uat',
	url: 'http://ls-web-uat.paradise-soft.com.tw/'
}, {
	name: 'c7',
	mode: 'uat',
	url: 'http://c7-web-uat.paradise-soft.com.tw/'
}, {
	name: 'c8',
	mode: 'uat',
	url: 'http://c8-web-uat.paradise-soft.com.tw/'
}, {
	name: 'bh',
	mode: 'uat',
	url: 'http://bh-web-uat.paradise-soft.com.tw/'
}, {
	name: 'tz',
	mode: 'uat',
	url: 'http://tz-web-uat.paradise-soft.com.tw/'
}];


var pageObjectList = [],
	pageByPage = false;

testList = testList.concat(testList2);

for (var i = 0; i < testList.length; i++) {
	pageObjectList.push(require('webpage').create());
	var p = pageObjectList[i];
	pageOpen(pageObjectList[i], testList[i], i);
}
// pageOpen(pageObjectList[0], testList[0], i);

function pageOpen(page, info, sec) {
	console.log('\n***************');
	console.log('*Phantom Start*');
	console.log('***************');
	console.log(info.name);
	console.log(info.url);

	page.onConsoleMessage = function(msg) {
		console.log(msg);
	};

	page.onResourceError = function(res) {

		return;
		console.log('Unable to load resource (#' + res.id + 'URL:' + res.url + ')');
		console.log('Error code: ' + res.errorCode + '. Description: ' + res.errorString);
		page.onResourceError = function() {};

	};

	var cookieStatus = true;
	page.onLoadFinished = function(input, ar2) {
		console.log('onLoadFinished: ' + input);
		console.log('page.url: ' + page.url);

		var cookiesString = '';
		if (page.cookies.length !== 0) {
			for (var i = 0; i < page.cookies.length; i++) {
				cookiesString += (page.cookies[i].name) + ',';
			}
		}

		if (/\.xy-web,/.test(cookiesString) && cookieStatus) {
			cookieStatus = false;
			/* which means user has login */
			page.open(info.url + '/lottery/hk', function(status) {
				console.log(info.name + " " + status);
				if (status === 'fail') {
					fail++;
					finishedSignal();
					page.close();
					return;
				}
				success++;

				page.evaluate(function(info) {
					try {
						document.querySelector('.howToPlay.first > a').click();
						document.querySelector(".pop_content.rule_pop").scrollTop = 5331;
					} catch (e) {
						console.log("error! " + info.name);
					}
				}, info);

				if (pageByPage) {
					_capture(page, {
						name: info.name + "_" + info.mode
					});

					finishedSignal();
					page.close();
				} else {
					setTimeout(function() {
						_capture(page, {
							name: info.name + "_" + info.mode
						});

						finishedSignal();
						page.close();
					}, 0);
				}
			});
		}

	};

	page.clearCookies();
	page.open(info.url + 'm/login', function(status) {
		if (status === 'fail') {
			fail++;
			finishedSignal();
			page.close();
			return;
		}
		console.log('status: ' + status);
		_login(page, info);
	});
}

var finishedCount = 0;

function finishedSignal() {
	finishedCount++;
	if (finishedCount == testList.length) {
		console.log('phantom will exit after 1 sec!');
		setTimeout(function() {
			console.log("success: " + success);
			console.log("fail: " + fail);
			exit();
		}, 1000);
	} else if (pageByPage) {
		pageOpen(pageObjectList[finishedCount], testList[finishedCount], i);
	}
}

// add server response timeout handler
page.settings.resourceTimeout = 60000;

// the size of browser
/*
page.viewportSize = {
	width: browserInfo.size.width,
	height: browserInfo.size.height
};
*/

// the clip range of screen shut
/*
page.clipRect = {
	top: 0,
	left: 0,
	width: browserInfo.clipSize.width,
	height: browserInfo.clipSize.height
};
*/

var fakeUserList = [{
	accountNPassword: 'fake1fake1',
	withdrawal: 111111,
	name: 'fake1',
	email: 'fake1@fake1.com',
	qq: '12345',
	phone: '09123456789',
	aid: 'fake1',
}];

function start() {
	console.log('\n***************');
	console.log('*Phantom Start*');
	console.log('***************');
	console.log('http://localhost:' + browserInfo.url);

	// main javascrpit part
	page.open('http://localhost:' + browserInfo.url, function(status) {
		console.log("Status: " + status);
		if (status === "success") {
			capture('firstLook');
			login();
			capture('afterInputAccountPassword');

			page.evaluate(function() {
				document.querySelector("button").click();
			});

			setTimeout(function() {
				capture('afterLogin');
				exit();
			}, 1000);

		} else {
			console.log("Load Page Failed!");
			exit();
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

// start();
// createWebAccount();