// ===============================
// ToolXone Shared JavaScript
// Clock + Theme
// ===============================

// ---------- LIVE CLOCK ----------

function updateClock() {

    const clock = document.getElementById("liveClock");

    if (!clock) return;

    const now = new Date();

    clock.textContent =
        "🕘 " +
        now.toLocaleDateString("en-US", {
            weekday: "short"
        }) +
        " " +
        now.toLocaleTimeString();

}

updateClock();

setInterval(updateClock,1000);


// ---------- DARK / LIGHT MODE ----------

function setupThemeToggle(){

    const themeToggle =
        document.getElementById("themeToggle");

    if(!themeToggle) return;

    if(localStorage.getItem("toolxoneTheme")==="dark"){

        document.body.classList.add("dark-mode");

        themeToggle.textContent="☀️ Light";

    }

    else{

        document.body.classList.remove("dark-mode");

        themeToggle.textContent="🌙 Dark";

    }

    themeToggle.addEventListener("click",()=>{

        document.body.classList.toggle("dark-mode");

        if(document.body.classList.contains("dark-mode")){

            localStorage.setItem("toolxoneTheme","dark");

            themeToggle.textContent="☀️ Light";

        }

        else{

            localStorage.setItem("toolxoneTheme","light");

            themeToggle.textContent="🌙 Dark";

        }

    });

}

setupThemeToggle();