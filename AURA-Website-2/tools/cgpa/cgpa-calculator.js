/* =========================================
   CGPA CALCULATOR
========================================= */

const subjectsContainer = document.getElementById("subjects-container");
const addSubjectButton = document.getElementById("add-subject");
const calculateCgpaButton = document.getElementById("calculate-cgpa");

const cgpaResult = document.getElementById("cgpa-result");
const resultMessage = document.getElementById("result-message");


/* =========================================
   ADD SUBJECT
========================================= */

addSubjectButton.addEventListener("click", function () {

    const subjectRow = document.createElement("div");

    subjectRow.className = "subject-row";

    subjectRow.innerHTML = `
        <div class="input-group">
            <label>Subject Name</label>
            <input
                type="text"
                class="subject-name"
                placeholder="e.g. Physics"
            >
        </div>

        <div class="input-group">
            <label>Credit</label>
            <input
                type="number"
                class="subject-credit"
                placeholder="4"
                min="0"
                step="0.5"
            >
        </div>

        <div class="input-group">
            <label>Grade Point</label>
            <select class="subject-grade">
                <option value="">Select Grade</option>
                <option value="10">A+</option>
                <option value="9">A</option>
                <option value="8">B+</option>
                <option value="7">B</option>
                <option value="6">C+</option>
                <option value="5">C</option>
                <option value="4">D</option>
                <option value="0">F</option>
            </select>
        </div>

        <button
            type="button"
            class="remove-subject"
            title="Remove Subject"
        >
            ×
        </button>
    `;

    subjectsContainer.appendChild(subjectRow);

});


/* =========================================
   REMOVE SUBJECT
========================================= */

subjectsContainer.addEventListener("click", function (event) {

    if (event.target.classList.contains("remove-subject")) {

        const allRows = document.querySelectorAll(".subject-row");

        if (allRows.length > 1) {
            event.target.closest(".subject-row").remove();
        } else {
            alert("At least one subject is required.");
        }

    }

});


/* =========================================
   CALCULATE CGPA
========================================= */

calculateCgpaButton.addEventListener("click", function () {

    const subjectRows = document.querySelectorAll(".subject-row");

    let totalCredits = 0;
    let totalGradePoints = 0;

    for (let row of subjectRows) {

        const creditInput = row.querySelector(".subject-credit");
        const gradeInput = row.querySelector(".subject-grade");

        const credit = parseFloat(creditInput.value);
        const gradePoint = parseFloat(gradeInput.value);

        if (
            creditInput.value.trim() === "" ||
            gradeInput.value === ""
        ) {
            alert("Please fill credit and grade point for every subject.");
            return;
        }

        if (credit <= 0 || isNaN(credit)) {
            alert("Please enter a valid credit.");
            return;
        }

        if (isNaN(gradePoint)) {
            alert("Please select a valid grade.");
            return;
        }

        totalCredits += credit;
        totalGradePoints += credit * gradePoint;

    }

    if (totalCredits === 0) {
        alert("Please enter subject credits.");
        return;
    }

    const cgpa = totalGradePoints / totalCredits;

    cgpaResult.textContent = cgpa.toFixed(2);

    if (cgpa >= 9) {
        resultMessage.textContent = "Excellent performance! Keep it up.";
    } else if (cgpa >= 8) {
        resultMessage.textContent = "Great performance. You are doing well.";
    } else if (cgpa >= 7) {
        resultMessage.textContent = "Good performance. Keep improving.";
    } else if (cgpa >= 6) {
        resultMessage.textContent = "You can improve with consistent effort.";
    } else {
        resultMessage.textContent = "Keep working hard and stay consistent.";
    }

});


/* =========================================
   OVERALL CGPA CALCULATOR
========================================= */

const semesterContainer = document.getElementById("semester-container");
const addSemesterButton = document.getElementById("add-semester");
const calculateOverallButton = document.getElementById("calculate-overall");

const overallResult = document.getElementById("overall-result");
const overallMessage = document.getElementById("overall-message");


let semesterCount = 1;


/* =========================================
   ADD SEMESTER
========================================= */

addSemesterButton.addEventListener("click", function () {

    semesterCount++;

    const semesterRow = document.createElement("div");

    semesterRow.className = "semester-row";

    semesterRow.innerHTML = `
        <div class="input-group">
            <label>Semester</label>
            <input
                type="text"
                class="semester-name"
                value="Semester ${semesterCount}"
                readonly
            >
        </div>

        <div class="input-group">
            <label>CGPA</label>
            <input
                type="number"
                class="semester-cgpa"
                placeholder="e.g. 8.5"
                min="0"
                max="10"
                step="0.01"
            >
        </div>

        <button
            type="button"
            class="remove-semester"
            title="Remove Semester"
        >
            ×
        </button>
    `;

    semesterContainer.appendChild(semesterRow);

});


/* =========================================
   REMOVE SEMESTER
========================================= */

semesterContainer.addEventListener("click", function (event) {

    if (event.target.classList.contains("remove-semester")) {

        const allSemesters = document.querySelectorAll(".semester-row");

        if (allSemesters.length > 1) {
            event.target.closest(".semester-row").remove();
        } else {
            alert("At least one semester is required.");
        }

    }

});


/* =========================================
   CALCULATE OVERALL CGPA
========================================= */

calculateOverallButton.addEventListener("click", function () {

    const semesterRows = document.querySelectorAll(".semester-row");

    let totalCgpa = 0;
    let validSemesters = 0;

    for (let row of semesterRows) {

        const cgpaInput = row.querySelector(".semester-cgpa");
        const cgpaValue = parseFloat(cgpaInput.value);

        if (cgpaInput.value.trim() === "") {
            alert("Please enter CGPA for every semester.");
            return;
        }

        if (
            isNaN(cgpaValue) ||
            cgpaValue < 0 ||
            cgpaValue > 10
        ) {
            alert("CGPA must be between 0 and 10.");
            return;
        }

        totalCgpa += cgpaValue;
        validSemesters++;

    }

    if (validSemesters === 0) {
        alert("Please enter at least one semester CGPA.");
        return;
    }

    const overallCgpa = totalCgpa / validSemesters;

    overallResult.textContent = overallCgpa.toFixed(2);

    if (overallCgpa >= 9) {
        overallMessage.textContent = "Outstanding overall CGPA!";
    } else if (overallCgpa >= 8) {
        overallMessage.textContent = "Very good overall performance.";
    } else if (overallCgpa >= 7) {
        overallMessage.textContent = "Good overall performance.";
    } else if (overallCgpa >= 6) {
        overallMessage.textContent = "Keep working to improve your CGPA.";
    } else {
        overallMessage.textContent = "Stay consistent and keep learning.";
    }

});