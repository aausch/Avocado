avocado.transporter.module.create('general_ui/poses', function(requires) {

requires('core/poses');
requires('general_ui/basic_morph_mixins');

}, function(thisModule) {


thisModule.addSlots(avocado.poses, function(add) {

  add.method('addGlobalCommandsTo', function (menu) {
    avocado.ui.currentWorld().poseManager().addGlobalCommandsTo(menu);
  }, {category: ['menu']});

});


thisModule.addSlots(avocado.morphMixins.Morph, function(add) {

  add.method('poseManager', function () {
    if (! this._poseManager) {
      this._poseManager = Object.newChildOf(avocado.poses.manager, this);
      reflect(this).slotAt('_poseManager').setInitializationExpression('null');
    }
    return this._poseManager;
  }, {category: ['poses']});

  add.method('posers', function () {
    return this.allPotentialPosers().reject(function(m) { return m.shouldIgnorePoses(); }).toArray();
  }, {category: ['poses']});

  add.method('allPotentialPosers', function () {
    return this.submorphEnumerator();
  });

  add.method('shouldIgnorePoses', function () {
    if (this._layout && typeof(this._layout.shouldIgnorePoses) === 'function') {
      return this._layout.shouldIgnorePoses();
    } else {
      return false;
    }
  }, {category: ['poses']});

  add.method('constructUIStateMemento', function () {
    // override constructUIStateMemento and assumeUIState, or uiStateParts, in children if you want them to be recalled in a particular state
    
    if (this.partsOfUIState) {
      var parts = typeof(this.partsOfUIState) === 'function' ? this.partsOfUIState() : this.partsOfUIState;
      var uiState = {};
      reflect(parts).normalSlots().each(function(slot) {
        var partName = slot.name();
        var part = slot.contents().reflectee();
        if (part) {
          if (!(part.isMorph) && part.collection && part.keyOf && part.getPartWithKey) {
            uiState[partName] = part.collection.map(function(elem) {
              return { key: part.keyOf(elem), uiState: elem.constructUIStateMemento() };
            });
          } else {
            uiState[partName] = part.constructUIStateMemento();
          }
        }
      });
      return uiState;
    }
    
    if (this._layout && typeof(this._layout.constructUIStateMemento) === 'function') {
      return this._layout.constructUIStateMemento(this);
    }
    
    return null;
  }, {category: ['poses']});

  add.method('assumeUIState', function (uiState, callWhenDone, evt) {
    // override constructUIStateMemento and assumeUIState, or uiStateParts, in children if you want them to be recalled in a particular state

    if (this.partsOfUIState) {
      if (!uiState) { return; }
      evt = evt || Event.createFake();
      var parts = typeof(this.partsOfUIState) === 'function' ? this.partsOfUIState() : this.partsOfUIState;
      
      avocado.callbackWaiter.on(function(generateIntermediateCallback) {
        reflect(parts).normalSlots().each(function(slot) {
          var partName = slot.name();
          var part = slot.contents().reflectee();
          if (part) {
            var uiStateForThisPart = uiState[partName];
            if (typeof(uiStateForThisPart) !== 'undefined') {
              if (!(part.isMorph) && part.collection && part.keyOf && part.getPartWithKey) {
                uiStateForThisPart.each(function(elemKeyAndUIState) {
                  part.getPartWithKey(this, elemKeyAndUIState.key).assumeUIState(elemKeyAndUIState.uiState, generateIntermediateCallback());
                }.bind(this));
              } else {
                part.assumeUIState(uiStateForThisPart, generateIntermediateCallback(), evt);
              }
            }
          }
        }.bind(this));
      }, callWhenDone, "assuming UI state");
    } else if (this._layout && typeof(this._layout.assumeUIState) === 'function') {
      this._layout.assumeUIState(this, uiState, callWhenDone, evt);
    }
  }, {category: ['poses']});

  add.method('transferUIStateTo', function (otherMorph, evt) {
    otherMorph.assumeUIState(this.constructUIStateMemento());
  }, {category: ['poses']});

});


});