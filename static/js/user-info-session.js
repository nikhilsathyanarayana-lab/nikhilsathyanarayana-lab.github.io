(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.userInfo) return;

    try {
      sessionStorage.setItem('demoCRM.userInfo', JSON.stringify(window.userInfo));
    } catch (error) {
      // Storage can be unavailable in restricted browsing contexts.
    }
  });
})();
