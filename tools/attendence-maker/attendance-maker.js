/* =========================================
   TOOLBOX - ATTENDANCE MAKER
========================================= */

"use strict";


/* =========================================
   ELEMENTS
========================================= */

const subjectsList = document.getElementById("subjectsList");

const addSubjectBtn = document.getElementById("addSubjectBtn");

const calculateBtn = document.getElementById("calculateBtn");

const resetBtn = document.getElementById("resetBtn");

const studentName = document.getElementById("studentName");

const targetAttendance =
    document.getElementById("targetAttendance");

const resultCard =
    document.getElementById("resultCard");

const overallPercentage =
    document.getElementById("overallPercentage");

const overallProgress =
    document.getElementById("overallProgress");

const overallClasses =
    document.getElementById("overallClasses");

const targetText =
    document.getElementById("targetText");

const totalClassesResult =
    document.getElementById("totalClassesResult");

const presentClassesResult =
    document.getElementById("presentClassesResult");

const absentClassesResult =
    document.getElementById("absentClassesResult");

const attendanceStatus =
    document.getElementById("attendanceStatus");

const targetMessage =
    document.getElementById("targetMessage");


/* =========================================
   ADD SUBJECT
========================================= */

addSubjectBtn.addEventListener("click", () => {

    const subjectCount =
        subjectsList.querySelectorAll(".subject-row").length + 1;

    const row = document.createElement("div");

    row.className = "subject-row";

    row.innerHTML = `
        <div class="subject-number">
            ${String(subjectCount).padStart(2, "0")}
        </div>

        <div class="subject-name-field">

            <label>Subject</label>

            <input
                type="text"
                class="subject-name"
                placeholder="e.g. Physics"
            >

        </div>

        <div class="attendance-input">

            <label>Total</label>

            <input
                type="number"
                class="total-classes"
                min="0"
                value="0"
            >

        </div>

        <div class="attendance-input">

            <label>Present</label>

            <input
                type="number"
                class="present-classes"
                min="0"
                value="0"
            >

        </div>

        <div class="subject-percentage">
            0%
        </div>

        <button
            type="button"
            class="remove-subject"
            title="Remove Subject"
        >
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    subjectsList.appendChild(row);

    attachRowEvents(row);

    updateSubjectNumbers();
});


/* =========================================
   ROW EVENTS
========================================= */

function attachRowEvents(row) {

    const totalInput =
        row.querySelector(".total-classes");

    const presentInput =
        row.querySelector(".present-classes");

    const removeBtn =
        row.querySelector(".remove-subject");


    totalInput.addEventListener("input", () => {

        validateAttendance(row);

        updateSubjectPercentage(row);

    });


    presentInput.addEventListener("input", () => {

        validateAttendance(row);

        updateSubjectPercentage(row);

    });


    removeBtn.addEventListener("click", () => {

        const rows =
            subjectsList.querySelectorAll(".subject-row");

        if (rows.length === 1) {

            row.querySelector(".subject-name").value = "";

            totalInput.value = 0;

            presentInput.value = 0;

            updateSubjectPercentage(row);

            return;
        }

        row.remove();

        updateSubjectNumbers();
    });
}


/* =========================================
   VALIDATE ATTENDANCE
========================================= */

function validateAttendance(row) {

    const totalInput =
        row.querySelector(".total-classes");

    const presentInput =
        row.querySelector(".present-classes");

    let total =
        Number(totalInput.value) || 0;

    let present =
        Number(presentInput.value) || 0;


    if (total < 0) {
        total = 0;
        totalInput.value = 0;
    }

    if (present < 0) {
        present = 0;
        presentInput.value = 0;
    }

    if (present > total) {
        present = total;

        presentInput.value = total;
    }
}


/* =========================================
   SUBJECT PERCENTAGE
========================================= */

function updateSubjectPercentage(row) {

    const total =
        Number(
            row.querySelector(".total-classes").value
        ) || 0;

    const present =
        Number(
            row.querySelector(".present-classes").value
        ) || 0;

    const percentageElement =
        row.querySelector(".subject-percentage");


    if (total === 0) {

        percentageElement.textContent = "0%";

        return;
    }


    const percentage =
        (present / total) * 100;


    percentageElement.textContent =
        `${percentage.toFixed(1)}%`;
}


/* =========================================
   UPDATE NUMBERS
========================================= */

function updateSubjectNumbers() {

    const rows =
        subjectsList.querySelectorAll(".subject-row");

    rows.forEach((row, index) => {

        const number =
            row.querySelector(".subject-number");

        number.textContent =
            String(index + 1).padStart(2, "0");
    });
}


/* =========================================
   CALCULATE
========================================= */

calculateBtn.addEventListener("click", calculateAttendance);


function calculateAttendance() {

    const rows =
        subjectsList.querySelectorAll(".subject-row");


    let totalClasses = 0;

    let presentClasses = 0;


    rows.forEach(row => {

        validateAttendance(row);

        updateSubjectPercentage(row);


        const total =
            Number(
                row.querySelector(".total-classes").value
            ) || 0;

        const present =
            Number(
                row.querySelector(".present-classes").value
            ) || 0;


        totalClasses += total;

        presentClasses += present;

    });


    const absentClasses =
        totalClasses - presentClasses;


    let percentage = 0;


    if (totalClasses > 0) {

        percentage =
            (presentClasses / totalClasses) * 100;
    }


    const target =
        Math.min(
            100,
            Math.max(
                1,
                Number(targetAttendance.value) || 75
            )
        );


    targetAttendance.value = target;


    /* Result */

    overallPercentage.textContent =
        `${percentage.toFixed(1)}%`;


    overallProgress.style.width =
        `${Math.min(percentage, 100)}%`;


    overallClasses.textContent =
        `${presentClasses} / ${totalClasses} classes`;


    targetText.textContent =
        `Target: ${target}%`;


    totalClassesResult.textContent =
        totalClasses;


    presentClassesResult.textContent =
        presentClasses;


    absentClassesResult.textContent =
        absentClasses;


    /* Status */

    attendanceStatus.classList.remove(
        "good",
        "low"
    );


    if (totalClasses === 0) {

        attendanceStatus.textContent =
            "Add Classes";

        targetMessage.textContent =
            "Enter your classes to see your attendance status.";

    }

    else if (percentage >= target) {

        attendanceStatus.textContent =
            "On Track";

        attendanceStatus.classList.add("good");


        const extra =
            calculateCanMissClasses(
                totalClasses,
                presentClasses,
                target
            );


        if (extra > 0) {

            targetMessage.textContent =
                `You can miss approximately ${extra} more class${extra === 1 ? "" : "es"} and remain at or above your ${target}% target.`;

        } else {

            targetMessage.textContent =
                `Your attendance is currently at or above your ${target}% target.`;
        }

    }

    else {

        attendanceStatus.textContent =
            "Below Target";

        attendanceStatus.classList.add("low");


        const required =
            calculateRequiredClasses(
                totalClasses,
                presentClasses,
                target
            );


        targetMessage.textContent =
            `You need to attend approximately ${required} consecutive class${required === 1 ? "" : "es"} to reach ${target}%.`;
    }


    resultCard.style.display = "block";


    resultCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });


    saveData();
}


/* =========================================
   CLASSES CAN BE MISSED
========================================= */

function calculateCanMissClasses(
    total,
    present,
    target
) {

    let canMiss = 0;


    while (
        (present / (total + canMiss + 1)) * 100
        >= target &&
        canMiss < 1000
    ) {

        canMiss++;
    }


    return canMiss;
}


/* =========================================
   REQUIRED CLASSES
========================================= */

function calculateRequiredClasses(
    total,
    present,
    target
) {

    let required = 0;


    while (
        ((present + required) /
            (total + required)) *
            100 <
            target &&
        required < 1000
    ) {

        required++;
    }


    return required;
}


/* =========================================
   RESET
========================================= */

resetBtn.addEventListener("click", resetAttendance);


function resetAttendance() {

    studentName.value = "";

    targetAttendance.value = 75;


    subjectsList.innerHTML = "";


    createDefaultSubject();


    resultCard.style.display = "none";


    overallPercentage.textContent = "0%";

    overallProgress.style.width = "0%";

    overallClasses.textContent =
        "0 / 0 classes";

    targetText.textContent =
        "Target: 75%";

    totalClassesResult.textContent = "0";

    presentClassesResult.textContent = "0";

    absentClassesResult.textContent = "0";

    attendanceStatus.textContent =
        "Add Classes";

    attendanceStatus.classList.remove(
        "good",
        "low"
    );

    targetMessage.textContent =
        "Enter your classes to see your attendance status.";


    localStorage.removeItem(
        "toolboxAttendance"
    );
}


/* =========================================
   DEFAULT SUBJECT
========================================= */

function createDefaultSubject() {

    const row =
        subjectsList.querySelector(".subject-row");

    if (!row) {

        const newRow =
            document.createElement("div");

        newRow.className = "subject-row";

        newRow.innerHTML = `
            <div class="subject-number">
                01
            </div>

            <div class="subject-name-field">

                <label>Subject</label>

                <input
                    type="text"
                    class="subject-name"
                    placeholder="e.g. Mathematics"
                >

            </div>

            <div class="attendance-input">

                <label>Total</label>

                <input
                    type="number"
                    class="total-classes"
                    min="0"
                    value="0"
                >

            </div>

            <div class="attendance-input">

                <label>Present</label>

                <input
                    type="number"
                    class="present-classes"
                    min="0"
                    value="0"
                >

            </div>

            <div class="subject-percentage">
                0%
            </div>

            <button
                type="button"
                class="remove-subject"
                title="Remove Subject"
            >
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        subjectsList.appendChild(newRow);

        attachRowEvents(newRow);
    }
}


