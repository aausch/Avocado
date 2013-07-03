avocado.transporter.module.create('github', function(requires) {

}, function(thisModule) {


thisModule.addSlots(avocado, function(add) {

  add.creator('github', {}, {category: ['github']});

});


thisModule.addSlots(avocado.github, function(add) {

  add.creator('file', {});

  add.data('_github', null);

  add.method('login', function (uid, pwd) {
 if (uid && pwd) {
   this._github = new Github({
    username: uid,
  password: pwd,
  auth: "basic"
});
 return this._github;
 } else {
   return this.showGithubLoginMorph();
 }
});

  add.data('_current_repo', null);

  add.method('currentRepo()', function () {
  if (this._current_repo) {return this._current_repo;}
 return this.selectRepo();
});

  add.method('selectRepo()', function () {
 return this.showRepoSelectionMorph(this.github());
});

  add.method('github', function () {
 if (this._github) { return this._github; }
 return this.login();
});

});


thisModule.addSlots(avocado.github.file, function(add) {

  add.data('_url', null);

});


});
