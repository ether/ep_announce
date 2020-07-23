/**
 * Copyright 2020 Daniel Krol <dan@danielkrol.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var padcookie = require("ep_etherpad-lite/static/js/pad_cookie").padcookie;
var hooks = require("ep_etherpad-lite/static/js/pluginfw/hooks");

var announce = (function() {
  var userIdList;
  var chime;

  var self = {
    //API HOOKS
    postAceInit: function(hook, context, callback) {
      self._pad = pad || window.pad;
      self.updateUserIdList()

      chime = new Audio("../static/plugins/ep_announce/static/audio/chime.mp3")

      var $checkbox = $('<input type="checkbox" id="ep_announce-enabled"></input>')
        .prop("checked", padcookie.getPref("ep_announce-enabled") === true)
        .on("change", function() {
          padcookie.setPref("ep_announce-enabled", this.checked);
        });

      var $label = $('<label for="ep_announce-enabled" data-l10n-id="pad.ep_announce.checkbox">Announce on entry</label>')

      $('#userlistbuttonarea').append($("<p></p>").append([$checkbox, $label]))

      callback();
    },

    // Separated for testing
    setUserIdList: function (newUserIdList) {
      userIdList = newUserIdList
    },

    updateUserIdList: function () {
      if (self._pad === undefined) {
        return // too early
      }
      self.setUserIdList(
        self._pad.collabClient
        .getConnectedUsers()
        .map(function(user) {
          return user.userId
        })
      );
    },

    playChime: function() {
      if (chime !== undefined) {
        chime.play()
      }
    },

    userJoinOrUpdate: function(hook, context, callback) {
      const myUserId = self.getUserId()
      const joinedUserId = context.userInfo.userId

      // still initializing; probably self anyway. Missing a chime this early is probably okay.
      if (userIdList === undefined || myUserId === undefined) {
        callback();
        return;
      }

      if (
        $('#ep_announce-enabled').prop('checked') === true && // feature is enabled
        joinedUserId !== myUserId &&                         // not an event for the viewing user
        userIdList.indexOf(joinedUserId) === -1              // not already in the list (in the list would imply updating or refreshing their page)
      ) {
        self.playChime();
      }

      // Done after, because we want to see if the user joining or updating
      // is in the list before updating the list
      self.updateUserIdList();
      callback();
    },

    userLeave: function(hook, context, callback) {
      self.updateUserIdList()
      callback();
    },
    //END OF API HOOKS

    getUserId: function() {
      return self._pad && self._pad.getUserId();
    },
  };

  return self;
})();

exports.announce = announce;
window.ep_announce = announce // Access to do some unit tests. If there's a more formal way to do this for all plugins, we can change to that.
