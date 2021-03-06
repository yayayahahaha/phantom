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
	passValidation(page, 'input[name=username]', info.userInfo.userAccount);
	passValidation(page, 'input[name=password]', info.userInfo.userPassword);
	if (info.project === 'admin') {
		passValidation(page, 'input[name=otp]', 1);
	}
	// return;
	page.evaluate(function() {
		document.querySelector('.form-actions button').click();
	});
}

function passValidation(page, query, inputValue) {
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

function failTest(status) {
	if (status === 'fail') {
		console.log('failTest Trigger!');
		page.close();
		fail++;
		finishedSignal();
		return;
	}
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
var amdin = [{
	name: 'admin',
	mode: 'localhost',
	url: 'http://localhost:8090/',
	project: 'admin',
	userInfo: {
		userAccount: 'admin',
		userPassword: 'abc123'
	}
}];

var searchLevel = 2;

var reseller = [{
	name: 'reseller_bcp88888',
	mode: 'localhost',
	url: 'http://localhost:8091/',
	project: 'reseller',
	userInfo: {
		userAccount: 'bcp88888',
		userPassword: 'bcp88888'
	},
	setting: {
		searchLevel: searchLevel //means querySelectorAll index, not agent level
	}
}, {
	name: 'reseller_dcp99999',
	mode: 'localhost',
	url: 'http://localhost:8091/',
	project: 'reseller',
	userInfo: {
		userAccount: 'dcp99999',
		userPassword: 'dcp99999'
	},
	setting: {
		searchLevel: searchLevel //means querySelectorAll index, not agent level
	}
}, {
	name: 'reseller_ccp88889',
	mode: 'localhost',
	url: 'http://localhost:8091/',
	project: 'reseller',
	userInfo: {
		userAccount: 'ccp88889',
		userPassword: 'ccp88889'
	},
	setting: {
		searchLevel: searchLevel //means querySelectorAll index, not agent level
	}
}];

var pageObjectList = [],
	pageByPage = true,
	testList = [];

// testList = prod.concat(uat);
testList = reseller;

for (var i = 0; i < testList.length; i++) {
	pageObjectList.push(require('webpage').create());
	var p = pageObjectList[i];
	// pageOpen(pageObjectList[i], testList[i], i);
}
pageOpen(pageObjectList[0], testList[0], i);

function pageOpen(page, info, sec) {
	console.log('\n***************');
	console.log('*Phantom Start*');
	console.log('***************');
	console.log(info.name);
	console.log(info.url);

	// the size of browser
	page.viewportSize = {
		width: 1920,
		height: 1200
	};
	// the clip range of screen shut
	page.clipRect = {
		top: 0,
		left: 0,
		width: 1920,
		height: 1200
	};


	page.onConsoleMessage = function(msg) {
		console.log(msg);
	};

	page.onLoadFinished = function(input, ar2) {
		/*
				console.log('onLoadFinished: ' + input);
				console.log('page.url: ' + page.url);
		*/

		var cookiesString = '';
		for (var i = 0; i < page.cookies.length; i++) {
			cookiesString += (page.cookies[i].name) + ',';
		}

		if (/-web,/.test(cookiesString)) {
			page.onLoadFinished = function() {};

			// which means user has login
			page.open(info.url + '/lottery/hk', function(status) {
				console.log(info.name + " " + status);
				failTest(status);
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
		if (/-reseller,/.test(cookiesString)) {
			page.onLoadFinished = function() {};

			page.open(info.url + 'betanalysis', function(status) {
				console.log("status: " + status);
				failTest(status);
				success++;

				// 修改時間
				passValidation(page, '[data-bind="with: searchtime"] .col-md-2 input', '2017-09-01 00:00');
				passValidation(page, '[data-bind="with: searchtime"] .col-md-2 ~ .col-md-2 input', '2017-11-01 00:00');

				var levelCount = 0;

				page.onResourceReceived = function(res) {
					var keepGoing = res.stage === 'end' && /\/apis\/revenue\?/.test(res.url);
					if (keepGoing) {
						page.onResourceReceived = function() {};
						// this timeout is for knockout
						levelCount++;
						setTimeout(function() {
							_capture(page, {
								name: info.name
							});
							if (levelCount === 4) {
								finishedSignal();
							}
						}, 0);
					}
				};
				for (var i = 0; i < 4; i++) {
					evaluateForLoop(i);
				}

				function evaluateForLoop(number) {
					try {
						setTimeout(function() {
							page.evaluate(function(number) {
								try {
									document.querySelectorAll('.col-md-8 label')[number].click();
									document.querySelector('#btnSearch').click();
									console.log('input and click');
								} catch (e) {
									console.log('catch from browser');
								}
							}, number);
						}, number * 1000);
					} catch (e) {

					}
				}
			});
		}
	};

	page.clearCookies();

	switch (info.project) {
		case 'admin':
			page.open(info.url + 'login', function(status) {
				console.log('status: ' + status);
				failTest(status);

				_login_frontend(page, info);

				setTimeout(function() {
					_capture(page);
					finishedSignal();
				}, 3000);
			});
			break;
		case 'reseller':
			page.open(info.url, function(status) {
				failTest(status);

				console.log('status: ' + status);
				_login_frontend(page, info);
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