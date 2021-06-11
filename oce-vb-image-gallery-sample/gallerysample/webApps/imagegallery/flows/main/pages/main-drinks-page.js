/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

define([], function() {
  'use strict';

  var PageModule = function PageModule(context) {
    this.eventHelper = context.getEventHelper();
  };



  /**
   *
   * @param {Element} srcElement
   * @param {Array} contentImages
   * @return {String}
   */
  PageModule.prototype.reorderImages = function (srcElement, contentImages) {
    var contentImageElement = srcElement.parentElement.parentElement;
    var id = contentImageElement.contentImage;
    var index = contentImages.findIndex(item => item.id == contentImageElement.contentImage);
    var result = contentImages.concat(contentImages.splice(0, index));
    return result;
  };


  return PageModule;
});
