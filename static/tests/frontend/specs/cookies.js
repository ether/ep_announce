describe('set audio announcement via cookie', function() {
  context('cookie is set to false', function() {
    before(function(done) {
      helper.newPad({
        padPrefs: {"ep_announce-enabled": false},
        cb: done
      });
      this.timeout(60000);
    });

    it('the checkbox is set to false and will change to true', function(done) {
      this.timeout(60000);
      var chrome$ = helper.padChrome$;

      var $enableAnnounce = chrome$("#ep_announce-enabled");
      expect($enableAnnounce.prop("checked")).to.be(false)
      $enableAnnounce.click()
      helper.waitFor(function(){
        return $enableAnnounce.prop("checked") === true;
      }, 1000).done(function() {
        expect(chrome$.window.document.cookie.search("ep_announce-enabled%22%3Atrue")).to.not.be(-1)
        expect(chrome$.window.document.cookie.search("ep_announce-enabled%22%3Afalse")).to.be(-1)
        done()
      })
    });
  });

  context('cookie is set to true', function() {
    before(function(done) {
      helper.newPad({
        padPrefs: {"ep_announce-enabled": true},
        cb: done
      });
      this.timeout(60000);
    });

    it('the checkbox is set to true and will change to false', function(done) {
      this.timeout(60000);
      var chrome$ = helper.padChrome$;
      var $enableAnnounce = chrome$("#ep_announce-enabled");
      expect($enableAnnounce.prop("checked")).to.be(true)
      $enableAnnounce.click()
      helper.waitFor(function(){
        return $enableAnnounce.prop("checked") === false;
      }, 1000).done(function() {
        expect(chrome$.window.document.cookie.search("ep_announce-enabled%22%3Afalse")).to.not.be(-1)
        expect(chrome$.window.document.cookie.search("ep_announce-enabled%22%3Atrue")).to.be(-1)
        done()
      })
    });
  });
});
