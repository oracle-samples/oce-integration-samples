define(['jquery',
    'ojs/ojcore',
    'ojs/ojoffcanvas',
    'css!./resources/css/shell.css'],
  function(
    $,
    oj) {
  'use strict';

  var PageModule = function PageModule() {};
  
//   window.requirejs.config({
//   paths:
// 
//       {
//           'mustache': "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.1.0/mustache",
//           'marked': "https://cdnjs.cloudflare.com/ajax/libs/marked/0.7.0/marked"
//       }})


  var drawerParams = {
    displayMode: 'push',
    selector: '#navDrawer',
    content: '#pageContent'
  };

  PageModule.prototype.toggleDrawer = function() {
    return oj.OffcanvasUtils.toggle(drawerParams);
  };

  // If the drawer is open and the page gets resized close it on medium and larger screens
  var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
  var mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
  mdScreen.subscribe(function() {
    oj.OffcanvasUtils.close(drawerParams);
  });

  return PageModule;
});