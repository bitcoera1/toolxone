/* ToolXone GPA / CGPA Calculator */
(function (window, document) {
    "use strict";

    function weightedAverage(rows) {
        let qualityPoints = 0;
        let credits = 0;
        rows.forEach(row => {
            qualityPoints += row.gradePoints * row.credits;
            credits += row.credits;
        });
        return credits ? { average: qualityPoints / credits, credits } : null;
    }

    function combinePrevious(previousGpa, previousCredits, currentGpa, currentCredits) {
        const credits = previousCredits + currentCredits;
        return credits ? {
            average: (previousGpa * previousCredits + currentGpa * currentCredits) / credits,
            credits
        } : null;
    }

    window.ToolXoneGpaMath = Object.freeze({ weightedAverage, combinePrevious });
    if (!document.getElementById("quickCourses")) return;

    const $ = id => document.getElementById(id);
    const courseModes = document.querySelectorAll('input[name="courseMode"]');
    const cgpaModes = document.querySelectorAll('input[name="cgpaMode"]');
    let lastSemesterResult = null;

    function makeCell(row, child) {
        const cell = document.createElement("td");
        cell.appendChild(child);
        row.appendChild(cell);
        return cell;
    }

    function makeInput(label, type, attributes = {}) {
        const input = document.createElement("input");
        input.type = type;
        input.setAttribute("aria-label", label);
        Object.entries(attributes).forEach(([name, value]) => input.setAttribute(name, value));
        return input;
    }

    function makeRemoveButton(label) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "gpa-remove-button";
        button.textContent = "×";
        button.setAttribute("aria-label", label);
        return button;
    }

    function appendCourse(tbody, mode) {
        const number = tbody.children.length + 1;
        const row = document.createElement("tr");
        row.dataset.course = "true";
        const name = makeInput(`Course ${number} name (optional)`, "text", { placeholder: `Course ${number}`, maxlength: "80" });
        makeCell(row, name);

        if (mode === "quick") {
            const points = makeInput(`Course ${number} grade points`, "number", { min: "0", step: "any", inputmode: "decimal" });
            points.dataset.gradePoints = "true";
            makeCell(row, points);
        } else {
            const grade = document.createElement("select");
            grade.setAttribute("aria-label", `Course ${number} letter grade`);
            grade.dataset.letterGrade = "true";
            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "Select grade";
            grade.appendChild(placeholder);
            makeCell(row, grade);
        }

        const credits = makeInput(`Course ${number} credit hours`, "number", { min: "0.01", step: "any", inputmode: "decimal" });
        credits.dataset.credits = "true";
        makeCell(row, credits);
        const remove = makeRemoveButton(`Remove course ${number}`);
        remove.dataset.removeRow = "true";
        makeCell(row, remove);
        tbody.appendChild(row);
        renumberCourseRows(tbody, mode);
        if (mode === "custom") updateGradeOptions();
        updateEmptyStates();
        return row;
    }

    function appendScaleRow() {
        const tbody = $("gradeScale");
        const row = document.createElement("tr");
        const letter = makeInput("Letter grade", "text", { maxlength: "12", autocomplete: "off" });
        letter.dataset.scaleLetter = "true";
        makeCell(row, letter);
        const points = makeInput("Grade points for this letter grade", "number", { min: "0", step: "any", inputmode: "decimal" });
        points.dataset.scalePoints = "true";
        makeCell(row, points);
        const remove = makeRemoveButton("Remove grade from scale");
        remove.dataset.removeRow = "true";
        makeCell(row, remove);
        tbody.appendChild(row);
        renumberScaleRows();
        updateEmptyStates();
        return row;
    }

    function appendSemesterRow() {
        const tbody = $("semesterRows");
        const row = document.createElement("tr");
        const label = document.createElement("th");
        label.scope = "row";
        label.textContent = `Semester ${tbody.children.length + 1}`;
        row.appendChild(label);
        const gpa = makeInput(`Semester ${tbody.children.length + 1} GPA`, "number", { min: "0", step: "any", inputmode: "decimal" });
        gpa.dataset.semesterGpa = "true";
        makeCell(row, gpa);
        const credits = makeInput(`Semester ${tbody.children.length + 1} credit hours`, "number", { min: "0.01", step: "any", inputmode: "decimal" });
        credits.dataset.semesterCredits = "true";
        makeCell(row, credits);
        const remove = makeRemoveButton(`Remove semester ${tbody.children.length + 1}`);
        remove.dataset.removeRow = "true";
        makeCell(row, remove);
        tbody.appendChild(row);
        renumberSemesterRows();
        updateEmptyStates();
    }

    function renumberCourseRows(tbody, mode) {
        [...tbody.querySelectorAll("tr[data-course]")].forEach((row, index) => {
            const number = index + 1;
            row.querySelector('input[type="text"]').setAttribute("aria-label", `Course ${number} name (optional)`);
            const grade = row.querySelector("[data-grade-points], [data-letter-grade]");
            grade?.setAttribute("aria-label", mode === "quick" ? `Course ${number} grade points` : `Course ${number} letter grade`);
            row.querySelector("[data-credits]").setAttribute("aria-label", `Course ${number} credit hours`);
            row.querySelector("[data-remove-row]").setAttribute("aria-label", `Remove course ${number}`);
        });
    }

    function renumberScaleRows() {
        [...$("gradeScale").querySelectorAll("tr")].forEach((row, index) => {
            row.querySelector("[data-scale-letter]").setAttribute("aria-label", `Letter grade ${index + 1}`);
            row.querySelector("[data-scale-points]").setAttribute("aria-label", `Grade points for letter grade ${index + 1}`);
        });
    }

    function renumberSemesterRows() {
        [...$("semesterRows").querySelectorAll("tr")].forEach((row, index) => {
            const number = index + 1;
            row.querySelector("th").textContent = `Semester ${number}`;
            row.querySelector("[data-semester-gpa]").setAttribute("aria-label", `Semester ${number} GPA`);
            row.querySelector("[data-semester-credits]").setAttribute("aria-label", `Semester ${number} credit hours`);
            row.querySelector("[data-remove-row]").setAttribute("aria-label", `Remove semester ${number}`);
        });
    }

    function updateEmptyStates() {
        $("quickCourseEmpty").hidden = $("quickCourses").children.length > 0;
        $("customCourseEmpty").hidden = $("customCourses").children.length > 0;
        $("gradeScaleEmpty").hidden = $("gradeScale").children.length > 0;
        $("semesterEmpty").hidden = $("semesterRows").children.length > 0;
    }

    function updateGradeOptions() {
        const scale = [...$("gradeScale").querySelectorAll("tr")].map(row => ({
            letter: row.querySelector("[data-scale-letter]").value.trim(),
            rawPoints: row.querySelector("[data-scale-points]").value
        })).filter(item => {
            if (!item.letter || item.rawPoints === "") return false;
            const points = Number(item.rawPoints);
            return Number.isFinite(points) && points >= 0;
        }).map(item => ({ letter: item.letter, points: Number(item.rawPoints) }));

        $("customCourses").querySelectorAll("select[data-letter-grade]").forEach(select => {
            const previous = select.value;
            select.replaceChildren();
            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = scale.length ? "Select grade" : "Define a grade scale first";
            select.appendChild(placeholder);
            scale.forEach(item => {
                const option = document.createElement("option");
                option.value = item.letter;
                option.textContent = item.letter;
                select.appendChild(option);
            });
            select.value = scale.some(item => item.letter === previous) ? previous : "";
        });
    }

    function readScale() {
        const rows = [...$("gradeScale").querySelectorAll("tr")];
        const scale = new Map();
        for (const row of rows) {
            const letter = row.querySelector("[data-scale-letter]").value.trim();
            const rawPoints = row.querySelector("[data-scale-points]").value;
            if (!letter || rawPoints === "") continue;
            const points = Number(rawPoints);
            if (!Number.isFinite(points) || points < 0) {
                throw new Error("Enter a valid non-negative grade-point value for every completed grading-scale row.");
            }
            const key = letter.toLocaleLowerCase();
            if (scale.has(key)) throw new Error(`The grade “${letter}” appears more than once in your scale.`);
            scale.set(key, { letter, points });
        }
        if (!scale.size) throw new Error("Add at least one letter grade and grade-point value to your grading scale.");
        return scale;
    }

    function readCourseRows(mode) {
        const tbody = $(mode === "quick" ? "quickCourses" : "customCourses");
        const rows = [...tbody.querySelectorAll("tr[data-course]")];
        if (!rows.length) throw new Error("Add at least one course before calculating GPA.");
        const scale = mode === "custom" ? readScale() : null;
        return rows.map((row, index) => {
            const label = row.querySelector('input[type="text"]').value.trim() || `Course ${index + 1}`;
            const rawCredits = row.querySelector("[data-credits]").value;
            const credits = Number(rawCredits);
            if (rawCredits === "" || !Number.isFinite(credits) || credits <= 0) {
                throw new Error(`${label}: enter credit hours greater than zero.`);
            }
            let gradePoints;
            if (mode === "quick") {
                const rawPoints = row.querySelector("[data-grade-points]").value;
                gradePoints = Number(rawPoints);
                if (rawPoints === "" || !Number.isFinite(gradePoints) || gradePoints < 0) {
                    throw new Error(`${label}: enter a valid non-negative grade-point value.`);
                }
            } else {
                const letter = row.querySelector("[data-letter-grade]").value;
                const grade = scale.get(letter.toLocaleLowerCase());
                if (!grade) throw new Error(`${label}: choose a letter grade from your grading scale.`);
                gradePoints = grade.points;
            }
            return { gradePoints, credits };
        });
    }

    function calculateSemester() {
        const mode = document.querySelector('input[name="courseMode"]:checked').value;
        const courses = readCourseRows(mode);
        const result = weightedAverage(courses);
        if (!result) throw new Error("Add course credit hours before calculating GPA.");
        lastSemesterResult = { ...result, courseCount: courses.length };
        $("semesterGpaValue").textContent = result.average.toFixed(3);
        $("semesterCredits").textContent = formatNumber(result.credits);
        $("semesterCourseCount").textContent = String(courses.length);
        $("semesterResult").hidden = false;
        $("gpaMessage").textContent = "";
        return lastSemesterResult;
    }

    function calculateCgpa() {
        const mode = document.querySelector('input[name="cgpaMode"]:checked').value;
        let result;
        let semesterCount;
        if (mode === "previous") {
            const semester = calculateSemester();
            const rawPrevious = $("previousCgpa").value;
            const rawCredits = $("completedCredits").value;
            if ((rawPrevious === "") !== (rawCredits === "")) {
                throw new Error("Enter both your previous CGPA and completed credit hours, or leave both blank for your first semester.");
            }
            if (rawPrevious === "") {
                result = semester;
                semesterCount = 1;
            } else {
                const previous = Number(rawPrevious);
                const credits = Number(rawCredits);
                if (!Number.isFinite(previous) || previous < 0) throw new Error("Enter a valid non-negative previous CGPA.");
                if (!Number.isFinite(credits) || credits <= 0) throw new Error("Previously completed credit hours must be greater than zero.");
                result = combinePrevious(previous, credits, semester.average, semester.credits);
                semesterCount = "Previous CGPA + current semester";
            }
        } else {
            const rows = [...$("semesterRows").querySelectorAll("tr")];
            if (!rows.length) throw new Error("Add at least one semester before calculating CGPA.");
            const entries = rows.map((row, index) => {
                const rawGpa = row.querySelector("[data-semester-gpa]").value;
                const rawCredits = row.querySelector("[data-semester-credits]").value;
                const gpa = Number(rawGpa);
                const credits = Number(rawCredits);
                if (rawGpa === "" || !Number.isFinite(gpa) || gpa < 0) throw new Error(`Semester ${index + 1}: enter a valid non-negative GPA.`);
                if (rawCredits === "" || !Number.isFinite(credits) || credits <= 0) throw new Error(`Semester ${index + 1}: enter credit hours greater than zero.`);
                return { gradePoints: gpa, credits };
            });
            result = weightedAverage(entries);
            semesterCount = entries.length;
        }
        $("cgpaValue").textContent = result.average.toFixed(3);
        $("cgpaCredits").textContent = formatNumber(result.credits);
        $("cgpaSemesters").textContent = String(semesterCount);
        $("cgpaResult").hidden = false;
        $("cgpaMessage").textContent = "";
        if (window.ToolXoneStatisticsEvents?.recordCalculation) window.ToolXoneStatisticsEvents.recordCalculation("gpa-cgpa-calculator");
    }

    function formatNumber(value) {
        return Number(value.toFixed(3)).toLocaleString(undefined, { maximumFractionDigits: 3 });
    }

    function reportError(containerId, error) {
        $(containerId).textContent = error.message;
        if (containerId === "gpaMessage") $("semesterResult").hidden = true;
        else $("cgpaResult").hidden = true;
    }

    function resetSemester() {
        $("quickCourses").replaceChildren();
        $("customCourses").replaceChildren();
        appendCourse($("quickCourses"), "quick");
        appendCourse($("customCourses"), "custom");
        $("semesterResult").hidden = true;
        $("gpaMessage").textContent = "";
        lastSemesterResult = null;
        updateGradeOptions();
    }

    function resetCgpa() {
        $("previousCgpa").value = "";
        $("completedCredits").value = "";
        $("semesterRows").replaceChildren();
        appendSemesterRow();
        $("cgpaResult").hidden = true;
        $("cgpaMessage").textContent = "";
    }

    $("addQuickCourse").addEventListener("click", () => appendCourse($("quickCourses"), "quick"));
    $("addCustomCourse").addEventListener("click", () => appendCourse($("customCourses"), "custom"));
    $("addScaleGrade").addEventListener("click", () => { appendScaleRow(); updateGradeOptions(); });
    $("addSemester").addEventListener("click", appendSemesterRow);
    $("calculateSemester").addEventListener("click", () => {
        try { calculateSemester(); } catch (error) { reportError("gpaMessage", error); }
    });
    $("calculateCgpa").addEventListener("click", () => {
        try { calculateCgpa(); } catch (error) { reportError("cgpaMessage", error); }
    });
    $("resetCalculator").addEventListener("click", resetSemester);
    $("resetCgpa").addEventListener("click", resetCgpa);
    document.addEventListener("click", event => {
        const button = event.target.closest("button[data-remove-row]");
        if (button) {
            const row = button.closest("tr");
            const tbody = row.parentElement;
            row.remove();
            if (tbody.id === "quickCourses") renumberCourseRows(tbody, "quick");
            if (tbody.id === "customCourses") renumberCourseRows(tbody, "custom");
            if (tbody.id === "gradeScale") {
                renumberScaleRows();
                updateGradeOptions();
            }
            if (tbody.id === "semesterRows") renumberSemesterRows();
            updateEmptyStates();
        }
    });
    $("gradeScale").addEventListener("input", updateGradeOptions);
    courseModes.forEach(input => input.addEventListener("change", () => {
        const custom = input.value === "custom" && input.checked;
        $("quickMode").hidden = custom;
        $("customMode").hidden = !custom;
        lastSemesterResult = null;
        $("semesterResult").hidden = true;
        $("gpaMessage").textContent = "";
    }));
    cgpaModes.forEach(input => input.addEventListener("change", () => {
        const semesters = input.value === "semesters" && input.checked;
        $("previousCgpaMode").hidden = semesters;
        $("semestersMode").hidden = !semesters;
        $("cgpaResult").hidden = true;
        $("cgpaMessage").textContent = "";
    }));

    appendScaleRow();
    resetSemester();
    resetCgpa();
    window.ToolXoneHeroRenderer?.render("gpa-cgpa-calculator");
})(window, document);
