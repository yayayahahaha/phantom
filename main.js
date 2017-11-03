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

var pageObjectList = [];
for (var i = 0; i < testList.length; i++) {
	pageObjectList.push(require('webpage').create());
	var p = pageObjectList[i];
	pageOpen(pageObjectList[i], testList[i]);
}

function pageOpen(page, info) {
	page.onConsoleMessage = function(msg) {
		console.log(msg);
	};

	page.open(info.url, function(st) {

		page.open(info.url + 'm/login', function() {

			// login
			page.evaluate(function(loginInfo) {
				document.querySelector("#login-username").value = loginInfo.userAccount;
				document.querySelector("#login-password").value = loginInfo.userPassword;

				document.querySelector('#login-button').click();
			}, loginInfo);

			// after login through mogil version. go to test page,
			// timeout function is for cookie stuff
			setTimeout(function() {
				page.open(info.url + '/lottery/hk', function() {
					setTimeout(function() {
						page.evaluate(function(info) {
							try{
							    console.log(document.querySelector('#hk_rules').id);
							    document.querySelector('.howToPlay.first > a').click();
							    document.querySelector(".pop_content.rule_pop").scrollTop = 5331;
							}catch(e){
								console.log("error! "+ info.name);
							}
						}, info);

						_capture(page, {
							name: info.name
						});

						finishedSignal();
					}, 5000);
				});
			}, 5000);
		});

	});
}

var finishedCount = 0;

