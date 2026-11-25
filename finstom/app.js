(function () {
  var DEFAULT_BRAND = "Финская стоматология";
  var BRAND_KEY = "clinic_preview_brand";
  var A11Y_KEY = "clinic_a11y_large";
  var COOKIE_KEY = "clinic_cookie_choice";

  // 1. Mobile navigation drawer
  var menuBtn = document.getElementById("menuToggle");
  var drawer = document.getElementById("mobileDrawer");
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", function () {
      var expanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!expanded));
      drawer.classList.toggle("is-open", !expanded);
      drawer.hidden = expanded;
    });
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuBtn.setAttribute("aria-expanded", "false");
        drawer.classList.remove("is-open");
        drawer.hidden = true;
      });
    });
  }

  // 2. Visually impaired mode (Приказ 956н / ПП 736)
  var a11yButtons = document.querySelectorAll("[data-a11y-toggle]");
  function setA11y(enabled) {
    document.documentElement.classList.toggle("a11y-large", enabled);
    a11yButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(enabled));
      btn.textContent = enabled ? "Обычная версия" : "Версия для слабовидящих";
    });
    try {
      localStorage.setItem(A11Y_KEY, enabled ? "1" : "0");
    } catch (e) {}
  }
  try {
    if (localStorage.getItem(A11Y_KEY) === "1") {
      setA11y(true);
    }
  } catch (e) {}
  a11yButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isOn = document.documentElement.classList.contains("a11y-large");
      setA11y(!isOn);
    });
  });

  // 3. Price tabs
  var tabButtons = document.querySelectorAll("[data-price-tab]");
  var tabPanels = document.querySelectorAll("[data-price-panel]");
  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-price-tab");
      tabButtons.forEach(function (b) {
        b.setAttribute("aria-selected", String(b === btn));
      });
      tabPanels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-price-panel") !== target;
      });
    });
  });

  // 4. Booking form demo confirmation (no third-party transfer)
  var bookingForm = document.getElementById("bookingForm");
  var formStatus = document.getElementById("formStatus");
  if (bookingForm && formStatus) {
    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var nameInput = document.getElementById("patientName");
      var phoneInput = document.getElementById("patientPhone");
      var nameVal = nameInput ? nameInput.value.trim() : "";
      var phoneVal = phoneInput ? phoneInput.value.trim() : "";
      formStatus.hidden = false;
      formStatus.textContent =
        "Заявка оформлена для " +
        (nameVal || "пациента") +
        " (" +
        (phoneVal || "телефон указан") +
        "). На рабочем сайте уведомление сразу поступит администратору на +7 (4912) 27-62-27.";
      bookingForm.reset();
    });
  }

  // 5. Cookie consent banner
  var cookieBanner = document.getElementById("cookieBanner");
  if (cookieBanner) {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        cookieBanner.hidden = false;
      }
    } catch (e) {
      cookieBanner.hidden = false;
    }
    cookieBanner.querySelectorAll("[data-cookie-choice]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var choice = btn.getAttribute("data-cookie-choice");
        try {
          localStorage.setItem(COOKIE_KEY, choice || "essential");
        } catch (e) {}
        cookieBanner.hidden = true;
      });
    });
  }

  // 6. Legal modals
  document.querySelectorAll("[data-open-dialog]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var dialog = document.getElementById(trigger.getAttribute("data-open-dialog"));
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    });
  });
  document.querySelectorAll("dialog.legal-dialog [data-close-dialog]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dialog = btn.closest("dialog");
      if (dialog) dialog.close();
    });
  });

  // 7. Live clinic brand name switcher (?brand=... + presets + custom input)
  var brandNodes = document.querySelectorAll("[data-brand-name]");
  var presetButtons = document.querySelectorAll("[data-brand-preset]");
  var brandInput = document.getElementById("customBrandInput");
  var studioTrigger = document.getElementById("brandStudioTrigger");
  var studioPanel = document.getElementById("brandStudioPanel");
  var studioClose = document.getElementById("brandStudioClose");
  var jsonLdNode = document.getElementById("clinicJsonLd");

  function applyBrand(rawName) {
    var clean = (rawName || "").trim() || DEFAULT_BRAND;
    brandNodes.forEach(function (node) {
      node.textContent = clean;
    });
    document.title = clean + " в Рязани: лечение и имплантация";
    if (brandInput && document.activeElement !== brandInput) {
      brandInput.value = clean;
    }
    presetButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-brand-preset") === clean));
    });
    if (jsonLdNode) {
      try {
        var ld = JSON.parse(jsonLdNode.textContent);
        ld.name = clean;
        jsonLdNode.textContent = JSON.stringify(ld);
      } catch (e) {}
    }
    try {
      localStorage.setItem(BRAND_KEY, clean);
    } catch (e) {}
  }

  var initialBrand = DEFAULT_BRAND;
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get("brand")) {
      initialBrand = params.get("brand");
    } else if (localStorage.getItem(BRAND_KEY)) {
      initialBrand = localStorage.getItem(BRAND_KEY);
    }
  } catch (e) {}
  applyBrand(initialBrand);

  if (studioTrigger && studioPanel) {
    studioTrigger.addEventListener("click", function () {
      var willOpen = studioPanel.hidden;
      studioPanel.hidden = !willOpen;
      studioTrigger.setAttribute("aria-expanded", String(willOpen));
    });
  }
  if (studioClose && studioPanel && studioTrigger) {
    studioClose.addEventListener("click", function () {
      studioPanel.hidden = true;
      studioTrigger.setAttribute("aria-expanded", "false");
    });
  }
  presetButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyBrand(btn.getAttribute("data-brand-preset"));
    });
  });
  if (brandInput) {
    brandInput.addEventListener("input", function () {
      applyBrand(brandInput.value);
    });
  }
})();
