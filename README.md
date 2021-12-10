![Publish Status](https://github.com/ether/ep_announce/workflows/Node.js%20Package/badge.svg) ![Backend Tests Status](https://github.com/ether/ep_announce/workflows/Backend%20tests/badge.svg)

ep_announce
=========

`ep_announce` is an Etherpad-lite plugin that plays a chime when someone enters a pad. It is disabled by default, and can be enabled using a new switch on the user list panel. The setting is per-browser (stored in cookies).

The chime will play if when new user joins after being absent for at least a few seconds. For instance, it won't play if a user merely refreshes the page.
