/* =========================================================================
   Missless — Book a Demo
   Vanilla JS handling: 3-step booking flow, calendar render, time selection,
   form validation, confirmation. (Navbar + mobile drawer live in main.js.)
   ========================================================================= */

(function () {
  "use strict";

  // ---------------------------------------------------------------------
  // Footer year
  // ---------------------------------------------------------------------
  document.getElementById("footerYear").textContent = new Date().getFullYear();

  // ---------------------------------------------------------------------
  // Booking flow — state
  // ---------------------------------------------------------------------
  const state = {
    step: 1, // 1, 2, 3, or "confirm"
    data: {
      fullName: "",
      businessName: "",
      workEmail: "",
      phone: "",
      message: "",
      marketingOptIn: false,
    },
    selectedDate: null,
    selectedTime: null,
    viewMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    submitting: false,
  };

  const TIME_SLOTS = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  // ---------------------------------------------------------------------
  // DOM refs
  // ---------------------------------------------------------------------
  const stepPanels = document.querySelectorAll("[data-step-panel]");
  const stepIndicatorItems = document.querySelectorAll(
    "#stepIndicator .steps__item"
  );

  // Step 1 inputs
  const fullNameInput = document.getElementById("fullName");
  const businessNameInput = document.getElementById("businessName");
  const workEmailInput = document.getElementById("workEmail");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  const marketingOptInInput = document.getElementById("marketingOptIn");

  const nextToCalendarBtn = document.getElementById("nextToCalendar");
  const nextToTimeBtn = document.getElementById("nextToTime");
  const confirmDemoBtn = document.getElementById("confirmDemo");

  // Step 2 (calendar)
  const calendarGrid = document.getElementById("calendarGrid");
  const calendarMonthLabel = document.getElementById("calendarMonthLabel");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  // Step 3 (time)
  const timeGrid = document.getElementById("timeGrid");

  // Confirmation
  const confirmEmailEl = document.getElementById("confirmEmail");
  const confirmWhenEl = document.getElementById("confirmWhen");

  // ---------------------------------------------------------------------
  // Render: step visibility + indicator state
  // ---------------------------------------------------------------------
  function renderStep() {
    stepPanels.forEach((panel) => {
      const key = panel.getAttribute("data-step-panel");
      const shouldShow = String(state.step) === key;
      if (shouldShow) {
        panel.removeAttribute("hidden");
        panel.classList.add("is-active");
      } else {
        panel.setAttribute("hidden", "");
        panel.classList.remove("is-active");
      }
    });

    stepIndicatorItems.forEach((item) => {
      const num = Number(item.getAttribute("data-step"));
      item.classList.remove("is-active", "is-done");
      if (state.step === "confirm") {
        item.classList.add("is-done");
      } else if (num < state.step) {
        item.classList.add("is-done");
      } else if (num === state.step) {
        item.classList.add("is-active");
      }
    });

    // Hide the indicator when on confirmation step
    const indicator = document.getElementById("stepIndicator");
    if (indicator) {
      indicator.style.display = state.step === "confirm" ? "none" : "";
    }
  }

  // ---------------------------------------------------------------------
  // Step 1 validation
  // ---------------------------------------------------------------------
  function validateStep1() {
    const validEmail = /\S+@\S+\.\S+/.test(state.data.workEmail);
    const ok =
      state.data.fullName.trim().length > 0 &&
      state.data.businessName.trim().length > 0 &&
      validEmail;
    nextToCalendarBtn.disabled = !ok;
  }

  function bindStep1Inputs() {
    fullNameInput.addEventListener("input", (e) => {
      state.data.fullName = e.target.value;
      validateStep1();
    });
    businessNameInput.addEventListener("input", (e) => {
      state.data.businessName = e.target.value;
      validateStep1();
    });
    workEmailInput.addEventListener("input", (e) => {
      state.data.workEmail = e.target.value;
      validateStep1();
    });
    phoneInput.addEventListener("input", (e) => {
      state.data.phone = e.target.value;
    });
    messageInput.addEventListener("input", (e) => {
      state.data.message = e.target.value;
    });
    marketingOptInInput.addEventListener("change", (e) => {
      state.data.marketingOptIn = e.target.checked;
    });

    nextToCalendarBtn.addEventListener("click", () => {
      if (nextToCalendarBtn.disabled) return;
      state.step = 2;
      renderStep();
      renderCalendar();
    });
  }

  // ---------------------------------------------------------------------
  // Step 2 — calendar
  // ---------------------------------------------------------------------
  function buildCalendarCells(viewMonth) {
    const firstOfMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth(),
      1
    );
    const startWeekday = firstOfMonth.getDay();
    const start = new Date(firstOfMonth);
    start.setDate(start.getDate() - startWeekday);

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }
    return cells;
  }

  function renderCalendar() {
    const monthLabel = state.viewMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    calendarMonthLabel.textContent = monthLabel;

    const cells = buildCalendarCells(state.viewMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Clear and rebuild
    calendarGrid.innerHTML = "";

    cells.forEach((cellDate) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "calendar__day";
      btn.textContent = String(cellDate.getDate());
      btn.setAttribute("aria-label", cellDate.toDateString());

      const isCurrentMonth =
        cellDate.getMonth() === state.viewMonth.getMonth();
      const isPast = cellDate < today;
      const disabled = !isCurrentMonth || isPast;

      if (disabled) {
        btn.disabled = true;
      }

      if (
        state.selectedDate &&
        cellDate.toDateString() === state.selectedDate.toDateString()
      ) {
        btn.classList.add("is-selected");
      }

      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        state.selectedDate = cellDate;
        renderCalendar();
        nextToTimeBtn.disabled = false;
      });

      calendarGrid.appendChild(btn);
    });

    nextToTimeBtn.disabled = !state.selectedDate;
  }

  prevMonthBtn.addEventListener("click", () => {
    state.viewMonth = new Date(
      state.viewMonth.getFullYear(),
      state.viewMonth.getMonth() - 1,
      1
    );
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    state.viewMonth = new Date(
      state.viewMonth.getFullYear(),
      state.viewMonth.getMonth() + 1,
      1
    );
    renderCalendar();
  });

  nextToTimeBtn.addEventListener("click", () => {
    if (nextToTimeBtn.disabled) return;
    state.step = 3;
    renderStep();
    renderTimeSlots();
  });

  // ---------------------------------------------------------------------
  // Step 3 — time slots
  // ---------------------------------------------------------------------
  function renderTimeSlots() {
    timeGrid.innerHTML = "";

    TIME_SLOTS.forEach((time) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "time-slot";
      btn.textContent = time;
      btn.setAttribute("role", "radio");
      btn.setAttribute(
        "aria-checked",
        state.selectedTime === time ? "true" : "false"
      );

      if (state.selectedTime === time) {
        btn.classList.add("is-selected");
      }

      btn.addEventListener("click", () => {
        state.selectedTime = time;
        renderTimeSlots();
        confirmDemoBtn.disabled = false;
      });

      timeGrid.appendChild(btn);
    });

    confirmDemoBtn.disabled = !state.selectedTime;
  }

  confirmDemoBtn.addEventListener("click", async () => {
    if (confirmDemoBtn.disabled || state.submitting) return;

    state.submitting = true;
    confirmDemoBtn.disabled = true;
    confirmDemoBtn.querySelector(".btn__label").textContent = "Confirming...";

    try {
      // Replace with real endpoint when ready
      await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...state.data,
          date: state.selectedDate,
          time: state.selectedTime,
        }),
      }).catch(() => {
        /* silently no-op if endpoint not wired yet */
      });
    } finally {
      state.submitting = false;
      showConfirmation();
    }
  });

  // ---------------------------------------------------------------------
  // Confirmation
  // ---------------------------------------------------------------------
  function showConfirmation() {
    const dateStr = state.selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    confirmEmailEl.textContent = state.data.workEmail;
    confirmWhenEl.textContent = `${dateStr} at ${state.selectedTime}`;
    state.step = "confirm";
    renderStep();
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  bindStep1Inputs();
  validateStep1();
  renderStep();
})();
