/* =====================================================
   TOOLXONE AGE CALCULATOR
   Mobile-Friendly Date Selectors
   ===================================================== */


/* =====================================================
   1. INITIALIZE DATE SELECTORS
   ===================================================== */

function initializeDateSelectors() {
    const daySelect =
        document.getElementById(
            "birthDay"
        );

    const monthSelect =
        document.getElementById(
            "birthMonth"
        );

    const yearSelect =
        document.getElementById(
            "birthYear"
        );

    if (
        !daySelect ||
        !monthSelect ||
        !yearSelect
    ) {
        return;
    }

    const currentYear =
        new Date().getFullYear();

    /*
     * Populate years from the current year
     * back to 1900.
     */
    for (
        let year = currentYear;
        year >= 1900;
        year--
    ) {
        const option =
            document.createElement(
                "option"
            );

        option.value =
            String(year);

        option.textContent =
            String(year);

        yearSelect.appendChild(
            option
        );
    }

    /*
     * Refresh the number of available days
     * whenever month or year changes.
     */
    monthSelect.addEventListener(
        "change",
        updateDayOptions
    );

    yearSelect.addEventListener(
        "change",
        updateDayOptions
    );

    updateDayOptions();
}


/* =====================================================
   2. UPDATE VALID DAYS
   ===================================================== */

function updateDayOptions() {
    const daySelect =
        document.getElementById(
            "birthDay"
        );

    const monthSelect =
        document.getElementById(
            "birthMonth"
        );

    const yearSelect =
        document.getElementById(
            "birthYear"
        );

    if (
        !daySelect ||
        !monthSelect ||
        !yearSelect
    ) {
        return;
    }

    const previousDay =
        Number(
            daySelect.value
        );

    const month =
        Number(
            monthSelect.value
        );

    const selectedYear =
        Number(
            yearSelect.value
        );

    const fallbackYear =
        new Date().getFullYear();

    const daysInMonth =
        month
            ? new Date(
                selectedYear ||
                    fallbackYear,
                month,
                0
            ).getDate()
            : 31;

    daySelect.innerHTML =
        '<option value="">DD</option>';

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        const option =
            document.createElement(
                "option"
            );

        option.value =
            String(day);

        option.textContent =
            String(day);

        daySelect.appendChild(
            option
        );
    }

    if (
        previousDay > 0 &&
        previousDay <= daysInMonth
    ) {
        daySelect.value =
            String(previousDay);
    }
}


/* =====================================================
   3. CALCULATE AGE
   ===================================================== */

function calculateAge() {
    const day =
        Number(
            document.getElementById(
                "birthDay"
            ).value
        );

    const month =
        Number(
            document.getElementById(
                "birthMonth"
            ).value
        );

    const year =
        Number(
            document.getElementById(
                "birthYear"
            ).value
        );

    const resultBox =
        document.getElementById(
            "ageResult"
        );

    if (
        !day ||
        !month ||
        !year
    ) {
        showAgeMessage(
            "Please select your complete date of birth."
        );

        return;
    }

    /*
     * Use noon rather than midnight to avoid
     * daylight-saving and timezone edge cases.
     */
    const birthDate =
        new Date(
            year,
            month - 1,
            day,
            12
        );

    const now =
        new Date();

    const today =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            12
        );

    /*
     * Reject impossible dates such as
     * 31 February.
     */
    if (
        birthDate.getFullYear() !==
            year ||
        birthDate.getMonth() !==
            month - 1 ||
        birthDate.getDate() !==
            day
    ) {
        showAgeMessage(
            "Please select a valid date."
        );

        return;
    }

    if (
        birthDate > today
    ) {
        showAgeMessage(
            "Date of birth cannot be in the future."
        );

        return;
    }

    const age =
        calculateExactAge(
            birthDate,
            today
        );

    const daysToBirthday =
        calculateDaysToNextBirthday(
            birthDate,
            today
        );

    resultBox.style.display =
        "block";

    resultBox.innerHTML = `
        <strong>🎉 Your Age</strong>
        <br>
        ${age.years} Years,
        ${age.months} Months,
        ${age.days} Days
        <br><br>
        🎂 Days until next birthday:
        ${daysToBirthday}
        ${
            daysToBirthday === 1
                ? "day"
                : "days"
        }
    `;

    // Record successful calculation
