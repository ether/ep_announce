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

'use strict';

const padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;

const announce = (() => {
  let userIdList;
  let chime;

  const self = {
    // API HOOKS
    postAceInit: (hook, context, callback) => {
      self._pad = pad || window.pad;
      self.updateUserIdList();

      chime = new Audio('../static/plugins/ep_announce/static/audio/chime.mp3');

      const $checkbox = $('<input type="checkbox" id="ep_announce-enabled"/>');

      $checkbox.prop('checked', padcookie.getPref('ep_announce-enabled') === true)
          .on('change', () => {
            padcookie.setPref('ep_announce-enabled', $checkbox.checked);
          });

      const $label = $('<label for="ep_announce-enabled" data-l10n-id="pad.ep_announce.checkbox">' +
                       'Announce on entry</label>');

      $('#userlistbuttonarea').append($('<p></p>').append([$checkbox, $label]));

      callback();
    },

    // Separated for testing
    setUserIdList: (newUserIdList) => {
      userIdList = newUserIdList;
    },

    updateUserIdList: () => {
      if (self._pad === undefined) {
        return; // too early
      }
      self.setUserIdList(
          self._pad.collabClient
              .getConnectedUsers()
              .map((user) => user.userId)
      );
    },

    playChime: () => {
      if (chime !== undefined) {
        chime.play().catch((err) => {});
      }
    },

    userJoinOrUpdate: (hook, context, callback) => {
      const myUserId = self.getUserId();
      const joinedUserId = context.userInfo.userId;

      // still initializing; probably self anyway. Missing a chime this early is probably okay.
      if (userIdList === undefined || myUserId === undefined) {
        callback();
        return;
      }

      if (
        $('#ep_announce-enabled').prop('checked') === true && // feature is enabled
        joinedUserId !== myUserId && // not an event for the viewing user
        // not already in the list (in the list would imply updating or refreshing their page)
        userIdList.indexOf(joinedUserId) === -1
      ) {
        self.playChime();
      }

      // Done after, because we want to see if the user joining or updating
      // is in the list before updating the list
      self.updateUserIdList();
      callback();
    },

    userLeave: (hook, context, callback) => {
      self.updateUserIdList();
      callback();
    },
    // END OF API HOOKS

    getUserId: () => self._pad && self._pad.getUserId(),
  };

  return self;
})();

exports.announce = announce;
// Access to do some unit tests. If there's a more formal way to do this for all plugins, we can
// change to that.
window.ep_announce = announce;
