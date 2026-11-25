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
  var reasonSelect = document.getElementById("patientReason");
  var doctorSelect = document.getElementById("patientDoctor");

  function openBookingFormWith(reason, doctor) {
    var formTab = document.querySelector('[data-booking-tab="form"]');
    if (formTab) formTab.click();
    if (reasonSelect && reason) reasonSelect.value = reason;
    if (doctorSelect && doctor) doctorSelect.value = doctor;
    var bookingCard = document.getElementById("booking");
    if (bookingCard) bookingCard.scrollIntoView({ behavior: "smooth", block: "start" });
    var nameInput = document.getElementById("patientName");
    if (nameInput) nameInput.focus({ preventScroll: true });
  }

  if (bookingForm && formStatus) {
    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var nameInput = document.getElementById("patientName");
      var phoneInput = document.getElementById("patientPhone");
      var nameVal = nameInput ? nameInput.value.trim() : "";
      var phoneVal = phoneInput ? phoneInput.value.trim() : "";
      var docVal = doctorSelect ? doctorSelect.value : "";
      formStatus.hidden = false;
      formStatus.textContent =
        "Заявка оформлена для " +
        (nameVal || "пациента") +
        " (" +
        (phoneVal || "телефон указан") +
        (docVal && docVal !== "Любой свободный врач" ? ", врач: " + docVal : "") +
        "). На рабочем сайте заявка сразу поступит администратору на +7 (4912) 27-62-27.";
      bookingForm.reset();
    });
  }

  // 4b. Price estimator
  var ESTIMATES = {
    pain: {
      title: "Диагностика и лечение кариеса или пульпита",
      desc: "Врач осмотрит зуб, сделает прицельный снимок на радиовизиографе и назовёт точную сумму до начала лечения.",
      step: "Первый шаг: бесплатная консультация терапевта",
      doctorText: "Рекомендуем: Герцовская М. В. или Петросян О. В.",
      price: "от 4 200 ₽",
      reason: "Лечение зуба или гигиена",
      doctor: "Герцовская Марина Владимировна"
    },
    filling: {
      title: "Восстановление зуба и реставрация",
      desc: "Снятие старого материала, обработка полости с анестезией и анатомическая реставрация современными материалами.",
      step: "Первый шаг: бесплатная консультация терапевта",
      doctorText: "Рекомендуем: Петросян О. В. или Захарова Т. Н.",
      price: "от 4 200 ₽",
      reason: "Лечение зуба или гигиена",
      doctor: "Петросян Оксана Викторовна"
    },
    implant: {
      title: "Имплантация AB Dental и протезирование",
      desc: "Подбираем имплант или коронку под клиническую ситуацию и заранее расписываем этапы и стоимость.",
      step: "Первый шаг: осмотр хирурга-ортопеда и план",
      doctorText: "Рекомендуем: Пономарёв Е. О.",
      price: "от 23 000 ₽",
      reason: "Имплантация и протезирование",
      doctor: "Пономарёв Евгений Олегович"
    },
    braces: {
      title: "Исправление прикуса у детей и взрослых",
      desc: "Оценка прикуса, подбор пластин или брекет-системы и понятный график посещений ортодонта.",
      step: "Консультация врача-ортодонта: 1 200 ₽",
      doctorText: "Рекомендуем: Кузьмина Н. А. (стаж более 30 лет)",
      price: "от 18 500 ₽",
      reason: "Ортодонтия",
      doctor: "Кузьмина Наталия Анатольевна"
    },
    kids: {
      title: "Бережный детский приём",
      desc: "Спокойное лечение молочных и постоянных зубов, а также бескровная лазерная пластика уздечки без швов.",
      step: "Первый шаг: знакомство с врачом и осмотр",
      doctorText: "Рекомендуем: детские терапевты клиники",
      price: "от 1 800 ₽",
      reason: "Детский приём",
      doctor: "Любой свободный врач"
    },
    hygiene: {
      title: "Профессиональная гигиена и лазерное отбеливание",
      desc: "Ультразвуковое снятие отложений (90 ₽ за зуб), полирование эмали (90 ₽ за зуб) или лазерное отбеливание.",
      step: "Первый шаг: бесплатная консультация терапевта",
      doctorText: "Рекомендуем: Герцовская М. В. или Захарова Т. Н.",
      price: "от 90 ₽ / зуб",
      reason: "Лечение зуба или гигиена",
      doctor: "Захарова Татьяна Николаевна"
    }
  };
  var activeEstimateKey = "pain";
  var estButtons = document.querySelectorAll("[data-estimate]");
  var estTitle = document.getElementById("estTitle");
  var estDesc = document.getElementById("estDesc");
  var estStep = document.getElementById("estStep");
  var estDoctor = document.getElementById("estDoctor");
  var estPrice = document.getElementById("estPrice");
  var estBookBtn = document.getElementById("estBookBtn");

  estButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-estimate");
      var item = ESTIMATES[key];
      if (!item) return;
      activeEstimateKey = key;
      estButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      if (estTitle) estTitle.textContent = item.title;
      if (estDesc) estDesc.textContent = item.desc;
      if (estStep) estStep.textContent = item.step;
      if (estDoctor) estDoctor.textContent = item.doctorText;
      if (estPrice) estPrice.textContent = item.price;
    });
  });

  if (estBookBtn) {
    estBookBtn.addEventListener("click", function () {
      var item = ESTIMATES[activeEstimateKey] || ESTIMATES.pain;
      openBookingFormWith(item.reason, item.doctor);
    });
  }

  // 4c. Doctor-specific booking buttons
  document.querySelectorAll("[data-book-doctor]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openBookingFormWith(
        btn.getAttribute("data-book-reason"),
        btn.getAttribute("data-book-doctor")
      );
    });
  });

  // 4d. Booking tabs (Form vs 24/7 Bot simulator)
  var bookingTabs = document.querySelectorAll("[data-booking-tab]");
  var bookingPanels = document.querySelectorAll("[data-booking-panel]");
  bookingTabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-booking-tab");
      bookingTabs.forEach(function (b) {
        b.setAttribute("aria-selected", String(b === btn));
      });
      bookingPanels.forEach(function (p) {
        p.hidden = p.getAttribute("data-booking-panel") !== target;
      });
    });
  });

  // 4e. Interactive 3-step booking bot preview
  var botDialog = document.getElementById("botDialog");
  var botControls = document.getElementById("botControls");
  var botState = { step: 1, service: "", slot: "", phone: "" };

  function renderBot() {
    if (!botDialog || !botControls) return;
    botDialog.innerHTML = "";
    botControls.innerHTML = "";

    function addMsg(text, isOut) {
      var p = document.createElement("p");
      p.className = "bot-msg " + (isOut ? "bot-msg-out" : "bot-msg-in");
      p.textContent = text;
      botDialog.appendChild(p);
    }

    addMsg("Здравствуйте. Помогу записаться в клинику без звонка. Выберите направление:", false);

    if (botState.step === 1) {
      var wrap1 = document.createElement("div");
      wrap1.className = "bot-choices";
      ["Терапия и гигиена", "Имплантация и протезирование", "Ортодонтия", "Детский приём"].forEach(function (srv) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "tab-btn";
        b.textContent = srv;
        b.addEventListener("click", function () {
          botState.service = srv;
          botState.step = 2;
          renderBot();
        });
        wrap1.appendChild(b);
      });
      botControls.appendChild(wrap1);
      return;
    }

    addMsg(botState.service, true);
    addMsg("В какое время вам удобнее прийти?", false);

    if (botState.step === 2) {
      var wrap2 = document.createElement("div");
      wrap2.className = "bot-choices";
      ["Утро 9:00–13:00", "День 13:00–17:00", "Вечер 17:00–20:00", "Суббота 9:00–15:00"].forEach(function (slot) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "tab-btn";
        b.textContent = slot;
        b.addEventListener("click", function () {
          botState.slot = slot;
          botState.step = 3;
          renderBot();
        });
        wrap2.appendChild(b);
      });
      botControls.appendChild(wrap2);
      return;
    }

    addMsg(botState.slot, true);
    addMsg("Укажите телефон для подтверждения окошка и напоминания за сутки до приёма:", false);

    if (botState.step === 3) {
      var form = document.createElement("form");
      form.className = "booking-form";
      form.method = "post";
      form.innerHTML =
        '<div class="field-group">' +
        '<label class="field-label" for="botPhoneInput">Телефон для связи</label>' +
        '<input class="field-input" id="botPhoneInput" type="tel" autocomplete="tel" placeholder="+7 (900) 000-00-00" required>' +
        "</div>" +
        '<label class="consent-row" for="botConsentCheck">' +
        '<input id="botConsentCheck" type="checkbox" required>' +
        "<span>Согласен на обработку номера телефона для записи в клинику по 152-ФЗ.</span>" +
        "</label>" +
        '<div class="bot-choices">' +
        '<button class="btn btn-primary" type="submit">Подтвердить запись в боте</button>' +
        '<button class="btn btn-secondary" type="button" id="botResetBtn">Выбрать заново</button>' +
        "</div>";
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ph = document.getElementById("botPhoneInput");
        botState.phone = ph ? ph.value.trim() : "";
        botState.step = 4;
        renderBot();
      });
      botControls.appendChild(form);
      var resetBtn = document.getElementById("botResetBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          botState = { step: 1, service: "", slot: "", phone: "" };
          renderBot();
        });
      }
      return;
    }

    addMsg(botState.phone, true);
    addMsg(
      "Запись зафиксирована: " +
        botState.service +
        ", " +
        botState.slot +
        ". Администратор подтвердит точное время, а бот пришлёт напоминание за 24 часа до визита.",
      false
    );
    var againBtn = document.createElement("button");
    againBtn.type = "button";
    againBtn.className = "btn btn-secondary";
    againBtn.textContent = "Пройти сценарий ещё раз";
    againBtn.addEventListener("click", function () {
      botState = { step: 1, service: "", slot: "", phone: "" };
      renderBot();
    });
    botControls.appendChild(againBtn);
  }
  renderBot();

  // 4f. Real Moscow working hours status
  var hoursNode = document.getElementById("clinicHoursState");
  if (hoursNode) {
    try {
      var nowMsk = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
      var day = nowMsk.getDay();
      var mins = nowMsk.getHours() * 60 + nowMsk.getMinutes();
      if (day >= 1 && day <= 5 && mins >= 540 && mins < 1200) {
        hoursNode.textContent = "Сейчас клиника открыта до 20:00";
      } else if (day === 6 && mins >= 540 && mins < 900) {
        hoursNode.textContent = "Сейчас клиника открыта до 15:00";
      } else if (day === 0 || (day === 6 && mins >= 900)) {
        hoursNode.textContent = "Сейчас закрыто, ближайший приём в понедельник с 9:00";
      } else {
        hoursNode.textContent = "Сейчас закрыто, приём начинается в 9:00";
      }
    } catch (e) {}
  }

  // 4g. Tax deduction certificate demo form
  var taxForm = document.getElementById("taxForm");
  var taxStatus = document.getElementById("taxStatus");
  if (taxForm && taxStatus) {
    taxForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var yr = document.getElementById("taxYear");
      taxStatus.hidden = false;
      taxStatus.textContent =
        "Запрос на справку за " +
        (yr ? yr.value : "2026") +
        " год принят. На рабочем сайте администратор получит заявку и сообщит о готовности документа.";
      taxForm.reset();
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
