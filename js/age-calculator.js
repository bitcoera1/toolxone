function calculateAge(){
    const input = document.getElementById("birthDate").value;
    const resultBox = document.getElementById("ageResult");

    if(!input){
        resultBox.style.display = "block";
        resultBox.innerHTML = "Please select your date of birth.";
        return;
    }

    const birthDate = new Date(input);
    const today = new Date();

    if(birthDate > today){
        resultBox.style.display = "block";
        resultBox.innerHTML = "Date of birth cannot be in the future.";
        return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if(days < 0){
        months--;
        const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += previousMonth.getDate();
    }

    if(months < 0){
        years--;
        months += 12;
    }

    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if(nextBirthday < today){
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = nextBirthday - today;
    const daysToBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    resultBox.style.display = "block";
    resultBox.innerHTML =
        "🎉 Your Age:<br>" +
        years + " Years, " + months + " Months, " + days + " Days<br><br>" +
        "🎂 Days until next birthday: " + daysToBirthday + " days";
}

function resetAge(){
    document.getElementById("birthDate").value = "";

    const resultBox = document.getElementById("ageResult");
    resultBox.style.display = "none";
    resultBox.innerHTML = "";
}