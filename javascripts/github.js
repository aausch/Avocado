avocado.transporter.module.create('github', function(requires) {

}, function(thisModule) {


thisModule.addSlots(avocado, function(add) {

  add.creator('github', {}, {category: ['github']});

});


thisModule.addSlots(avocado.github, function(add) {

  add.creator('file', {});


  add.method('login', function (uid, pwd, callback) {
    if (uid && pwd) {
      avocado.github._github = new Octokit({
        username: uid,
        password: pwd
      });
      if (callback) callback();
     } else {
       return avocado.github.showGithubLogin(callback());
     }
  });

  add.data('_current_repo', null);

  add.data('_current_branch', null);

  add.data('_github', null);

  add.method('github', function () {
    if (this._github) { return this._github; }
    return avocado.github.login();
  });

  add.method('showGithubLogin', function (callback) {
    var wrapped_callback = function() {
      avocado.github._current_repo = avocado.github._github.getRepo('aausch','Avocado');
      avocado.github._current_branch = avocado.github._current_repo.getBranch('gh_pages');
      if (callback) callback();
    }
    avocado.ui.prompt("Enter github uid:", function(uid) {
       if (uid){
         avocado.ui.prompt("Enter github password:", function(pwd) {
           if (pwd) {
             avocado.github.login(uid,pwd,wrapped_callback);
           }
	 });
       }
    });
  });

  add.method('currentRepo', function () {
    if (this._current_repo) {return this._current_repo;}
    return this.selectRepo();
  });

  add.method('currentBranch', function () {
    if (this._current_branch) {return this._current_branch;}
    return this.selectBranch();
  });

  add.method('selectRepo', function () {
    if (this._github) {
      return this.showRepoSelectionMorph(this.github());
    } else {
      avocado.ui.showMessage("Not logged in! Log in first.");
      this.login();
    }
  });

});


thisModule.addSlots(avocado.github.file, function(add) {

  add.data('_url', null);

});


});
