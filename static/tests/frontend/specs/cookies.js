'use strict';

describe('set audio announcement via cookie', function () {
  context('cookie is set to false', function () {
    before(async function () {
      this.timeout(60000);
      await new Promise((resolve, reject) => helper.newPad({
        padPrefs: {'ep_announce-enabled': false},
        cb: (err) => err != null ? reject(err) : resolve(),
      }));
    });

    it('the checkbox is set to false and will change to true', function (done) {
      this.timeout(60000);
      const chrome$ = helper.padChrome$;

      const $enableAnnounce = chrome$('#ep_announce-enabled');
      expect($enableAnnounce.prop('checked')).to.be(false);
      $enableAnnounce.click();
      helper.waitFor(() => $enableAnnounce.prop('checked') === true, 1000).done(() => {
        expect(chrome$.window.document.cookie.search('ep_announce-enabled%22%3Atrue'))
            .to.not.be(-1);
        expect(chrome$.window.document.cookie.search('ep_announce-enabled%22%3Afalse')).to.be(-1);
        done();
      });
    });
  });

  context('cookie is set to true', function () {
    before(async function () {
      this.timeout(60000);
      await new Promise((resolve, reject) => helper.newPad({
        padPrefs: {'ep_announce-enabled': true},
        cb: (err) => err != null ? reject(err) : resolve(),
      }));
    });

    it('the checkbox is set to true and will change to false', function (done) {
      this.timeout(60000);
      const chrome$ = helper.padChrome$;
      const $enableAnnounce = chrome$('#ep_announce-enabled');
      expect($enableAnnounce.prop('checked')).to.be(true);
      $enableAnnounce.click();
      helper.waitFor(() => $enableAnnounce.prop('checked') === false, 1000).done(() => {
        expect(chrome$.window.document.cookie.search('ep_announce-enabled%22%3Afalse'))
            .to.not.be(-1);
        expect(chrome$.window.document.cookie.search('ep_announce-enabled%22%3Atrue')).to.be(-1);
        done();
      });
    });
  });
});