/* =========================================
   SAVE DATA
========================================= */

function saveData() {

    const rows =
        subjectsList.querySelectorAll(".subject-row");


    const subjects = [];


    rows.forEach(row => {

        subjects.push({

            name:
                row.querySelector(".subject-name").value,

            total:
                row.querySelector(".total-classes").value,

            present:
                row.querySelector(".present-classes").value
        });
    });


    const data = {

        studentName:
            studentName.value,

        target:
            targetAttendance.value,

        subjects
    };


    localStorage.setItem(
        "toolboxAttendance",
        JSON.stringify(data)
    );
}


/* =========================================
   LOAD DATA
========================================= */

function loadData() {

    const saved =
        localStorage.getItem(
            "toolboxAttendance"
        );


    if (!saved) {

        createDefaultSubject();

        return;
    }


    try {

        const data =
            JSON.parse(saved);


        studentName.value =
            data.studentName || "";


        targetAttendance.value =
            data.target || 75;


        subjectsList.innerHTML = "";


        if (
            Array.isArray(data.subjects) &&
            data.subjects.length > 0
        ) {

            data.subjects.forEach(subject => {

                addSavedSubject(subject);

            });

        } else {

            createDefaultSubject();
        }


        calculateAttendance();

    } catch (error) {

        console.error(
            "Attendance data could not be loaded:",
            error
        );

        createDefaultSubject();
    }
}


