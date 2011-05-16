transporter.module.create('lk_ext/container_morph', function(requires) {

requires('lk_ext/tree_morph');

}, function(thisModule) {


thisModule.addSlots(avocado, function(add) {

  add.method('ContainerMorph', function ContainerMorph() { Class.initializer.apply(this, arguments); }, {category: ['ui']});

});


thisModule.addSlots(avocado.ContainerMorph, function(add) {

  add.data('superclass', avocado.TreeNodeMorph);

  add.data('type', 'avocado.ContainerMorph');

  add.creator('prototype', Object.create(avocado.TreeNodeMorph.prototype));

});


thisModule.addSlots(avocado.ContainerMorph.prototype, function(add) {

  add.data('constructor', avocado.ContainerMorph);

  add.method('initialize', function ($super) {
    $super();
    this._model = Object.newChildOf(this.modelUsingWhicheverMorphsHappenToBeThere, this);
    reflect(this).slotAt('_model').beCreator();
    this.applyStyle(this.defaultStyle);
    
    this.contentsPanel().aboutToReceiveDrop = function(m) {
      var tfm = m.transformForNewOwner(this);
			m.scaleBy(1 / tfm.getScale());
    };
    
    this.contentsPanel().justReceivedDrop = function(m) {
      this.owner.cleanUpContentsPanel();
    };
    
    this.refreshContentOfMeAndSubmorphs();
    
  }, {category: ['creating']});
  
  add.creator('modelUsingWhicheverMorphsHappenToBeThere', {});

  add.creator('defaultStyle', {}, {category: ['styles']});

  add.method('createTitleLabel', function () {
    this._containerName = 'a container';
    var lbl = new avocado.TwoModeTextMorph(avocado.accessors.forAttribute(this, '_containerName'));
    lbl.setNameOfEditCommand("rename");
    lbl.backgroundColorWhenWritable = null;
    lbl.ignoreEvents();
    return lbl;
  }, {category: ['creating']});
  
  add.method('commands', function () {
    var cmdList = avocado.command.list.create(this);
    if (this._titleLabel) {
      cmdList.addAllCommands(this._titleLabel.editingCommands());
    }
    return cmdList;
  }, {category: ['commands']});

});


thisModule.addSlots(avocado.ContainerMorph.prototype.modelUsingWhicheverMorphsHappenToBeThere, function(add) {
  
  add.method('initialize', function (morph) {
    this._morph = morph;
  }, {category: ['creating']});
  
  add.method('toString', function () { return "morphs of " + this._morph; });
  
  add.method('immediateSubnodes', function () {
    return [];
  }, {category: ['accessing']});
  
  add.method('nonNodeContents', function () {
    return this._morph.contentsPanel().submorphs.map(function(m) { return typeof(m._model) !== 'undefined' ? m._model : { newMorph: function() { return m; }}; });
  }, {category: ['accessing']});

  add.method('dragAndDropCommands', function () {
    var cmdList = avocado.command.list.create();
    return cmdList;
  }, {category: ['commands']});

});


thisModule.addSlots(avocado.ContainerMorph.prototype.defaultStyle, function(add) {
  
  add.data('fill', new lively.paint.LinearGradient([new lively.paint.Stop(0, new Color(1, 0.8, 0.5)), new lively.paint.Stop(1, new Color(1, 0.9, 0.75))], lively.paint.LinearGradient.SouthNorth));

});


});
