avocado.transporter.module.create('github', function(requires) {

}, function(thisModule) {


thisModule.addSlots(avocado, function(add) {

  add.creator('github', {}, {category: ['github']});

});


thisModule.addSlots(avocado.github, function(add) {

  add.creator('file', {});

  add.creator('_github', Object.create({}));

  add.method('login', function (uid, pwd, callback) {
 if (uid && pwd) {
 avocado.github._github = new Github({
    username: uid,
  password: pwd,
  auth: "basic"
});
if(callback) callback(avocado.github._github)
 } else {
   return avocado.github.showGithubLogin(callback);
 }
});

  add.data('_current_repo', null);

  add.method('github', function () {
 if (this._github) { return this._github; }
 return avocado.github.login();
});

  add.method('showGithubLogin', function (callback) {
    avocado.ui.prompt("Enter github uid:", function(uid) {
       if (uid){
         avocado.ui.prompt("Enter github password:", function(pwd) {
           if (pwd) {
             avocado.github.login(uid,pwd,callback);
           }
	   });
	   
       }
	});
  });

  add.method('currentRepo', function () {
  if (this._current_repo) {return this._current_repo;}
 return this.selectRepo();
});

  add.method('selectRepo', function () {
 if (this._github) {
 return this.showRepoSelectionMorph(this.github());
 } else {
   avocado.ui.alert("Not logged in! Log in first.");
 this.login();
 }
});

});


thisModule.addSlots(avocado.github.file, function(add) {

  add.data('_url', null);

});


});