/* =========================================
   ADD SAVED SUBJECT
========================================= */

function addSavedSubject(subject) {

    const subjectCount =
        subjectsList.querySelectorAll(".subject-row").length + 1;


    const row =
        document.createElement("div");


    row.className = "subject-row";


    row.innerHTML = `
        <div class="subject-number">
            ${String(subjectCount).padStart(2, "0")}
        </div>

        <div class="subject-name-field">

            <label>Subject</label>

            <input
                type="text"
                class="subject-name"
                placeholder="e.g. Mathematics"
                value="${escapeHTML(subject.name || "")}"
            >

        </div>

        <div class="attendance-input">

            <label>Total</label>

            <input
                type="number"
                class="total-classes"
                min="0"
                value="${Number(subject.total) || 0}"
            >

        </div>

        <div class="attendance-input">

            <label>Present</label>

            <input
                type="number"
                class="present-classes"
                min="0"
                value="${Number(subject.present) || 0}"
            >

        </div>

        <div class="subject-percentage">
            0%
        </div>

        <button
            type="button"
            class="remove-subject"
            title="Remove Subject"
        >
            <i class="fa-solid fa-trash"></i>
        </button>
    `;


    subjectsList.appendChild(row);

    attachRowEvents(row);

    updateSubjectPercentage(row);
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   SAVE NAME / TARGET ON CHANGE
========================================= */

studentName.addEventListener(
    "input",
    saveData
);


targetAttendance.addEventListener(
    "input",
    saveData
);


/* =========================================
   INITIALIZE
========================================= */

loadData();