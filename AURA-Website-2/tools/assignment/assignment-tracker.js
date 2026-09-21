"use strict";

/* =========================================
   TOOLBOX - ASSIGNMENT TRACKER
========================================= */

const assignmentForm =
  document.getElementById("assignmentForm");

const assignmentTitle =
  document.getElementById("assignmentTitle");

const subject =
  document.getElementById("subject");

const dueDate =
  document.getElementById("dueDate");

const priority =
  document.getElementById("priority");

const assignmentList =
  document.getElementById("assignmentList");

const emptyState =
  document.getElementById("emptyState");

const totalCount =
  document.getElementById("totalCount");

const pendingCount =
  document.getElementById("pendingCount");

const completedCount =
  document.getElementById("completedCount");

const overdueCount =
  document.getElementById("overdueCount");

const filterButtons =
  document.querySelectorAll(".filter-btn");


const STORAGE_KEY =
  "toolboxAssignments";


let assignments = [];

let currentFilter = "all";


/* =========================================
   LOAD
========================================= */

function loadAssignments() {

  const saved =
    localStorage.getItem(STORAGE_KEY);

  if (!saved) {

    renderAssignments();

    return;
  }

  try {

    assignments =
      JSON.parse(saved);

    if (!Array.isArray(assignments)) {
      assignments = [];
    }

  } catch (error) {

    console.error(
      "Could not load assignments:",
      error
    );

    assignments = [];
  }

  renderAssignments();
}


/* =========================================
   SAVE
========================================= */

function saveAssignments() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(assignments)
  );
}


/* =========================================
   DATE
========================================= */

function getToday() {

  const today =
    new Date();

  today.setHours(
    0, 0, 0, 0
  );

  return today;
}


function isOverdue(item) {

  if (item.completed) {
    return false;
  }

  const today =
    getToday();

  const due =
    new Date(
      item.dueDate + "T00:00:00"
    );

  return due < today;
}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

  if (!dateString) {
    return "";
  }

  const date =
    new Date(
      dateString + "T00:00:00"
    );

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
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
   ADD ASSIGNMENT
========================================= */

assignmentForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    if (
      !assignmentTitle.value.trim() ||
      !subject.value.trim() ||
      !dueDate.value
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }


    const newAssignment = {

      id: Date.now(),

      title:
        assignmentTitle.value.trim(),

      subject:
        subject.value.trim(),

      dueDate:
        dueDate.value,

      priority:
        priority.value,

      completed:
        false

    };


    assignments.unshift(
      newAssignment
    );


    saveAssignments();

    renderAssignments();

    assignmentForm.reset();

    priority.value = "Medium";

    assignmentTitle.focus();

  }
);


/* =========================================
   FILTER
========================================= */

filterButtons.forEach(button => {

  button.addEventListener(
    "click",
    function () {

      filterButtons.forEach(btn => {

        btn.classList.remove(
          "active"
        );

      });


      this.classList.add("active");


      currentFilter =
        this.dataset.filter;


      renderAssignments();

    }
  );

});


/* =========================================
   FILTER DATA
========================================= */

function getFilteredAssignments() {

  if (currentFilter === "pending") {

    return assignments.filter(
      item => !item.completed
    );

  }


  if (currentFilter === "completed") {

    return assignments.filter(
      item => item.completed
    );

  }


  return assignments;

}


/* =========================================
   RENDER
========================================= */

function renderAssignments() {

  updateStats();


  const filtered =
    getFilteredAssignments();


  assignmentList.innerHTML = "";


  if (filtered.length === 0) {

    assignmentList.style.display =
      "none";

    emptyState.style.display =
      "block";


    if (assignments.length > 0) {

      emptyState.querySelector("h3")
        .textContent =
        "No assignments found";

      emptyState.querySelector("p")
        .textContent =
        "Try another filter.";

    } else {

      emptyState.querySelector("h3")
        .textContent =
        "No assignments yet";

      emptyState.querySelector("p")
        .textContent =
        "Add your first assignment above.";

    }


    return;

  }


  assignmentList.style.display =
    "flex";

  emptyState.style.display =
    "none";


  filtered.forEach(item => {

    assignmentList.appendChild(
      createAssignmentElement(item)
    );

  });

}


/* =========================================
   CREATE ITEM
========================================= */

function createAssignmentElement(item) {

  const element =
    document.createElement("div");


  element.className =
    "assignment-item";


  if (item.completed) {

    element.classList.add(
      "completed"
    );

  }


  const overdue =
    isOverdue(item);


  const priorityClass =
    item.priority.toLowerCase();


  element.innerHTML = `

    <button
      class="complete-check"
      data-id="${item.id}"
      aria-label="Mark assignment complete"
    >

      ${
        item.completed
          ? '<i class="fa-solid fa-check"></i>'
          : ''
      }

    </button>


    <div class="assignment-content">

      <h3>
        ${escapeHTML(item.title)}
      </h3>


      <div class="assignment-meta">

        <span class="meta-item">

          <i class="fa-solid fa-book"></i>

          ${escapeHTML(item.subject)}

        </span>


        <span
          class="meta-item ${
            overdue ? "overdue" : ""
          }"
        >

          <i class="fa-regular fa-calendar"></i>

          ${
            overdue
              ? "Overdue • "
              : "Due • "
          }

          ${formatDate(item.dueDate)}

        </span>


        <span
          class="badge priority-${priorityClass}"
        >

          ${escapeHTML(item.priority)}

        </span>


        ${
          item.completed
            ? `
              <span class="badge completed-badge">
                Completed
              </span>
            `
            : ""
        }

      </div>

    </div>


    <button
      class="delete-btn"
      data-id="${item.id}"
      aria-label="Delete assignment"
    >

      <i class="fa-solid fa-trash"></i>

    </button>

  `;


  return element;

}


/* =========================================
   CLICK ACTIONS
========================================= */

assignmentList.addEventListener(
  "click",
  function (event) {

    const completeButton =
      event.target.closest(
        ".complete-check"
      );


    const deleteButton =
      event.target.closest(
        ".delete-btn"
      );


    /* ---------- COMPLETE ---------- */

    if (completeButton) {

      const id =
        Number(
          completeButton.dataset.id
        );


      const item =
        assignments.find(
          assignment =>
            assignment.id === id
        );


      if (item) {

        item.completed =
          !item.completed;

        saveAssignments();

        renderAssignments();

      }

    }


    /* ---------- DELETE ---------- */

    if (deleteButton) {

      const id =
        Number(
          deleteButton.dataset.id
        );


      const confirmed =
        confirm(
          "Delete this assignment?"
        );


      if (!confirmed) {
        return;
      }


      assignments =
        assignments.filter(
          item =>
            item.id !== id
        );


      saveAssignments();

      renderAssignments();

    }

  }
);


/* =========================================
   STATS
========================================= */

function updateStats() {

  const total =
    assignments.length;


  const completed =
    assignments.filter(
      item => item.completed
    ).length;


  const pending =
    total - completed;


  const overdue =
    assignments.filter(
      item => isOverdue(item)
    ).length;


  totalCount.textContent =
    total;


  pendingCount.textContent =
    pending;


  completedCount.textContent =
    completed;


  overdueCount.textContent =
    overdue;

}


/* =========================================
   SET MIN DATE
========================================= */

function setMinimumDate() {

  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");


  dueDate.min =
    `${year}-${month}-${day}`;

}


setMinimumDate();


/* =========================================
   INITIALIZE
========================================= */

loadAssignments();