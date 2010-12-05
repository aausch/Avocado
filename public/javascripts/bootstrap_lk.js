transporter.module.create('bootstrap_lk', function(requires) {}, function(thisModule) {


thisModule.addSlots(transporter, function(add) {
  
  add.creator('livelyKernelInitializer', {}, {category: ['user interface', 'lively kernel']});
  
  add.data('userInterfaceInitializer', transporter.livelyKernelInitializer, {category: ['user interface']});

  add.method('shouldLoadModule', function (name) {
    // This is a total hack, not meant to be secure; I'm just putting it
    // in here to show how it's possible to avoid loading in the
    // programming environment. -- Adam
    if (name === "lk_programming_environment/programming_environment") {
      if (UserAgent.isIPhone) { return false; }
      if (window.isInCodeOrganizingMode) { return false; } // aaa HACK - what's the right way to do this?
      //if (window.wasServedFromGoogleAppEngine) { return currentUser && currentUser.isAdmin; }
    }
    if (name === "lk_programming_environment/code_organizer") {
      if (! window.isInCodeOrganizingMode) { return false; } // aaa HACK - what's the right way to do this?
    }
    return true;
  }, {category: ['bootstrapping']});
  
});


thisModule.addSlots(transporter.livelyKernelInitializer, function(add) {

  add.method('loadUserInterface', function (callWhenDone) {
    if (document.body) {
      this.createCanvasIfNone();
      this.loadLivelyKernelCode(callWhenDone);
    } else {
      console.log("document.body doesn't exist yet; setting window.onload. I have a feeling that this doesn't work, though, at least in some browsers. -- Adam, Nov. 2010");
      var that = this;
      window.onload = function() { that.createCanvasIfNone(); };
      this.loadLivelyKernelCode(callWhenDone);
    }
  }, {category: ['bootstrapping']});
  
  add.method('loadProgrammingEnvironmentIfWanted', function (callWhenDone) {
    transporter.fileInIfWanted("lk_programming_environment/code_organizer", function() {
      transporter.fileInIfWanted("lk_programming_environment/programming_environment", callWhenDone);
    });
  }, {category: ['bootstrapping']});

  add.method('createCanvasIfNone', function () {
    var canvas = document.getElementById("canvas");
    if (! canvas) {
      canvas = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
      canvas.setAttribute('id', 'canvas');
      canvas.setAttribute('width',  '100%');
      canvas.setAttribute('height', '600');
      canvas.setAttribute('xmlns', "http://www.w3.org/2000/svg");
      canvas.setAttribute('xmlns:lively', "http://www.experimentalstuff.com/Lively");
      canvas.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
      canvas.setAttribute('xmlns:xhtml', "http://www.w3.org/1999/xhtml");
      canvas.setAttribute('xml:space', "preserve");
      canvas.setAttribute('zoomAndPan', "disable");

      var title = document.createElement('title');
      title.appendChild(document.createTextNode('Lively canvas'));
      canvas.appendChild(title);
      
      // Put the canvas inside a div, because for some reason FireFox isn't calculating
      // offsetLeft and offsetTop for the canvas itself. Also, allow people to specify
      // an 'avocadoDiv' element so they can control where Avocado goes on the page.
      var avocadoDiv = document.getElementById('avocadoDiv');
      if (! avocadoDiv) {
        avocadoDiv = document.createElement('div');
        document.body.appendChild(avocadoDiv);
      }
      avocadoDiv.appendChild(canvas);
    }
    return canvas;
  }, {category: ['bootstrapping']});

  add.method('loadLivelyKernelCode', function (callWhenDone) {
    // Later on could do something nicer with dependencies and stuff. For now,
    // let's just try dynamically loading the LK files in the same order we
    // loaded them when we were doing it statically in the .xhtml file.
    transporter.loadExternal(
      ["prototype/prototype",
       "lk/JSON",
       "lk/defaultconfig",
       "local-LK-config",
       "lk/Base",
       "lk/scene",
       "lk/Core",
       "lk/Text",
       "lk/Widgets",
       "lk/Network",
       "lk/Data",
       "lk/Storage",
       "lk/bindings",
       "lk/Tools",
       "lk/TestFramework",
       "lk/TouchSupport",
       "lk/cop/Layers",
       "moousture/mootools-1.2.4-core-nc",
       "moousture/Moousture",
       "moousture/iPhoneProbe",
       "jslint"
      ], function() {
        if (callWhenDone) { callWhenDone(); }
      }
    );
  }, {category: ['bootstrapping']});

  add.method('createAvocadoWorld', function () {
    Morph.prototype.suppressBalloonHelp = true; // I love the idea of balloon help, but it's just broken - balloons keep staying up when they shouldn't
    //Morph.suppressAllHandlesForever(); // those things are annoying // but useful for direct UI construction
    
    var canvas = document.getElementById("canvas");
    
    var baseColor = Color.rgb(0x53, 0x82, 0xC1);
  	DisplayThemes['lively'].world.fill = new lively.paint.LinearGradient([new lively.paint.Stop(0, baseColor.lighter()), new lively.paint.Stop(1, baseColor)]);
  	
    var world = new WorldMorph(canvas);
    world.displayOnCanvas(canvas);
    modules.init.markAsUnchanged(); // because displayOnCanvas sets the creator slot of the world
    if (navigator.appName == 'Opera') { window.onresize(); }
    if (transporter.shouldLog) { console.log("The world should be visible now."); }
    this.initializeGestures(world);
    return world;
  }, {category: ['bootstrapping']});

  add.method('initializeGestures', function (world) {
    // aaa - big mess, just trying to see if it works
    var gstr = new Moousture.ReducedLevenMatcher({reduceConsistency: 1});
    var probe = new (UserAgent.isTouch ? Moousture.iPhoneProbe : Moousture.MouseProbe)(world); //$(document));
    var recorder = new Moousture.Recorder({maxSteps: 20, minSteps: 8, matcher: gstr});
    var monitor = new Moousture.Monitor(20, 1);
    //CCW circle motion vectors
    //gstr.addGesture([3,2,1,0,7,6,5,4], ccwCircle);
    //Make a triangle
    function triMov(error){
      if (error * 10 >= 8) { return; }
      world.showContextMenu(Event.createFake());
    }

    gstr.addGesture([7, 1, 7, 1], triMov);
    //Zig zag swipe vectors
    //gstr.addGesture([4, 0, 4, 0], swipeMouse);
    
    //var swipeProbe = new Moousture.iPhoneProbe(world.rawNode);
    //var swipeMonitor = new Moousture.Monitor(20, 1);
    //var swipeMatcher = new Moousture.ReducedLevenMatcher({reduceConsistency: 4});
    //var swipeRecorder = new Moousture.Recorder({maxSteps: 50, minSteps: 2, matcher: swipeMatcher});
    
    //swipeMatcher.addGesture([0], rightSwipe);
    //swipeMatcher.addGesture([4], leftSwipe);
    
    monitor.start(probe, recorder);
    //swipeMonitor.start(swipeProbe, swipeRecorder);
  }, {category: ['bootstrapping']});
  
});


});