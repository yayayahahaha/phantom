var page = require('webpage').create(),
	system = require('system'),
	time = Date.now(),
	// url = "https://dartnote.com/posts";
	url = "http://localhost:3000";

//this listenter could make javascript console.log in web show on terminal!
page.onConsoleMessage = function(msg) {
	console.log(msg);
};

// main javascrpit part
page.open(url, function(status) {
	console.log("Status: " + status);
	if (status === "success") {
		page.render('images/example.png');
	}
	phantom.exit();
});