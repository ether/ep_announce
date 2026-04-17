![Publish Status](https://github.com/ether/ep_announce/workflows/Node.js%20Package/badge.svg) [![Backend Tests Status](https://github.com/ether/ep_announce/actions/workflows/test-and-release.yml/badge.svg)](https://github.com/ether/ep_announce/actions/workflows/test-and-release.yml)

# Pad Entry Chime for Etherpad

`ep_announce` is an Etherpad-lite plugin that plays a chime when someone enters a pad. It is disabled by default, and can be enabled using a new switch on the user list panel. The setting is per-browser (stored in cookies).

The chime will play if when new user joins after being absent for at least a few seconds. For instance, it won't play if a user merely refreshes the page.

## Installation

Install from the Etherpad admin UI (**Admin → Manage Plugins**,
search for `ep_announce` and click *Install*), or from the Etherpad
root directory:

```sh
pnpm run plugins install ep_announce
```

> ⚠️ Don't run `npm i` / `npm install` yourself from the Etherpad
> source tree — Etherpad tracks installed plugins through its own
> plugin-manager, and hand-editing `package.json` can leave the
> server unable to start.

After installing, restart Etherpad.
