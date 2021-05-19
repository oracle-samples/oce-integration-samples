/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  /**
   *
   * @param {String} arg1
   * @return {String}
   */
  PageModule.prototype.ShowImageGallery = function (arg1) {
        document.querySelector("oj-oce-gallery").classList.remove("hidden");

  };

  return PageModule;
});
