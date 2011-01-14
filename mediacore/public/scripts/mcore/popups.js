/**
 * This file is a part of MediaCore, Copyright 2010 Simple Station Inc.
 *
 * MediaCore is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MediaCore is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

goog.provide('mcore.popups');
goog.provide('mcore.popups.SimplePopup');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.ui.PopupBase');



/**
 * A simple popup that is toggled by an anchor element.
 * Position is determined solely by the CSS.
 *
 * XXX: This code is quite specific to the player control bar.
 *      It really belongs within the mcore.players namespace now,
 *      and will be moved when time permits.
 *
 * @param {Element=} opt_element A DOM element for the popup.
 * @constructor
 * @extends {goog.ui.PopupBase}
 */
mcore.popups.SimplePopup = function(opt_element) {
  goog.base(this, opt_element);
  this.setHideOnEscape(true);
  this.setAutoHide(true);
};
goog.inherits(mcore.popups.SimplePopup, goog.ui.PopupBase);


/**
 * An element which toggles the visibility of this popup.
 * @type {?Element}
 * @protected
 */
mcore.popups.SimplePopup.prototype.anchor = null;


/**
 * Attach the popup to an element which, when clicked, will toggle the popup.
 * @param {Element|string} element A toggle button.
 */
mcore.popups.SimplePopup.prototype.attach = function(element) {
  this.anchor = goog.dom.getElement(element);
  goog.events.listen(this.anchor, goog.events.EventType.CLICK,
                     this.handleClick, false, this);
};


/**
 * Toggle visibility on click.
 * @param {!goog.events.Event} e Click event.
 * @protected
 */
mcore.popups.SimplePopup.prototype.handleClick = function(e) {
  e.preventDefault();
  this.setVisible(!this.isOrWasRecentlyVisible());
};


/**
 * Called after the popup is shown. Derived classes can override to hook this
 * event but should make sure to call the parent class method.
 * @protected
 * @suppress {underscore}
 */
mcore.popups.SimplePopup.prototype.onShow_ = function() {
  goog.base(this, 'onShow_');

  var element = this.getElement();
  var input = goog.dom.getElementsByTagNameAndClass(goog.dom.TagName.INPUT,
      null, element)[0];
  var anchors = goog.dom.getElementsByTagNameAndClass(goog.dom.TagName.A, null,
      element);

  if (input) {
    input.select();
  }
  for (var anchor, i = 0; anchor = anchors[i]; ++i) {
    if (!anchor.target && 'mailto:' != anchor.href.substr(0, 7)) {
      anchor.target = '_blank';
    }
  }
};


/** @inheritDoc */
mcore.popups.SimplePopup.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.events.unlisten(this.anchor, goog.events.EventType.CLICK,
                       this.handleClick, false, this);
};
