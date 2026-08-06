(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var disablePendo = params.get('disablePendo') === 'true';
  var accountId = params.get('account') || 'Demo Planet';
  var visitorName = params.get('visitor') || 'checkout-visitor';
  var role = params.get('role') || 'user';
  var visitorId = visitorName + '@' + accountId.replace(/\s/g, '') + '.com';

  window.userInfo = {
    account: accountId,
    visitor: visitorName,
    visitorId: visitorId,
    role: role,
  };

  if (disablePendo) return;

  (function (apiKey) {
    (function (p, e, n, d, o) {
      var v;
      var w;
      var x;
      var y;
      var z;

      o = p[d] = p[d] || {};
      o._q = o._q || [];
      v = ['initialize', 'identify', 'updateOptions', 'pageLoad'];

      for (w = 0, x = v.length; w < x; ++w) {
        (function (method) {
          o[method] = o[method] || function () {
            o._q[method === v[0] ? 'unshift' : 'push'](
              [method].concat([].slice.call(arguments, 0))
            );
          };
        })(v[w]);
      }

      y = e.createElement(n);
      y.async = true;
      y.src = 'https://cdn.eu.pendo.io/agent/static/' + apiKey + '/pendo.js';
      z = e.getElementsByTagName(n)[0];
      z.parentNode.insertBefore(y, z);
    })(window, document, 'script', 'pendo');

    window.pendo.initialize({
      visitor: {
        id: visitorId,
        role: role,
      },
      account: {
        id: accountId,
      },
    });
  })('224383d7-9416-4e20-8fa6-a7a6f27e58f8');
})();
