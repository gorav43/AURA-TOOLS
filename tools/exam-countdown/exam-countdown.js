"use strict";

/* =========================================
   TOOLBOX - EXAM COUNTDOWN
========================================= */

const examForm =
  document.getElementById("examForm");

const examName =
  document.getElementById("examName");

const examDate =
  document.getElementById("examDate");

const examTime =
  document.getElementById("examTime");

const examList =
  document.getElementById("examList");

const emptyState =
  document.getElementById("emptyState");

const examCount =
  document.getElementById("examCount");


const STORAGE_KEY =
  "toolboxExamCountdown";


let exams = [];


/* =========================================
   LOAD
========================================= */

function loadExams() {

  const saved =
    localStorage.getItem(STORAGE_KEY);

  if (!saved) {

    renderExams();

    return;
  }

  try {

    exams =
      JSON.parse(saved);

    if (!Array.isArray(exams)) {
      exams = [];
    }

  } catch (error) {

    console.error(
      "Could not load exams:",
      error
    );

    exams = [];

  }

  renderExams();

}


/* =========================================
   SAVE
========================================= */

function saveExams() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(exams)
  );

}


/* =========================================
   ESCAPE
========================================= */

function escapeHTML(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

  const date =
    new Date(
      dateString
    );

  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(timeString) {

  if (!timeString) {
    return "";
  }

  const [hours, minutes] =
    timeString.split(":");

  let hour =
    parseInt(hours, 10);

  const suffix =
    hour >= 12
      ? "PM"
      : "AM";

  hour =
    hour % 12 || 12;

  return `${hour}:${minutes} ${suffix}`;

}


/* =========================================
   GET TARGET DATE
========================================= */

function getTargetDate(exam) {

  return new Date(
    `${exam.date}T${exam.time}:00`
  );

}


/* =========================================
   ADD EXAM
========================================= */

examForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    if (
      !examName.value.trim() ||
      !examDate.value ||
      !examTime.value
    ) {

      alert(
        "Please fill all fields."
      );

      return;
    }


    const target =
      new Date(
        `${examDate.value}T${examTime.value}:00`
      );


    if (
      target.getTime() <=
      Date.now()
    ) {

      alert(
        "Please select a future date and time."
      );

      return;
    }


    const newExam = {

      id: Date.now(),

      name:
        examName.value.trim(),

      date:
        examDate.value,

      time:
        examTime.value

    };


    exams.push(newExam);

    saveExams();

    renderExams();

    examForm.reset();

    examTime.value = "09:00";

    examName.focus();

  }
);


/* =========================================
   CREATE EXAM
========================================= */

function createExamElement(exam) {

  const element =
    document.createElement("div");

  element.className =
    "exam-item";

  element.dataset.id =
    exam.id;


  element.innerHTML = `

    <div class="exam-top">

      <div>

        <div class="exam-name">

          ${escapeHTML(exam.name)}

        </div>

        <div class="exam-date">

          <i class="fa-regular fa-calendar"></i>

          ${formatDate(
            `${exam.date}T${exam.time}:00`
          )}

          •

          ${formatTime(exam.time)}

        </div>

      </div>


      <button
        class="delete-exam"
        data-id="${exam.id}"
        aria-label="Delete exam"
      >

        <i class="fa-solid fa-trash"></i>

      </button>

    </div>


    <div
      class="countdown"
      data-target="${getTargetDate(exam).getTime()}"
    >

      <div class="time-box">

        <strong data-days>0</strong>

        <span>Days</span>

      </div>


      <div class="time-box">

        <strong data-hours>0</strong>

        <span>Hours</span>

      </div>


      <div class="time-box">

        <strong data-minutes>0</strong>

        <span>Minutes</span>

      </div>


      <div class="time-box">

        <strong data-seconds>0</strong>

        <span>Seconds</span>

      </div>

    </div>

  `;


  return element;

}


/* =========================================
   RENDER
========================================= */

function renderExams() {

  examList.innerHTML = "";


  const activeExams =
    exams.filter(
      exam =>
        getTargetDate(exam).getTime()
        > Date.now()
    );


  const expiredExams =
    exams.filter(
      exam =>
        getTargetDate(exam).getTime()
        <= Date.now()
    );


  const sorted =
    [...activeExams, ...expiredExams];


  if (sorted.length === 0) {

    examList.style.display =
      "none";

    emptyState.style.display =
      "block";

  } else {

    examList.style.display =
      "flex";

    emptyState.style.display =
      "none";


    sorted.forEach(exam => {

      const element =
        createExamElement(exam);

      examList.appendChild(element);

    });

  }


  updateExamCount();

  updateCountdowns();

}


/* =========================================
   UPDATE COUNT
========================================= */

function updateExamCount() {

  const active =
    exams.filter(
      exam =>
        getTargetDate(exam).getTime()
        > Date.now()
    ).length;


  examCount.textContent =
    `${active} ${
      active === 1
        ? "Exam"
        : "Exams"
    }`;

}


/* =========================================
   COUNTDOWN
========================================= */

function updateCountdowns() {

  const countdowns =
    document.querySelectorAll(
      ".countdown"
    );


  countdowns.forEach(countdown => {

    const target =
      Number(
        countdown.dataset.target
      );


    const difference =
      target - Date.now();


    const examItem =
      countdown.closest(
        ".exam-item"
      );


    if (difference <= 0) {

      countdown.outerHTML = `
        <div class="expired-message">
          <i class="fa-solid fa-circle-check"></i>
          This exam has started or passed.
        </div>
      `;

      examItem.classList.add(
        "expired"
      );

      return;

    }


    const totalSeconds =
      Math.floor(
        difference / 1000
      );


    const days =
      Math.floor(
        totalSeconds / 86400
      );


    const hours =
      Math.floor(
        (totalSeconds % 86400) / 3600
      );


    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );


    const seconds =
      totalSeconds % 60;


    countdown.querySelector(
      "[data-days]"
    ).textContent =
      String(days).padStart(2, "0");


    countdown.querySelector(
      "[data-hours]"
    ).textContent =
      String(hours).padStart(2, "0");


    countdown.querySelector(
      "[data-minutes]"
    ).textContent =
      String(minutes).padStart(2, "0");


    countdown.querySelector(
      "[data-seconds]"
    ).textContent =
      String(seconds).padStart(2, "0");

  });

}


/* =========================================
   DELETE
========================================= */

examList.addEventListener(
  "click",
  function (event) {

    const deleteButton =
      event.target.closest(
        ".delete-exam"
      );


    if (!deleteButton) {
      return;
    }


    const id =
      Number(
        deleteButton.dataset.id
      );


    const confirmed =
      confirm(
        "Delete this exam?"
      );


    if (!confirmed) {
      return;
    }


    exams =
      exams.filter(
        exam =>
          exam.id !== id
      );


    saveExams();

    renderExams();

  }
);


/* =========================================
   MIN DATE
========================================= */

function setMinimumDate() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  examDate.min =
    `${year}-${month}-${day}`;

}


setMinimumDate();


/* =========================================
   LIVE COUNTDOWN
========================================= */

setInterval(
  updateCountdowns,
  1000
);


setInterval(
  updateExamCount,
  1000
);


/* =========================================
   INITIALIZE
========================================= */

loadExams();