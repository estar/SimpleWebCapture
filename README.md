SimpleWebCapture
================
This is a Firefox addon which makes it possible to save screenshots of
pages as [PNG images][png]. The addon is licensed under the [MPL 2.0][mpl].
[png]: https://en.wikipedia.org/wiki/Portable_Network_Graphics
[mpl]: http://mozilla.org/MPL/2.0/

Author: Ewgenij Starostin <SimpleWebCapture@ewgenij-starostin.name>

`data/camera-photo-symbolic.svg` (and `icon.png` and `icon64.png`) is
copied from the [GNOME Project][gnome]’s `gnome-icon-theme-symbolic`;
they have released it under the [Creative Commons Attribution-Share
Alike 3.0 United States License][cc].
[gnome]: http://www.gnome.org
[cc]: https://creativecommons.org/licenses/by-sa/3.0/

Features
--------
Has:
* Save full page, visible part, single element or selection as PNG.
* All of these are accessible through the context menu on a page.

Does not have:
* Ability to capture the content of plugin windows (Flash, Java etc.).
* Ads, a ‘pro’ version, an upload service, features that belong into a
general purpose image editor like [GIMP](http://www.gimp.org/), binary
components, bundled software.

Usage
-----
Right-click on a page, open the SimpleWebCapture submenu in the context
menu, pick the desired menu item.

Development
-----------
This addon uses the [Mozilla Add-on SDK][mozsdk].
[mozsdk]: https://addons.mozilla.org/en-us/developers/builder

`lib/main.js` contains the UI code, `lib/capture.js` contains code to
capture and save parts of the page. `data/content.js` has functions
which provide coordinates and sizes (as `{x, y, w, h}` objects).

XPConnect is used in several places in `capture.js` to provide things
the Addon SDK modules don’t have (yet?):
* file picker,
* reliably acquiring the current browser window,
* file input and output.

Bug reports, fixes and enhancements are welcome.
