var system = require('system'),
	time = Date.now();

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

function _login_frontend(page, info) {
	// frontend project example
	passValidation(page, 'input[name=username]', info.userInfo.userAccount);
	passValidation(page, 'input[name=password]', info.userInfo.userPassword);
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

var searchLevel = 2;

var uatLinkArray =
	[
		'http://bh-reseller-uat.paradise-soft.com.tw/',
		'http://c7-reseller-uat.paradise-soft.com.tw/',
		'http://c8-reseller-uat.paradise-soft.com.tw/',
		'http://hy-reseller-uat.paradise-soft.com.tw/',
		'http://ls-reseller-uat.paradise-soft.com.tw/',
		'http://lv-reseller-uat.paradise-soft.com.tw/',
		'http://tz-reseller-uat.paradise-soft.com.tw/'
	];
var testUserArray =
	[
		{
			userAccount: 'bcp88888',
			userPassword: 'bcp88888'
		}, {
			userAccount: 'dcp99999',
			userPassword: 'dcp99999'
		}, {
			userAccount: 'ccp88889',
			userPassword: 'ccp88889'
		}
	];

var reseller = [];

var pageObjectList = [],
	pageByPage = true,
	testList = [];

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
		var cookiesString = '';
		for (var i = 0; i < page.cookies.length; i++) {
			cookiesString += (page.cookies[i].name) + ',';
		}

		if (/-reseller,/.test(cookiesString)) {
			page.onLoadFinished = function() {};
			testingThing(page, info, sec);
		}
	};

	page.clearCookies();
	page.open(info.url, function(status) {
		failTest(status);

		console.log('status: ' + status);
		_login_frontend(page, info);
	});
}

function testingThing(page, info, sec) {

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

function exit() {
	console.log('\n**************');
	console.log('*exit Phantom*');
	console.log('**************');
	console.log('total time spend: ' + Math.round(((Date.now() - time) / 100)) / 10 + 'sec\n');
	phantom.exit();
}

// add server response timeout handler
page.settings.resourceTimeout = 60000;