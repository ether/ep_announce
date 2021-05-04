'use strict';

describe('test the user list updates when users join/update or leave', function () {
  before(function (done) {
    helper.newPad({
      padPrefs: {'ep_announce-enabled': true},
      cb() {
        helper.waitFor(() => {
          const chrome$ = helper.padChrome$;
          return chrome$ && chrome$('#ep_announce-enabled').length === 1;
        }, 1000).done(done);
      },
    });
    this.timeout(60000);
  });

  it('updates the user list on user join/update', async function () {
    const chrome$ = helper.padChrome$;
    const p = new Promise((resolve) => { chrome$.window.ep_announce.updateUserIdList = resolve; });
    chrome$.window.ep_announce.userJoinOrUpdate(null, {userInfo: {userId: 1000}}, () => {});
    await p;
  });

  it('updates the user list one user leave', async function () {
    const chrome$ = helper.padChrome$;
    const p = new Promise((resolve) => { chrome$.window.ep_announce.updateUserIdList = resolve; });
    chrome$.window.ep_announce.userLeave(null, {userInfo: {userId: 1000}}, () => {});
    await p;
  });
});
