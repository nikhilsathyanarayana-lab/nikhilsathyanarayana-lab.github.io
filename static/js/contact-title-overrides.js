(function applyContactTitleOverrides() {
  "use strict";

  var titlesByContactId = {
    "5ad650d9c8cf2a0500007c14": "Account Executive",
    "5ad650d9c8cf2a0500007c18": "Sales Manager",
    "5ad650d9c8cf2a0500007c1b": "Business Development Representative",
    "5ad650d9c8cf2a0500007c20": "Customer Success Manager",
    "5ad650d9c8cf2a0500007c23": "Technical Account Manager (TAM)",
    "5ad650d9c8cf2a0500007c0f": "Administrator",
    "5ad650d9c8cf2a0500007c10": "Applications Manager",
    "5ad650d9c8cf2a0500007c11": "Technical Support Manager",
    "5ad650d9c8cf2a0500007c12": "Account Executive",
    "5ad650d9c8cf2a0500007c13": "Sales Manager",
    "5ad650d9c8cf2a0500007c15": "Business Development Representative",
    "5ad650d9c8cf2a0500007c16": "Customer Success Manager",
    "5ad650d9c8cf2a0500007c19": "Technical Account Manager (TAM)",
    "5ad650d9c8cf2a0500007c1c": "Administrator",
    "5ad650d9c8cf2a0500007c1d": "Applications Manager",
    "5ad650d9c8cf2a0500007c21": "Technical Support Manager",
    "5ad650d9c8cf2a0500007c24": "Account Executive",
    "5ad650d9c8cf2a0500007c25": "Sales Manager",
    "5ad650d9c8cf2a0500007c17": "Business Development Representative",
    "5ad650d9c8cf2a0500007c1a": "Customer Success Manager",
    "5ad650d9c8cf2a0500007c1e": "Technical Account Manager (TAM)",
    "5ad650d9c8cf2a0500007c1f": "Administrator",
    "5ad650d9c8cf2a0500007c22": "Applications Manager",
    "5ad650d9c8cf2a0500007c26": "Technical Support Manager",
    "5ad650d9c8cf2a0500007c27": "Account Executive"
  };

  function withCorrectTitle(contact) {
    var title = contact && titlesByContactId[contact._id];
    return title ? Object.assign({}, contact, { title: title }) : contact;
  }

  function normalizeContacts(payload) {
    return Array.isArray(payload)
      ? payload.map(withCorrectTitle)
      : withCorrectTitle(payload);
  }

  var xhrPrototype = window.XMLHttpRequest && window.XMLHttpRequest.prototype;
  if (!xhrPrototype) return;

  var nativeOpen = xhrPrototype.open;
  xhrPrototype.open = function open(method, url) {
    this.__demoCrmRequestUrl = String(url);
    return nativeOpen.apply(this, arguments);
  };

  ["response", "responseText"].forEach(function overrideResponse(propertyName) {
    var descriptor = Object.getOwnPropertyDescriptor(xhrPrototype, propertyName);
    if (!descriptor || !descriptor.get || descriptor.configurable === false) return;

    Object.defineProperty(
      xhrPrototype,
      propertyName,
      Object.assign({}, descriptor, {
        get: function getNormalizedResponse() {
          var response = descriptor.get.call(this);
          if (!/\/rest\/contacts(?:\/|$)/.test(this.__demoCrmRequestUrl || "")) {
            return response;
          }

          if (propertyName === "responseText" && typeof response === "string") {
            try {
              return JSON.stringify(normalizeContacts(JSON.parse(response)));
            } catch (error) {
              return response;
            }
          }

          return normalizeContacts(response);
        }
      })
    );
  });
})();
