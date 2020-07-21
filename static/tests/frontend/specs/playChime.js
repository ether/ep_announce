describe('test that the chime rings under various conditions and triggers', function() {
  context('feature is enabled', function() {
    var origGetUserId;

    afterEach(function(done) {
      chrome$ = helper.padChrome$;
      chrome$.window.ep_announce.getUserId = origGetUserId
      done()
    });

    before(function(done) {
      helper.newPad({
        padPrefs: {"ep_announce-enabled": true},
        cb: function() {
          helper.waitFor(function(){
            chrome$ = helper.padChrome$;
            return chrome$ && chrome$("#ep_announce-enabled").length === 1;
          }, 1000).done(function() {
            origGetUserId = chrome$.window.ep_announce.getUserId
            done()
          })
        }
      });
      this.timeout(60000);
    });

    it('plays chime under basic circumstances', function(done) {
      var chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = done

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, function(){})
    });

    it('does not play chime if list is uninitialized', function(done) {
      var chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function() {
        throw Error("playChime happened before initialization")
      }
      chrome$.window.ep_announce.setUserIdList(undefined)

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done)
    });

    it('does not play chime if viewing user ID is uninitialized', function(done) {
      var chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function() {
        throw Error("playChime happened before initialization")
      }
      chrome$.window.ep_announce.getUserId = function() {
        return undefined
      }

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done)
    });

    it('does not play chime for events related to the viewing user ID', function(done) {
      var chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function() {
        throw Error("playChime happened for the viewing user")
      }
      chrome$.window.ep_announce.getUserId = function() {
        return 1000
      }

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done)
    });

    it('does not play chime for events related to the users already in the list of current users', function(done) {
      var chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function() {
        throw Error("playChime happened for the viewing user")
      }
      chrome$.window.ep_announce.setUserIdList([1000])

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done)
    });
  });

  context('feature is disabled', function() {
    before(function(done) {
      helper.newPad({
        padPrefs: {"ep_announce-enabled": false},
        cb: function() {
          helper.waitFor(function(){
            chrome$ = helper.padChrome$;
            return chrome$ && chrome$("#ep_announce-enabled").length === 1;
          }, 1000).done(done)
        }
      });
      this.timeout(60000);
    });

    it('does not play chime if feature is disabled', function(done) {
      var chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function() {
        throw Error("playChime happened despite feature being disabled")
      }

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done)
    });
  });
});
