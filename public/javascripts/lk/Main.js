/*
 * Copyright (c) 2006-2009 Sun Microsystems, Inc.
 *
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Main.js.  System startup and demo loading.
 */

module('lively.Main').requires().toRun(function() {

Object.extend(Global, {
	onload: function main() { // window.onload
		// the delay here is a workaround to give FF 2.0 the time to update
		// the DOM to reflect the geometry of objects on the screen, which is
		// needed to figure out font geometry. Apparently the update happens
		// after control returns to the caller of JS
		function main() { new lively.Main.Loader().systemStart() };
		main.logCompletion("main").delay(Config.mainDelay);
		// alternative? window.addEventListener("DOMContentLoaded", main, false);
	},	
});

Object.subclass('lively.Main.Loader', {

	configPatches: function() {
		// Class browser visibility can be overridden with Config.browserAnyway
		Config.showBrowser = !Config.skipMostExamples || Config.browserAnyway;
	},

	debuggingExtras: function() {
		// Name the methods for showStack
		if (Config.tallyLOC && lively.lang.Execution.tallyLOC) lively.lang.Execution.tallyLOC();
		// Name the methods for showStack
		if (Config.debugExtras) lively.lang.Execution.installStackTracers();
	},

	clipboardHack: function() {
		if (!Config.suppressClipboardHack) ClipboardHack.ensurePasteBuffer();
	},

	replaceWindowMorphIfNotExisiting: function() {
		// This stub allows us to run without Widgets.js
		if(!WindowMorph) { WindowMorph = function() {} }
	},

	documentHasSerializedMorphs: function(doc) {
	    var nodes = doc.getElementsByTagName("g");
		return nodes && nodes.length > 0;
		// nodes[0].getAttribute("type") == "WorldMorph"; // world is not always serialized
	},

	setupCounter: function(doc) {
		var maxCount = new Query('//*[@id]').findAll(doc).inject(0, function(max, ea) {
			function getNumber(id) { return Number(id.split(':')[0]) }
			var no =  getNumber(ea.getAttribute('id')) || 0
			return Math.max(max, no);
		});
		lively.data.Wrapper.prototype.newId(maxCount);
	},

	browserSpecificFixes: function() {
		if (Global.navigator.appName == 'Opera')
			window.onresize();
	},

	showWikiNavigator: function() {
		require('lively.LKWiki').toRun(function() {
			console.log('starting WikiNavigator');
			WikiNavigator.enableWikiNavigator();
		});
	},

	systemStart: function() {
		console.group("World loading");

		// -----------------
		this.configPatches();
		this.debuggingExtras();
		this.clipboardHack();
		this.replaceWindowMorphIfNotExisiting()
		// ------------------------

	    var world = null;
	    var canvas = Global.document.getElementById("canvas");
		var loader = this;


	    if (canvas.height && canvas.height.baseVal && canvas.height.baseVal.value < 200) {
	        // a forced value, some browsers have problems with height=100%
	        canvas.setAttribute("height", "800");
	    }
	    var importer = new Importer();

		Event.prepareEventSystem();

		if (loader.documentHasSerializedMorphs(document)) {
			loader.setupCounter(document);
	        require(Config.modulesBeforeChanges).toRun(function() {
				var changes = !Config.skipChanges && ChangeSet.fromWorld(document.documentElement);
				changes && changes.evaluateWorldRequirements();
				require(Config.modulesBeforeWorldLoad).toRun(function() {
					changes && changes.evaluateAllButInitializer();
					require(Config.modulesOnWorldLoad).toRun(function() {
						world = importer.loadWorldContents(document);
			            world.displayOnCanvas(canvas);
			            console.log("world is " + world);
						changes && changes.evaluateInitializer();

			            if (Config.showWikiNavigator) loader.showWikiNavigator();

						console.groupEnd("World loading");
					})
				})
	        })
	    } else {
			// Create an empty world
			require(Config.modulesBeforeChanges.concat(Config.modulesBeforeWorldLoad).concat(Config.modulesOnWorldLoad)).toRun(function() {
				world = new WorldMorph(canvas);
				world.displayOnCanvas(canvas);

				console.log("created empty world");
				console.groupEnd("World loading");

				loader.browserSpecificFixes();

				if(Config.useShadowMorphs) HandMorph.prototype.useShadowMorphs = true;

			})
	    }

	},
});

}); // end of module