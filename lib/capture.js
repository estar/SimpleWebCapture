/* vim: set et sw=2: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* General idea of the capture process:
 * • saveParts:
 *  – Make a canvas.
 *  – Draw the desired window content on the canvas.
 *  – Save the canvas to a stream.
 * • getStreamCb:
 *  – When the stream is ready, show a ‘Save file’ dialog.
 * • getSaveCb:
 *  – When the user has chosen a filename, open the file and start
 *    copying between the streams.
 * • getNetUtilCb:
 *  – When the copying process has ended, check for errors and alert
 *    the user if necessary.
 */

var _ = require("sdk/l10n").get;
const {components, Cc, Ci, Cu} = require("chrome");
Cu.import("resource://gre/modules/FileUtils.jsm");
Cu.import("resource://gre/modules/NetUtil.jsm");

var nsIFilePicker = Ci.nsIFilePicker;

function getNetUtilCb(filename) {
  return function(result) {
    if(!components.isSuccessCode(result))
      Cc["@mozilla.org/embedcomp/prompt-service;1"]
        .getService(Ci.nsIPromptService)
          .alert(null, _("SimpleWebCapture error"),
              _("Failed to save screenshot ‘") + filename + _("’."));
  }
}

function getSaveCb(inStream, fp) {
  return function(result) {
    if(result == nsIFilePicker.returnCancel)
      return;
    var outStream = FileUtils.openFileOutputStream(fp.file);
    NetUtil.asyncCopy(inStream, outStream,
        getNetUtilCb(fp.file.leafName));
  };
}

function getStreamCb(wnd) {
  var alreadyCalled = false;
  return function(inStream) {
    var fp;
    var domain;
    if(alreadyCalled)
      return;
    else
      alreadyCalled = true;
    fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(wnd, _("Save Screenshot As"), nsIFilePicker.modeSave);
    fp.appendFilter(_("PNG images"), "*.png");
    fp.defaultExtension = "png";
    if(wnd.document.domain != null && wnd.document.domain != "")
      fp.defaultString = wnd.document.domain + ".png";
    else
      fp.defaultString = "screenshot.png";
    fp.open(getSaveCb(inStream, fp));
  };
}

function getCurrentWindow() {
  var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
           .getService(Ci.nsIWindowMediator);
  var mainWindow = wm.getMostRecentWindow("navigator:browser");
  return mainWindow.gBrowser.contentWindow;
}

exports.saveParts = function(parts) {
  var wnd = getCurrentWindow();
  var w = 0, h = 0;
  var canvas = wnd.document.createElementNS(
      "http://www.w3.org/1999/xhtml", "canvas");
  var context = canvas.getContext("2d");
  /* Compute canvas dimensions, assuming that all parts will be stacked
   * vertically without gaps.
   */
  for(var i = 0; i < parts.length; i++) {
    // Use the widest part for the canvas width.
    w = Math.max(w, parts[i].w);
    // Add up the heights of the parts for the canvas height.
    h += parts[i].h;
  }
  canvas.width = w;
  canvas.height = h;
  // Draw parts.
  for(var i = 0; i < parts.length; i++) {
    context.drawWindow(wnd, parts[i].x, parts[i].y,
        parts[i].w, parts[i].h, 'rgba(0,0,0,0)');
    // translate() is cumulative.
    context.translate(0, parts[i].h);
  }
  canvas.mozFetchAsStream(getStreamCb(wnd));
}
