const surveyData = {
    full_name: "",
    phone: "",
    tg: "",
    agreement: "",
    experience: "",
    role: "",
    has_attended: "",
    how_ready: "",
    course: "",
  },
  $ = (e, t = document) => t.querySelector(e),
  getCheckedVal = (e) =>
    (e = document.querySelector(`input[name="${e}"]:checked`)) ? e.value : "",
  show = (e) => (e.style.display = ""),
  hide = (e) => (e.style.display = "none"),
  modal = $(".modal"),
  step1 = $("#survey-form-step-1"),
  step2 = $("#survey-form-step-2"),
  step3 = $("#survey-form-step-3"),
  closeBtn = $(".modal-close"),
  backBtns = document.querySelectorAll(".survey-back"),
  surveyForm = $("#survey-form");
(window.openSuvey = function () {
  const e = $("#full_name")?.value.trim(),
    t = $("#phone")?.value.trim(),
    s = $("#telegram")?.value.trim(),
    n = $("#course")?.value.trim(),
    o = !0 === $("#agreement")?.checked;
  e && t && o
    ? ((surveyData.full_name = e),
      (surveyData.phone = t),
      (surveyData.tg = s || ""),
      (surveyData.course = n || ""),
      (surveyData.agreement = o ? "yes" : "no"),
      show(step1),
      hide(step2),
      hide(step3),
      modal.classList.add("is-open"))
    : alert("Please fill all required fields.");
}),
  (window.goToStep2 = function () {
    var e = getCheckedVal("experience"),
      t = getCheckedVal("role");
    e && t
      ? ((surveyData.experience = e),
        (surveyData.role = t),
        hide(step1),
        show(step2))
      : alert("Please select experience and role");
  }),
  (window.goToStep1 = function () {
    hide(step2), show(step1);
  }),
  (window.closeSurveyModal = function () {
    modal.classList.remove("is-open"),
      (step1.style.display = "none"),
      (step2.style.display = "none"),
      (step3.style.display = "none");
  }),
  closeBtn?.addEventListener("click", () => {
    modal.classList.remove("is-open");
  }),
  backBtns.forEach((e) => {
    e.addEventListener("click", () => {
      "none" !== step2.style.display
        ? goToStep1()
        : modal.classList.remove("is-open");
    });
  }),
  surveyForm.addEventListener("submit", async (e) => {
    e.preventDefault(), (e = getCheckedVal("has_attended"));
    var t = getCheckedVal("how_ready");
    if (e && t) {
      (surveyData.has_attended = e),
        (surveyData.how_ready = t),
        (e = { ...surveyData, submittedAt: new Date().toISOString() });
      try {
        var s = await fetch(
            "https://pattern-960410420882.europe-central2.run.app",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(e),
            }
          ),
          n = await s.text();
        if (s.ok) {
          try {
            JSON.parse(n);
          } catch {}
          fbq("track", "Lead", {}),
            hide(step1),
            hide(step2),
            show(step3),
            setTimeout(() => {
              window.location.href = "https://secure.wayforpay.com/button/bf7e03987b52c";
            }, 2e3);
        } else
          alert(
            "The server rejected the request. (HTTP " +
              s.status +
              "). Details in the console."
          );
      } catch (e) {
        alert("A network error has occurred. Check the console.");
      }
    } else alert("Please answer both questions.");
  });
const rules = [
  {
    btn: "#open-survey-btn",
    req: ["#full_name", "#phone", { check: "#agreement" }],
  },
  {
    btn: "#survey-next-step1",
    req: [{ radio: "experience" }, { radio: "role" }],
  },
  {
    btn: "#survey-submit-btn",
    req: [{ radio: "has_attended" }, { radio: "how_ready" }],
  },
];
function filled(e) {
  if ("string" == typeof e) {
    const t = document.querySelector(e);
    return !(
      !t ||
      !(
        ("value" in t && t.value.trim()) ||
        ("checkbox" === t.type && t.checked)
      )
    );
  }
  return e.radio
    ? !!document.querySelector(`input[name="${e.radio}"]:checked`)
    : !!e.check && !!document.querySelector(e.check)?.checked;
}
function updateButtons() {
  for (const { btn: e, req: t } of rules) {
    const s = document.querySelector(e);
    s && (s.disabled = !t.every(filled));
  }
}
document.addEventListener("input", updateButtons),
  document.addEventListener("change", updateButtons),
  updateButtons(),
  (window.openSuvey = (function (e) {
    return function (...t) {
      e?.apply(this, t), updateButtons();
    };
  })(window.openSuvey));