ToolXoneStatisticsEvents.recordCalculation(
    "age-calculator"
);

}


/* =====================================================
   4. EXACT CALENDAR AGE
   ===================================================== */

function calculateExactAge(
    birthDate,
    today
) {
    let years =
        today.getFullYear() -
        birthDate.getFullYear();

    let anniversary =
        createSafeDate(
            birthDate.getFullYear() +
                years,
            birthDate.getMonth(),
            birthDate.getDate()
        );

    if (
        anniversary > today
    ) {
        years--;

        anniversary =
            createSafeDate(
                birthDate.getFullYear() +
                    years,
                birthDate.getMonth(),
                birthDate.getDate()
            );
    }

    let months = 0;
    let cursor =
        new Date(
            anniversary
        );

    while (months < 11) {
        const nextMonth =
            addCalendarMonths(
                cursor,
                1
            );

        if (
            nextMonth > today
        ) {
            break;
        }

        cursor =
            nextMonth;

        months++;
    }

    const millisecondsPerDay =
        1000 * 60 * 60 * 24;

    const days =
        Math.round(
            (
                today -
                cursor
            ) /
            millisecondsPerDay
        );

    return {
        years,
        months,
        days
    };
}


/* =====================================================
   5. NEXT BIRTHDAY
   ===================================================== */

function calculateDaysToNextBirthday(
    birthDate,
    today
) {
    let nextBirthday =
        createSafeDate(
            today.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate()
        );

    if (
        nextBirthday < today
    ) {
        nextBirthday =
            createSafeDate(
                today.getFullYear() +
                    1,
                birthDate.getMonth(),
                birthDate.getDate()
            );
    }

    const millisecondsPerDay =
        1000 * 60 * 60 * 24;

    return Math.round(
        (
            nextBirthday -
            today
        ) /
        millisecondsPerDay
    );
}


/* =====================================================
   6. DATE HELPERS
   ===================================================== */

function createSafeDate(
    year,
    monthIndex,
    day
) {
    /*
     * For 29 February in a non-leap year,
     * use 28 February as the anniversary.
     */
    const lastDayOfMonth =
        new Date(
            year,
            monthIndex + 1,
            0
        ).getDate();

    return new Date(
        year,
        monthIndex,
        Math.min(
            day,
            lastDayOfMonth
        ),
        12
    );
}


function addCalendarMonths(
    date,
    amount
) {
    const targetYear =
        date.getFullYear();

    const targetMonth =
        date.getMonth() +
        amount;

    const originalDay =
        date.getDate();

    const lastDay =
        new Date(
            targetYear,
            targetMonth + 1,
            0
        ).getDate();

    return new Date(
        targetYear,
        targetMonth,
        Math.min(
            originalDay,
            lastDay
        ),
        12
    );
}


/* =====================================================
   7. RESULT MESSAGE
   ===================================================== */

function showAgeMessage(
    message
) {
    const resultBox =
        document.getElementById(
            "ageResult"
        );

    resultBox.style.display =
        "block";

    resultBox.textContent =
        message;
}


/* =====================================================
   8. RESET
   ===================================================== */

function resetAge() {
    document.getElementById(
        "birthDay"
    ).selectedIndex = 0;

    document.getElementById(
        "birthMonth"
    ).selectedIndex = 0;

    document.getElementById(
        "birthYear"
    ).selectedIndex = 0;

    updateDayOptions();

    const resultBox =
        document.getElementById(
            "ageResult"
        );

    resultBox.style.display =
        "none";

    resultBox.innerHTML =
        "";
}


/* =====================================================
   9. STARTUP
   ===================================================== */

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeDateSelectors
    );
} else {
    initializeDateSelectors();
}