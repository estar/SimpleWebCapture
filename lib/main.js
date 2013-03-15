/* vim: set et sw=2: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
const {Class} = require("sdk/core/heritage");
const {data} = require("sdk/self");
const {Item, Menu, PageContext, SelectorContext, SelectionContext} =
        require("sdk/context-menu");
const _ = require("sdk/l10n").get;
const {saveParts} = require("capture");

function saveFragments(fragments) {
  saveParts(fragments);
}

var menuItems = [];

function makeItem(label, context, data) {
  menuItems.push(Item({
    label: _(label),
    context: context,
    data: data
  }));
}

var AlwaysContext = Class({
  extends: PageContext,
  isCurrent: function(popupNode) {return true;}
});

var NonInputSelectionContext = Class({
  extends: SelectionContext,
  isCurrent: function(popupNode) {
    // Fragment from SelectionContext.isCurrent():
    return !popupNode.ownerDocument.defaultView
                        .getSelection().isCollapsed;
  }
});

makeItem("Capture entire page", AlwaysContext(), "page");
makeItem("Capture visible portion", AlwaysContext(), "visible");
makeItem("Capture element", SelectorContext("*"), "element");
makeItem("Capture selection", NonInputSelectionContext(), "selection");

Menu({
  label: "SimpleWebCapture",
  items: menuItems,
  context: AlwaysContext(),
  image: data.url("camera-photo-symbolic.svg"),
  contentScriptFile: data.url("content.js"),
  onMessage: saveFragments
});