function finishedSignal() {
	finishedCount++;
	if (finishedCount == testList.length) {
		console.log('phantom will exit after 1 sec!');
		setTimeout(function() {
			exit();
		}, 1000);
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

page.onResourceTimeout = function(request) {
	add_message("error", "ResourceTimeout (60s)");
	render_message();
};

//this listenter could make javascript console.log in web show on terminal!
page.onConsoleMessage = function(msg) {
	// console.log(msg);
};

page.onUrlChanged = function(input) {};

page.onLoadFinished = function(status) {
	console.log('onLoadFinished: ' + status);
	page.evaluate(function() {
		console.log(window.location.href + '\n');
	});
};

page.onResourceRequested = function(req) {};

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

var fakeUserList = [{
	accountNPassword: 'fake1fake1',
	withdrawal: 111111,
	name: 'fake1',
	email: 'fake1@fake1.com',
	qq: '12345',
	phone: '09123456789',
	aid: 'fake1',
}];

function createWebAccount(userArray) {
	console.log('\n***************');
	console.log('*Phantom Start*');
	console.log('***************');
	console.log('http://localhost:' + browserInfo.url);

	// main javascrpit part
	page.open('http://localhost:8080/reg', function(status) {
		console.log("Status: " + status);
		if (status === "success") {
			capture('firstLook');

			var user = fakeUserList[0];

			page.evaluate(function(user) {
				document.querySelector('input[name="ts_account"]').value = user.accountNPassword;
				document.querySelector('input[name="ts_account"]').focus();
			}, user);
			page.sendEvent('keypress', page.event.key[0]);
			page.evaluate(function() {
				document.querySelector('input[name="ts_account"]').blur();
				document.querySelector('input[name="ts_account"]').focus();
			});
			page.sendEvent('keypress', page.event.key.Backspace);
			page.evaluate(function() {
				document.querySelector('input[name="ts_account"]').blur();
			});

			page.evaluate(function(user) {
				document.querySelector('input[name="ts_password"]').value = user.accountNPassword;
				document.querySelector('input[name="ts_password"]').focus();
			}, user);
			page.sendEvent('keypress', page.event.key[0]);
			page.evaluate(function() {
				document.querySelector('input[name="ts_password"]').blur();
				document.querySelector('input[name="ts_password"]').focus();
			});
			page.sendEvent('keypress', page.event.key.Backspace);
			page.evaluate(function() {
				document.querySelector('input[name="ts_password"]').blur();
			});

			page.evaluate(function(user) {
				document.querySelector('input[name="ts_confirmpassword"]').value = user.accountNPassword;
				document.querySelector('input[name="ts_confirmpassword"]').focus();
			}, user);
			page.sendEvent('keypress', page.event.key[0]);
			page.evaluate(function() {
				document.querySelector('input[name="ts_confirmpassword"]').blur();
				document.querySelector('input[name="ts_confirmpassword"]').focus();
			});
			page.sendEvent('keypress', page.event.key.Backspace);
			page.evaluate(function() {
				document.querySelector('input[name="ts_confirmpassword"]').blur();
			});

			page.evaluate(function(user) {
				document.querySelector('input[name="ts_withdrawals"]').value = user.withdrawal;
				document.querySelector('input[name="ts_withdrawals"]').focus();
			}, user);
			page.sendEvent('keypress', page.event.key[0]);
			page.evaluate(function() {
				document.querySelector('input[name="ts_withdrawals"]').blur();
				document.querySelector('input[name="ts_withdrawals"]').focus();
			});
			page.sendEvent('keypress', page.event.key.Backspace);
			page.evaluate(function() {
				document.querySelector('input[name="ts_withdrawals"]').blur();
			});

			page.evaluate(function(user) {
				document.querySelector('input[name="ts_name"]').value = user.name;
				document.querySelector('input[name="ts_name"]').focus();
			}, user);
			page.sendEvent('keypress', page.event.key[0]);
			page.evaluate(function() {
				document.querySelector('input[name="ts_name"]').blur();
				document.querySelector('input[name="ts_name"]').focus();
			});
			page.sendEvent('keypress', page.event.key.Backspace);
			page.evaluate(function() {
				document.querySelector('input[name="ts_name"]').blur();
			});

			page.evaluate(function(user) {
				document.querySelector('input[name="ts_mail"]').value = user.email;
				document.querySelector('input[name="ts_mail"]').focus();
			}, user);
			page.sendEvent('keypress', page.event.key[0]);
			page.evaluate(function() {
				document.querySelector('input[name="ts_mail"]').blur();
				document.querySelector('input[name="ts_mail"]').focus();
			});
			page.sendEvent('keypress', page.event.key.Backspace);
			page.evaluate(function() {
				document.querySelector('input[name="ts_mail"]').blur();
			});

			page.evaluate(function(user) {
				document.querySelector('input[name="ts_qq"]').value = user.qq;
				document.querySelector('input[name="ts_qq"]').focus();
			}, user);
			page.sendEvent('keypress', page.event.key[0]);
			page.evaluate(function() {
				document.querySelector('input[name="ts_qq"]').blur();
				document.querySelector('input[name="ts_qq"]').focus();
			});
			page.sendEvent('keypress', page.event.key.Backspace);
			page.evaluate(function() {
				document.querySelector('input[name="ts_qq"]').blur();
			});

			page.evaluate(function(user) {
				document.querySelector('input[name="ts_phone"]').value = user.phone;
				document.querySelector('input[name="ts_phone"]').focus();
			}, user);
			page.sendEvent('keypress', page.event.key[0]);
			page.evaluate(function() {
				document.querySelector('input[name="ts_phone"]').blur();
				document.querySelector('input[name="ts_phone"]').focus();
			});
			page.sendEvent('keypress', page.event.key.Backspace);
			page.evaluate(function() {
				document.querySelector('input[name="ts_phone"]').blur();
			});

			page.evaluate(function(user) {
				document.querySelector('input[name="ts_aid"]').value = user.aid;
				document.querySelector('input[name="ts_aid"]').focus();
			}, user);
			page.sendEvent('keypress', page.event.key[0]);
			page.evaluate(function() {
				document.querySelector('input[name="ts_aid"]').blur();
				document.querySelector('input[name="ts_aid"]').focus();
			});
			page.sendEvent('keypress', page.event.key.Backspace);
			page.evaluate(function() {
				document.querySelector('input[name="ts_aid"]').blur();
			});



			page.evaluate(function() {
				document.querySelector('#registerbtn').click();
			});

			capture('inputInfo');

			setTimeout(function() {
				capture('clickRegister');
				exit();
			}, 1000);
			return;
		}

		console.log("Load Page Failed!");
		exit();

	});
}

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