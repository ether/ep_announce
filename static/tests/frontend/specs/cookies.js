describe('set audio announcement via cookie', function() {
  context('cookie is set to false', function() {
    before(function(done) {
      helper.newPad({
        padPrefs: {"ep_announce.enabled": false},
        cb: done
      });
      this.timeout(60000);
    });

    it('the checkbox is set to false', function(done) {
      this.timeout(60000);
      var chrome$ = helper.padChrome$;

      var $enableAnnounce = chrome$("#ep_announce-enabled");
      expect($enableAnnounce.prop("checked")).to.be(false)
      done()
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

    it('the checkbox is set to true', function(done) {
      this.timeout(60000);
      var chrome$ = helper.padChrome$;
      var $enableAnnounce = chrome$("#ep_announce-enabled");
      expect($enableAnnounce.prop("checked")).to.be(true)
      done()
    });
  });

  // TODO - can I have access to the plugin object directly? I could test the functions much more easily, here and in WebRTC

});
