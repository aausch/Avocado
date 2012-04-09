avocado.transporter.module.create('programming_environment/test_case_morph', function(requires) {

requires('general_ui/table_layout');
requires('core/testFramework');

}, function(thisModule) {


thisModule.addSlots(avocado.testCase, function(add) {

  add.method('newMorph', function () {
    var m = avocado.treeNode.newMorphFor(this, this.defaultMorphStyle);
    m.typeName = 'test case';
    m.refreshContentOfMeAndSubmorphs();
    m.startPeriodicallyUpdating();
    return m;
  }, {category: ['user interface']});

  add.creator('defaultMorphStyle', Object.create(avocado.table.boxStyle), {category: ['user interface']});
  
  add.method('updateStyleOfMorph', function (m, result) {
    result = result || m._model.result(); // allow the result to be passed in, so we can use this to update related morphs that don't actually have a _model
    if (result && result.hasFinished()) {
      if (result.anyFailed()) {
        m.setFillBase(avocado.testCase.singleResult.failedMorphStyle.fillBase);
      } else {
        m.setFillBase(avocado.testCase.singleResult.defaultMorphStyle.fillBase);
      }
    } else {
      m.setFillBase(avocado.testCase.defaultMorphStyle.fillBase);
    }
  }, {category: ['user interface']});
  
  add.method('shouldPutHeaderOnLeftInsteadOfTop', function () {
    // just for fun, to see if this works OK
    return true;
  }, {category: ['user interface']});

  add.creator('contentsPanelExtent', function() {
    if (this.shouldPutHeaderOnLeftInsteadOfTop()) {
      return pt(30, 20);
    } else {
      return avocado.treeNode.defaultExtent();
    }
  }, {category: ['user interface']});

});


thisModule.addSlots(avocado.testCase.suite, function(add) {

  add.method('newMorph', function () {
    var m = avocado.treeNode.newMorphFor(this, this.defaultMorphStyle);
    m.typeName = 'test suite';
    
    
    // aaa - just an experiment
    if (this._shouldBeDisplayedAsOneLongRow) {
      var cp = avocado.treeNode.actualContentsPanelForMorph(m);
      cp.layout().cleaningUpPoseFor = function (contentMorphs) {
        return this._morph.poseManager().rowPose(contentMorphs);
      };
    }
    
    
    m.refreshContentOfMeAndSubmorphs();
    m.startPeriodicallyUpdating();
    return m;
  }, {category: ['user interface']});

  add.creator('defaultMorphStyle', Object.create(avocado.table.boxStyle), {category: ['user interface']});

  add.creator('contentsPanelExtent', function() {
    if (this._shouldBeDisplayedAsOneLongRow) {
      return pt(200, 6);
    } else {
      return avocado.treeNode.defaultExtent();
    }
  }, {category: ['user interface']});
  
  add.method('updateStyleOfMorph', function (m) {
    avocado.testCase.updateStyleOfMorph(m);
  }, {category: ['user interface']});

});


thisModule.addSlots(avocado.testCase.resultHistory, function(add) {

  add.method('newMorph', function () {
    var m = avocado.table.newColumnMorph().setModel(this);
    m.applyStyle(this.defaultMorphStyle);
    
    m._headerRow = avocado.table.createSpaceFillingRowMorph([m.findOrCreateTitleLabel()], avocado.treeNode.headerRowPadding).enableEvents(); // aaa DO NOT enableEvents(), not sure what to do, but needed to make links work
    m._immediateContentsMorph = avocado.ui.currentWorld().morphFor(this.immediateContents()).setFill(null);
    m._immediateContentsMorph.doIWantToLeaveAPlaceholderWhenRemoving = function (m) { return true; };
    
    this._interestingTestsModel  = this.createInterestingEntriesList();
    m._interestingTestsContainer = avocado.ui.currentWorld().morphFor(this._interestingTestsModel);
    m._interestingTestsHeaderRow = avocado.table.createSpaceFillingRowMorph([m._interestingTestsContainer.findOrCreateTitleLabel()], avocado.treeNode.headerRowPadding).enableEvents(); // aaa DO NOT enableEvents(), not sure what to do, but needed to make links work
    
    var selectedTests = avocado.groupOfSimilarObjects.create([]).beVertical();
    this._reallyInterestingTestsModel   = this.createInterestingEntriesList().setSubset(avocado.testCase.subset.create(this, null, "selected", avocado.enumerator.create(selectedTests, 'eachObject')));
    m._reallyInterestingTestsContainer  = avocado.ui.currentWorld().morphFor(selectedTests);
    m._reallyInterestingTestsTitleLabel = this._reallyInterestingTestsModel.titleModel().newMorph();
    m._reallyInterestingTestsHeaderRow  = avocado.table.createSpaceFillingRowMorph([m._reallyInterestingTestsTitleLabel], avocado.treeNode.headerRowPadding).enableEvents(); // aaa DO NOT enableEvents(), not sure what to do, but needed to make links work
    
    m._layout.setCells([m._headerRow, m._immediateContentsMorph, m._interestingTestsHeaderRow, ScrollPane.containing(m._interestingTestsContainer, pt(800, 400)), m._reallyInterestingTestsHeaderRow, m._reallyInterestingTestsContainer]);
    
    return m;
  }, {category: ['user interface']});

  add.creator('defaultMorphStyle', Object.create(avocado.table.boxStyle), {category: ['user interface']});
  
  add.method('showInterestingSubset', function (evt, subset) {
    var world = avocado.ui.worldFor(evt);
    var entries = subset.tests().toArray();
    var interestingEntriesMorph = world.morphFor(this)._interestingTestsContainer;
    avocado.callbackWaiter.on(function(createCallbackForPuttingThisOneBack) {
      interestingEntriesMorph.submorphEnumerator().toArray().forEach(function(previouslyInterestingMorph) {
        if (! entries.include(previouslyInterestingMorph._model)) {
          var placeholder = previouslyInterestingMorph._placeholderMorphIJustCameFrom;
          if (placeholder) {
            placeholder.layout().putOriginalMorphBack(createCallbackForPuttingThisOneBack()); 
          } else {
            previouslyInterestingMorph.startWhooshingOuttaHere(createCallbackForPuttingThisOneBack());
          }
        }
      });
    }, function() {
      interestingEntriesMorph._model.setSubset(subset);
      var pose = avocado.poses.list.create("interesting entries").setPoserModels(entries).setPadding(pt(10, 10)).setDesiredPoserScale(1);
      pose.doNotAnticipateAtStart().doNotWiggleAtEnd().whenDoneSetExtentToEncompassWholePose();
      pose.recreateInContainer(interestingEntriesMorph, pt(0, 0));
      
      interestingEntriesMorph.findOrCreateTitleLabel().refreshContent();
    }, "putting back the uninteresting entries");
  }, {category: ['user interface']});

});


thisModule.addSlots(avocado.testCase.resultHistory.defaultMorphStyle, function(add) {

  add.data('fill', null);

});


thisModule.addSlots(avocado.testCase.resultHistory.interestingEntriesProto, function(add) {
  
  add.method('newMorph', function () {
    var m = avocado.ui.newMorph(avocado.ui.shapeFactory.newRectangle(new Rectangle(0, 0, 600, 400))).beInvisible().beShrinkWrapping();
    m.setModel(this);
    m.doIWantToLeaveAPlaceholderWhenRemoving = function (sm) { return false; };
    return m;
  }, {category: ['user interface']});
  
});


thisModule.addSlots(avocado.testCase.singleResult, function(add) {

  add.method('newMorph', function () {
    return avocado.messageNotifier.create(this.toString(), Color.gray).newMorph().setModel(this);
  }, {category: ['user interface']});
  
  add.method('updateStyleOfMorph', function (m) {
    avocado.testCase.updateStyleOfMorph(m);
  }, {category: ['user interface']});

  add.creator('defaultMorphStyle', {}, {category: ['user interface']});

  add.creator('failedMorphStyle', {}, {category: ['user interface']});

});


thisModule.addSlots(avocado.testCase.defaultMorphStyle, function(add) {

  add.data('fillBase', new Color(0.5, 0.5, 0.5));

});


thisModule.addSlots(avocado.testCase.suite.defaultMorphStyle, function(add) {

  add.data('fillBase', new Color(0.5, 0.5, 0.5));

});


thisModule.addSlots(avocado.testCase.singleResult.defaultMorphStyle, function(add) {

  add.data('fillBase', new Color(0, 0.8, 0.5));

});


thisModule.addSlots(avocado.testCase.singleResult.failedMorphStyle, function(add) {

  add.data('fillBase', new Color(0.8, 0.3, 0));

});


});
