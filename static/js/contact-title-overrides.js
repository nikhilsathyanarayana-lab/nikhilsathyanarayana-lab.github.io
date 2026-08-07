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

  var linkedInContacts = [
    ["Maya Thompson", "Northstar Analytics", "maya.thompson@northstar.example", "+44 20 7946 0182", "VP of Sales"],
    ["Ethan Brooks", "Cloudline Systems", "ethan.brooks@cloudline.example", "+1 (415) 555-0108", "Revenue Operations Director"],
    ["Sofia Patel", "Brightwell Labs", "sofia.patel@brightwell.example", "+44 20 7946 0214", "Head of Partnerships"],
    ["Lucas Martin", "Beacon Works", "lucas.martin@beaconworks.example", "+33 1 87 65 43 20", "Enterprise Account Executive"],
    ["Ava Richardson", "Veridian Digital", "ava.richardson@veridian.example", "+1 (646) 555-0127", "Customer Success Director"],
    ["Noah Williams", "Summit Commerce", "noah.williams@summit.example", "+1 (312) 555-0151", "Business Development Manager"],
    ["Isabella Garcia", "Cedar & Co", "isabella.garcia@cedarco.example", "+34 91 555 0136", "Marketing Director"],
    ["Oliver Chen", "Atlas Robotics", "oliver.chen@atlasrobotics.example", "+1 (408) 555-0199", "Solutions Engineering Lead"],
    ["Amelia Johnson", "Lumen Financial", "amelia.johnson@lumen.example", "+44 20 7946 0241", "Strategic Accounts Manager"],
    ["James Wilson", "TerraNova Energy", "james.wilson@terranova.example", "+1 (713) 555-0174", "Regional Sales Director"],
    ["Harper Davis", "Kindred Health", "harper.davis@kindred.example", "+1 (617) 555-0133", "Chief of Staff"],
    ["Leo Anderson", "SignalFrame", "leo.anderson@signalframe.example", "+46 8 555 0148", "Product Marketing Lead"],
    ["Mia Campbell", "Oak & Finch", "mia.campbell@oakfinch.example", "+44 161 555 0160", "Commercial Director"],
    ["Henry Moore", "Momentum AI", "henry.moore@momentum.example", "+1 (650) 555-0116", "VP of Business Development"],
    ["Ella Martinez", "Riverside Media", "ella.martinez@riverside.example", "+1 (310) 555-0188", "Client Services Director"],
    ["Jack Taylor", "Cobalt Security", "jack.taylor@cobalt.example", "+44 20 7946 0277", "Channel Sales Manager"],
    ["Grace Lee", "Horizon Mobility", "grace.lee@horizon.example", "+82 2 555 0194", "Global Partnerships Lead"],
    ["Benjamin Clark", "Paper Kite Studio", "benjamin.clark@paperkite.example", "+1 (503) 555-0145", "Managing Director"],
    ["Chloe Walker", "Evergreen Foods", "chloe.walker@evergreen.example", "+44 113 555 0122", "National Account Manager"],
    ["Daniel Kim", "NovaGrid", "daniel.kim@novagrid.example", "+1 (212) 555-0169", "Growth Strategy Director"]
  ].map(function buildLinkedInContact(contact, index) {
    var id = "linkedin-demo-contact-" + String(index + 1).padStart(2, "0");
    return {
      _id: id,
      key: id,
      name: contact[0],
      account: contact[1],
      email: contact[2],
      phone: contact[3],
      title: contact[4] + " · LinkedIn"
    };
  });

  function linkedInSyncIsVisible() {
    try {
      return window.localStorage.getItem("democrm.linkedinSync.v1") === "complete";
    } catch (error) {
      return false;
    }
  }

  function withCorrectTitle(contact) {
    var title = contact && titlesByContactId[contact._id];
    return title ? Object.assign({}, contact, { title: title }) : contact;
  }

  function normalizeContacts(payload) {
    if (!Array.isArray(payload)) return withCorrectTitle(payload);

    var normalizedContacts = payload.map(withCorrectTitle);
    if (!linkedInSyncIsVisible()) return normalizedContacts;

    var linkedInIds = linkedInContacts.reduce(function collectIds(ids, contact) {
      ids[contact._id] = true;
      return ids;
    }, {});

    return linkedInContacts.concat(
      normalizedContacts.filter(function removeDuplicateMocks(contact) {
        return !contact || !linkedInIds[contact._id];
      })
    );
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
