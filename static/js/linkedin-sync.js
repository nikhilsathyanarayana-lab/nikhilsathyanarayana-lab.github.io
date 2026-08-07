(function addLinkedInContactSync() {
  "use strict";

  var storageKey = "democrm.linkedinSync.v1";
  var triggerId = "linkedin-sync-trigger";
  var modalRootId = "linkedin-sync-modal-root";
  var syncInProgress = false;

  function isContactsPage() {
    return window.location.pathname.replace(/\/$/, "") === "/contacts";
  }

  function syncIsComplete() {
    try {
      return window.localStorage.getItem(storageKey) === "complete";
    } catch (error) {
      return false;
    }
  }

  function setSyncComplete() {
    try {
      window.localStorage.setItem(storageKey, "complete");
    } catch (error) {
      // The demo still completes for browsers that block local storage.
    }
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function createModal() {
    var refreshOnClose = false;
    var root = createElement("div", "linkedin-sync-modal-root");
    root.id = modalRootId;
    root.hidden = true;

    var mask = createElement("div", "ant-modal-mask");
    var wrap = createElement("div", "ant-modal-wrap");
    var modal = createElement("div", "ant-modal");
    var content = createElement("div", "ant-modal-content");
    var close = createElement("button", "ant-modal-close");
    var closeIcon = createElement("span", "ant-modal-close-x", "×");
    var header = createElement("div", "ant-modal-header");
    var title = createElement("div", "ant-modal-title", "Sync contacts with LinkedIn");
    var body = createElement("div", "ant-modal-body");

    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-labelledby", "linkedin-sync-title");
    title.id = "linkedin-sync-title";
    close.type = "button";
    close.setAttribute("aria-label", "Close LinkedIn sync");

    var connectionCard = createElement("div", "linkedin-connection-card");
    var brand = createElement("span", "linkedin-brand-icon", "in");
    brand.setAttribute("aria-hidden", "true");
    var connectionCopy = createElement("div", "linkedin-connection-copy");
    var connectionHeading = createElement("div", "linkedin-connection-heading");
    var connectedDot = createElement("span", "linkedin-connected-dot");
    connectedDot.setAttribute("aria-hidden", "true");
    connectionHeading.appendChild(connectedDot);
    connectionHeading.appendChild(document.createTextNode("Connected to LinkedIn"));
    connectionCopy.appendChild(connectionHeading);
    connectionCopy.appendChild(
      createElement("p", "", "Demo account · Connection active")
    );
    connectionCard.appendChild(brand);
    connectionCard.appendChild(connectionCopy);

    var description = createElement(
      "p",
      "linkedin-sync-description",
      "Register this CRM connection, then import 20 new contacts from your LinkedIn network. This is a visual demo and no LinkedIn data will be contacted."
    );

    var registerButton = createElement(
      "button",
      "ant-btn ant-btn-lg linkedin-modal-action linkedin-register-button",
      "REGISTER WITH LINKEDIN"
    );
    registerButton.type = "button";

    var separator = createElement("div", "linkedin-sync-separator");
    var syncButton = createElement(
      "button",
      "ant-btn ant-btn-primary ant-btn-lg linkedin-modal-action linkedin-sync-submit",
      syncIsComplete() ? "SYNC 20 CONTACTS AGAIN" : "SYNC 20 CONTACTS"
    );
    syncButton.type = "button";
    var progress = createElement("div", "linkedin-sync-progress");
    var status = createElement("p", "linkedin-sync-status");
    status.setAttribute("aria-live", "polite");

    body.appendChild(connectionCard);
    body.appendChild(description);
    body.appendChild(registerButton);
    body.appendChild(separator);
    body.appendChild(syncButton);
    body.appendChild(progress);
    body.appendChild(status);

    close.appendChild(closeIcon);
    header.appendChild(title);
    content.appendChild(close);
    content.appendChild(header);
    content.appendChild(body);
    modal.appendChild(content);
    wrap.appendChild(modal);
    root.appendChild(mask);
    root.appendChild(wrap);

    function closeModal() {
      if (syncInProgress) return;
      if (refreshOnClose) {
        window.location.reload();
        return;
      }
      root.hidden = true;
      document.body.classList.remove("ant-scrolling-effect");
      var trigger = document.getElementById(triggerId);
      if (trigger) trigger.focus();
    }

    close.addEventListener("click", closeModal);
    mask.addEventListener("click", closeModal);
    wrap.addEventListener("click", function closeOnBackdrop(event) {
      if (event.target === wrap) closeModal();
    });

    registerButton.addEventListener("click", function registerMockConnection() {
      registerButton.textContent = "✓ REGISTERED WITH LINKEDIN";
      registerButton.disabled = true;
      status.textContent = "Registration confirmed for this demo account.";
      window.setTimeout(function clearRegistrationStatus() {
        status.textContent = "";
      }, 1600);
    });

    syncButton.addEventListener("click", function syncMockContacts() {
      if (syncInProgress) return;
      syncInProgress = true;
      syncButton.disabled = true;
      registerButton.disabled = true;
      close.disabled = true;
      syncButton.textContent = "SYNCING…";
      progress.classList.add("is-active");
      status.textContent = "Finding new LinkedIn connections…";

      window.setTimeout(function showImportStep() {
        status.textContent = "Importing 20 contacts…";
      }, 650);

      window.setTimeout(function finishSync() {
        setSyncComplete();
        syncInProgress = false;
        refreshOnClose = true;
        close.disabled = false;
        progress.classList.remove("is-active");
        syncButton.textContent = "✓ 20 CONTACTS SYNCED";
        status.textContent =
          "Sync complete. Close this window to view the 20 new contacts.";
      }, 1400);
    });

    root.__closeLinkedInSync = closeModal;

    root.__openLinkedInSync = function openLinkedInSync() {
      root.hidden = false;
      document.body.classList.add("ant-scrolling-effect");
      window.setTimeout(function focusFirstAction() {
        registerButton.focus();
      }, 0);
    };

    document.body.appendChild(root);
    return root;
  }

  function addTrigger() {
    if (!isContactsPage() || document.getElementById(triggerId)) return;
    var addNew = document.getElementById("add-new");
    if (!addNew || !addNew.parentNode) return;

    var button = createElement(
      "button",
      "ant-btn ant-btn-lg linkedin-sync-trigger"
    );
    button.id = triggerId;
    button.type = "button";
    var icon = createElement("span", "linkedin-sync-button-icon", "in");
    icon.setAttribute("aria-hidden", "true");
    button.appendChild(icon);
    button.appendChild(document.createTextNode("SYNC WITH LINKEDIN"));
    button.addEventListener("click", function openModal() {
      var root = document.getElementById(modalRootId) || createModal();
      root.__openLinkedInSync();
    });

    addNew.parentNode.insertBefore(button, addNew);
  }

  function removeContactsOnlyUI() {
    if (isContactsPage()) return;
    var trigger = document.getElementById(triggerId);
    var modal = document.getElementById(modalRootId);
    if (trigger) trigger.remove();
    if (modal) modal.remove();
  }

  function reconcile() {
    removeContactsOnlyUI();
    addTrigger();
  }

  document.addEventListener("keydown", function closeModalWithEscape(event) {
    if (event.key !== "Escape" || syncInProgress) return;
    var root = document.getElementById(modalRootId);
    if (root && !root.hidden) root.__closeLinkedInSync();
  });

  var observer = new MutationObserver(reconcile);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("popstate", reconcile);
  window.setInterval(reconcile, 500);
  reconcile();
})();
