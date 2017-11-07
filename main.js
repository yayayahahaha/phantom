var page = require('webpage').create(),
	system = require('system'),
	time = Date.now(),
	loginInfo = {
		userAccount: 'flycchung',
		userPassword: '123qwe'
	},
	adminLoginInfo = {
		userAccount: 'admin',
		userPassword: 'abc123'
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

function _login_frontend(page, info) {
	// frontend project example
	pressValidation(page, 'input[name=username]', info.userInfo.userAccount);
	pressValidation(page, 'input[name=password]', info.userInfo.userPassword);
	if (info.project === 'admin') {
		pressValidation(page, 'input[name=otp]', 1);
	}
	// return;
	page.evaluate(function() {
		document.querySelector('.form-actions button').click();
	});
}

function pressValidation(page, query, inputValue) {
	var input = {
		query: query,
		inputValue: inputValue
	};
	page.evaluate(function(input) {
		document.querySelector(input.query).value = input.inputValue;
		document.querySelector(input.query).focus();
	}, input);
	page.sendEvent('keypress', page.event.key.A);
	page.evaluate(function(input) {
		document.querySelector(input.query).blur();
		document.querySelector(input.query).focus();
	}, input);
	page.sendEvent('keypress', page.event.key.Backspace);
	page.evaluate(function(input) {
		document.querySelector(input.query).blur();
	}, input);
}

var success = 0,
	fail = 0;

var prod = [{
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

var uat = [{
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
var localhost = [{
	name: 'localhost_name',
	mode: 'localhost',
	url: 'http://localhost:8090/',
	project: 'admin',
	userInfo: {
		userAccount: 'admin',
		userPassword: 'abc123'
	}
}];

var pageObjectList = [],
	pageByPage = false,
	testList = [];

// testList = prod.concat(uat);
testList = localhost;

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

	page.onLoadFinished = function(input, ar2) {
		console.log('onLoadFinished: ' + input);
		console.log('page.url: ' + page.url);

		var cookiesString = '';
		for (var i = 0; i < page.cookies.length; i++) {
			cookiesString += (page.cookies[i].name) + ',';
		}

		if (/-web,/.test(cookiesString)) {
			page.onLoadFinished = function() {};

			// which means user has login
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

	switch (info.project) {
		case 'admin':
			page.open(info.url, function(status) {
				if (status === 'fail') {
					fail++;
					finishedSignal();
					page.close();
					return;
				}
				console.log('status: ' + status);
				_login_frontend(page, info);
				setTimeout(function() {
					_capture(page);
					finishedSignal();
				}, 3000);
			});
			break;

		default:
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
			break;
	}
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

function exit() {
	console.log('\n**************');
	console.log('*exit Phantom*');
	console.log('**************');
	console.log('total time spend: ' + Math.round(((Date.now() - time) / 100)) / 10 + 'sec\n');
	phantom.exit();
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