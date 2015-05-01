var applicationModule = require("application");
var imageManipulation = require("../image-manipulation/image-manipulation");
var localStorage = require("../../shared/local-storage/local-storage");
var socialShare = require("../social-share/social-share");
var utilities = require("../../shared/utilities");
var dialogsModule = require("ui/dialogs");

var observable = require("data/observable");
var _viewData = new observable.Observable();

var _page,
	_selectedImageSource,
	_uniqueImageName,
	_initialised = false;

exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = _viewData;

	if (applicationModule.ios) {
		_page.ios.title = "Create New";
	}

	if(! _initialised) {
		_initialised = true;
		addRefreshOnChange();
	}
};

exports.navigatedTo = function(args) {
	//grab the image from the navigation context.
	_selectedImageSource = _page.navigationContext;
	
	_viewData.set("topText", "");
	_viewData.set("bottomText", "");
	_viewData.set("fontSize", 40);
	_viewData.set("isBlackText", false);
	_viewData.set("memeImage", _selectedImageSource);

	_uniqueImageName = utilities.generateUUID() + ".png";
};

function refreshMeme() {
	var image = imageManipulation.addText(_selectedImageSource, _viewData.topText, _viewData.bottomText, _viewData.fontSize, _viewData.isBlackText);

	_viewData.set("memeImage", image);
};

exports.saveLocally = function () {
	refreshMeme();

	var saved = localStorage.saveLocally(_uniqueImageName, _viewData.memeImage);

	if (!saved) {
		console.log("New meme not saved....");
	} else {
		var options = {
			title: "Meme Saved",
			message: "Congratulations, Meme Saved!",
			okButtonText: "OK"
		};

		dialogsModule.alert(options);
	}
};

exports.share = function() {
	socialShare.share(_viewData.memeImage);
};


function addRefreshOnChange() {
	
	_viewData.addEventListener(observable.knownEvents.propertyChange, function(changes) {
		//skip if imageSource changes
		if(changes.propertyName === "memeImage")
			return;

		refreshMeme();
	});
}