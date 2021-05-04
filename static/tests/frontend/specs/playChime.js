'use strict';

describe('test that the chime rings under various conditions and triggers', function () {
  context('feature is enabled', function () {
    let origGetUserId;

    afterEach(function (done) {
      const chrome$ = helper.padChrome$;
      chrome$.window.ep_announce.getUserId = origGetUserId;
      done();
    });

    before(function (done) {
      helper.newPad({
        padPrefs: {'ep_announce-enabled': true},
        cb() {
          helper.waitFor(() => {
            const chrome$ = helper.padChrome$;
            return chrome$ && chrome$('#ep_announce-enabled').length === 1;
          }, 1000).done(() => {
            origGetUserId = helper.padChrome$.window.ep_announce.getUserId;
            done();
          });
        },
      });
      this.timeout(60000);
    });

    it('plays chime under basic circumstances', async function () {
      const chrome$ = helper.padChrome$;
      const p = new Promise((resolve) => { chrome$.window.ep_announce.playChime = resolve; });
      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, () => {});
      await p;
    });

    it('does not play chime if list is uninitialized', function (done) {
      const chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function () {
        throw Error('playChime happened before initialization');
      };
      chrome$.window.ep_announce.setUserIdList(undefined);

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done);
    });

    it('does not play chime if viewing user ID is uninitialized', function (done) {
      const chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function () {
        throw Error('playChime happened before initialization');
      };
      chrome$.window.ep_announce.getUserId = function () {
        return undefined;
      };

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done);
    });

    it('does not play chime for events related to the viewing user ID', function (done) {
      const chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function () {
        throw Error('playChime happened for the viewing user');
      };
      chrome$.window.ep_announce.getUserId = function () {
        return 1000;
      };

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done);
    });

    it('does not play chime for existing users', function (done) {
      const chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function () {
        throw Error('playChime happened for the viewing user');
      };
      chrome$.window.ep_announce.setUserIdList([1000]);

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done);
    });
  });

  context('feature is disabled', function () {
    before(function (done) {
      helper.newPad({
        padPrefs: {'ep_announce-enabled': false},
        cb() {
          helper.waitFor(() => {
            const chrome$ = helper.padChrome$;
            return chrome$ && chrome$('#ep_announce-enabled').length === 1;
          }, 1000).done(done);
        },
      });
      this.timeout(60000);
    });

    it('does not play chime if feature is disabled', function (done) {
      const chrome$ = helper.padChrome$;

      chrome$.window.ep_announce.playChime = function () {
        throw Error('playChime happened despite feature being disabled');
      };

      chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, done);
    });
  });
});
