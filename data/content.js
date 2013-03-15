/* vim: set et sw=2: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

function captureElement(element) {
  var r = element.getBoundingClientRect();
  self.postMessage([{x: window.scrollX + r.left,
                     y: window.scrollY + r.top,
                     w: r.width, h: r.height}]);
}

function captureEntirePage() {
  var w = 0, h = 0, body = null, de = null;
  if("body" in document)
    body = document.body;
  if("documentElement" in document)
    de = document.documentElement;
  if(body != null && body.clientWidth != window.clientWidth 
      && body.clientHeight != window.clientHeight) {
    w = body.clientWidth;
    h = body.clientHeight;
  }
  if(de != null) {
    w = Math.max(w, de.clientWidth);
    h = Math.max(h, de.clientHeight);
    w = Math.max(w, de.scrollWidth);
    h = Math.max(h, de.scrollHeight);
  }
  if(w == 0)
    w = window.clientWidth + window.scrollMaxX;
  if(h == 0)
    h = window.clientHeight + window.scrollMaxY;
  self.postMessage([{x: 0, y: 0, w: w, h: h}]);
}

function captureSelection() {
  var parts = [], selection = window.getSelection();
  for(var i = 0; i < selection.rangeCount; i++) {
    var r = selection.getRangeAt(i).getBoundingClientRect();
    parts.push({x: window.scrollX + r.left, y: window.scrollY + r.top,
                w: r.width, h: r.height});
  }
  selection.removeAllRanges();
  self.postMessage(parts);
}

function captureVisiblePortion() {
  var w = 0, h = 0, de = null;
  if("documentElement" in document)
    de = document.documentElement;
  w = window.innerWidth;
  h = window.innerHeight;
  if(de != null && de.clientWidth > 0 && de.clientHeight > 0) {
    w = Math.min(w, de.clientWidth);
    h = Math.min(h, de.clientHeight);
  }
  self.postMessage([{x: window.scrollX, y: window.scrollY, w: w, h: h}]);
}

function handleClick(node, data) {
  switch(data) {
    case "element":
      captureElement(node);
      break;
    case "page":
      captureEntirePage();
      break;
    case "selection":
      captureSelection();
      break;
    case "visible":
      captureVisiblePortion();
      break;
  }
}

self.on("click", handleClick);
