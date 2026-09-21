"use strict";

/* =========================================
   TOOLBOX - TIMETABLE MAKER
========================================= */

const classForm = document.getElementById("classForm");
const downloadBtn = document.getElementById("downloadBtn");

const studentName = document.getElementById("studentName");
const courseName = document.getElementById("courseName");
const semester = document.getElementById("semester");

const classDay = document.getElementById("classDay");
const subjectName = document.getElementById("subjectName");
const teacherName = document.getElementById("teacherName");
const roomNumber = document.getElementById("roomNumber");
const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");

const timetableBody = document.getElementById("timetableBody");
const mobileSchedule = document.getElementById("mobileSchedule");

const displayTitle = document.getElementById("displayTitle");
const displayInfo = document.getElementById("displayInfo");

const printBtn = document.getElementById("printBtn");
const clearBtn = document.getElementById("clearBtn");

const STORAGE_KEY = "toolboxTimetable";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

let timetableData = {
  studentName: "",
  courseName: "",
  semester: "",
  classes: []
};


/* =========================================
   LOAD DATA
========================================= */

function loadData() {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    renderTimetable();
    return;
  }

  try {

    timetableData = JSON.parse(saved);

    studentName.value = timetableData.studentName || "";
    courseName.value = timetableData.courseName || "";
    semester.value = timetableData.semester || "";

    renderTimetable();

  } catch (error) {

    console.error("Could not load timetable:", error);

    timetableData = {
      studentName: "",
      courseName: "",
      semester: "",
      classes: []
    };

    renderTimetable();
  }
}


/* =========================================
   SAVE DATA
========================================= */

function saveData() {

  timetableData.studentName = studentName.value.trim();
  timetableData.courseName = courseName.value.trim();
  timetableData.semester = semester.value.trim();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(timetableData)
  );
}


/* =========================================
   TIME FORMAT
========================================= */

function formatTime(time) {

  if (!time) return "";

  const [hours, minutes] = time.split(":");

  let hour = parseInt(hours, 10);

  const suffix = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;

  if (hour === 0) {
    hour = 12;
  }

  return `${hour}:${minutes} ${suffix}`;
}


/* =========================================
   ESCAPE HTML
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
   SORT CLASSES
========================================= */

function sortClasses(classes) {

  return [...classes].sort((a, b) => {

    return a.startTime.localeCompare(b.startTime);

  });
}


/* =========================================
   ADD CLASS
========================================= */

classForm.addEventListener("submit", function (event) {

  event.preventDefault();

  if (
    !classDay.value ||
    !subjectName.value.trim() ||
    !startTime.value ||
    !endTime.value
  ) {
    alert("Please fill all required fields.");
    return;
  }


  if (endTime.value <= startTime.value) {

    alert("End time must be after start time.");

    return;
  }


  const newClass = {

    id: Date.now(),

    day: classDay.value,

    subject: subjectName.value.trim(),

    teacher: teacherName.value.trim(),

    room: roomNumber.value.trim(),

    startTime: startTime.value,

    endTime: endTime.value

  };


  timetableData.classes.push(newClass);

  saveData();

  renderTimetable();

  classForm.reset();

  subjectName.focus();

});


/* =========================================
   RENDER TIMETABLE
========================================= */

function renderTimetable() {

  renderDesktopTimetable();

  renderMobileTimetable();

  updateHeader();

}


/* =========================================
   DESKTOP TABLE
========================================= */

function renderDesktopTimetable() {

  timetableBody.innerHTML = "";

  if (timetableData.classes.length === 0) {

    timetableBody.innerHTML = `
      <tr>
        <td colspan="7" style="padding:35px;color:var(--muted);">
          No classes added yet.
        </td>
      </tr>
    `;

    return;
  }


  const times = getUniqueTimes();


  times.forEach(time => {

    const row = document.createElement("tr");

    const timeCell = document.createElement("td");

    timeCell.className = "time-cell";

    timeCell.textContent = formatTime(time.startTime);

    timeCell.innerHTML +=
      `<br>–<br>${formatTime(time.endTime)}`;

    row.appendChild(timeCell);


    days.forEach(day => {

      const cell = document.createElement("td");

      cell.className = "class-cell";

      const classes = timetableData.classes.filter(item =>

        item.day === day &&
        item.startTime === time.startTime &&
        item.endTime === time.endTime

      );


      if (classes.length === 0) {

        cell.innerHTML = `<span class="empty-cell">—</span>`;

      } else {

        cell.innerHTML = classes
          .map(createClassHTML)
          .join("");

      }

      row.appendChild(cell);

    });


    timetableBody.appendChild(row);

  });

}


/* =========================================
   CREATE CLASS HTML
========================================= */

function createClassHTML(item) {

  return `
    <div class="class-item">

      <div class="class-subject">
        ${escapeHTML(item.subject)}
      </div>

      ${
        item.teacher
          ? `<div class="class-teacher">
              <i class="fa-solid fa-user"></i>
              ${escapeHTML(item.teacher)}
            </div>`
          : ""
      }

      ${
        item.room
          ? `<div class="class-room">
              <i class="fa-solid fa-location-dot"></i>
              ${escapeHTML(item.room)}
            </div>`
          : ""
      }

      <div class="class-time">
        ${formatTime(item.startTime)}
        –
        ${formatTime(item.endTime)}
      </div>

    </div>
  `;
}


/* =========================================
   UNIQUE TIME SLOTS
========================================= */

function getUniqueTimes() {

  const map = new Map();

  timetableData.classes.forEach(item => {

    const key = `${item.startTime}-${item.endTime}`;

    if (!map.has(key)) {

      map.set(key, {

        startTime: item.startTime,

        endTime: item.endTime

      });

    }

  });


  return [...map.values()].sort((a, b) =>

    a.startTime.localeCompare(b.startTime)

  );
}


/* =========================================
   MOBILE VIEW
========================================= */

function renderMobileTimetable() {

  mobileSchedule.innerHTML = "";


  days.forEach(day => {

    const dayClasses = sortClasses(
      timetableData.classes.filter(item => item.day === day)
    );


    const dayBox = document.createElement("div");

    dayBox.className = "mobile-day";


    let html = `
      <div class="mobile-day-header">
        ${day}
      </div>
    `;


    if (dayClasses.length === 0) {

      html += `
        <div class="mobile-empty">
          No classes scheduled.
        </div>
      `;

    } else {

      dayClasses.forEach(item => {

        html += `
          <div class="mobile-class">

            <strong>
              ${escapeHTML(item.subject)}
            </strong>

            <span>
              <i class="fa-regular fa-clock"></i>
              ${formatTime(item.startTime)}
              –
              ${formatTime(item.endTime)}
            </span>

            ${
              item.teacher
                ? `
                  <span>
                    <i class="fa-solid fa-user"></i>
                    ${escapeHTML(item.teacher)}
                  </span>
                `
                : ""
            }

            ${
              item.room
                ? `
                  <span>
                    <i class="fa-solid fa-location-dot"></i>
                    ${escapeHTML(item.room)}
                  </span>
                `
                : ""
            }

          </div>
        `;

      });

    }


    dayBox.innerHTML = html;

    mobileSchedule.appendChild(dayBox);

  });

}


/* =========================================
   HEADER INFO
========================================= */

function updateHeader() {

  const name = timetableData.studentName;

  const course = timetableData.courseName;

  const sem = timetableData.semester;


  if (name) {

    displayTitle.textContent =
      `${name}'s Timetable`;

  } else {

    displayTitle.textContent =
      "Weekly Timetable";

  }


  const info = [course, sem]
    .filter(Boolean)
    .join(" • ");


  displayInfo.textContent =
    info || "Your weekly college timetable";

}


/* =========================================
   LIVE DETAILS UPDATE
========================================= */

[
  studentName,
  courseName,
  semester
].forEach(input => {

  input.addEventListener("input", function () {

    saveData();

    updateHeader();

  });

});


/* =========================================
   PRINT
========================================= */

printBtn.addEventListener("click", function () {

  window.print();

});


/* =========================================
   CLEAR ALL
========================================= */

clearBtn.addEventListener("click", function () {

  if (timetableData.classes.length === 0) {

    alert("There are no classes to clear.");

    return;
  }


  const confirmed = confirm(
    "Are you sure you want to clear the complete timetable?"
  );


  if (!confirmed) return;


  timetableData.classes = [];

  saveData();

  renderTimetable();

});


/* =========================================
   INITIALIZE
========================================= */

loadData();

/* =========================================
   DIRECT DOWNLOAD AS PDF
========================================= */

downloadBtn.addEventListener("click", async function () {

  if (timetableData.classes.length === 0) {
    alert("Please add at least one class before downloading.");
    return;
  }

  const table = document.querySelector(".timetable-table");

  if (!table) {
    alert("Timetable not found.");
    return;
  }

  const originalHTML = downloadBtn.innerHTML;

  downloadBtn.disabled = true;

  downloadBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    Creating PDF...
  `;

  try {

    const canvas = await html2canvas(table, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true
    });

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;

    const name =
      timetableData.studentName || "Student";

    const course =
      timetableData.courseName || "";

    const semester =
      timetableData.semester || "";

    /* ---------- TITLE ---------- */

    pdf.setTextColor(20, 20, 20);

    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");

    pdf.text(
      `${name}'s Timetable`,
      pageWidth / 2,
      16,
      { align: "center" }
    );

    /* ---------- SUBTITLE ---------- */

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    let subtitle = [course, semester]
      .filter(Boolean)
      .join(" • ");

    if (subtitle) {

      pdf.setTextColor(100, 100, 100);

      pdf.text(
        subtitle,
        pageWidth / 2,
        23,
        { align: "center" }
      );

    }

    /* ---------- TABLE ---------- */

    const imageData = canvas.toDataURL("image/png");

    const availableWidth =
      pageWidth - margin * 2;

    const availableHeight =
      pageHeight - 38;

    const imageRatio =
      canvas.width / canvas.height;

    let imageWidth = availableWidth;

    let imageHeight =
      imageWidth / imageRatio;

    if (imageHeight > availableHeight) {

      imageHeight = availableHeight;

      imageWidth =
        imageHeight * imageRatio;

    }

    const x =
      (pageWidth - imageWidth) / 2;

    const y = 30;

    pdf.addImage(
      imageData,
      "PNG",
      x,
      y,
      imageWidth,
      imageHeight
    );

    /* ---------- FOOTER ---------- */

    pdf.setFontSize(8);

    pdf.setTextColor(130, 130, 130);

    pdf.text(
      "Created with TOOLBOX",
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );

    /* ---------- DOWNLOAD ---------- */

    const safeName = name
      .replace(/[^a-z0-9]/gi, "-")
      .replace(/-+/g, "-");

    pdf.save(
      `${safeName || "Student"}-Timetable.pdf`
    );

  } catch (error) {

    console.error("PDF generation failed:", error);

    alert(
      "PDF could not be generated. Please try again."
    );

  } finally {

    downloadBtn.disabled = false;

    downloadBtn.innerHTML = originalHTML;

  }

});