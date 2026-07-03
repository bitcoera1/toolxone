/*
=========================================
TOOLXONE SMART CLOCK PRO
Version 2.2
=========================================
*/

function initializeClock() {

    const clock =
        document.getElementById("toolxoneClock");

    if (!clock) return;

    const day =
        document.getElementById("clockDay");

    const date =
        document.getElementById("clockDate");

    const location =
        document.getElementById("clockLocation");

    const zone =
        document.getElementById("clockZone");

    const utc =
        document.getElementById("clockUTC");

    function updateClock(){

        const now = new Date();

        clock.innerHTML =
            "🕒 " +
            now.toLocaleTimeString([],{
                weekday:"short",
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit"
            });

        day.innerHTML =
            "🕒 " +
            now.toLocaleDateString([],{
                weekday:"long"
            });

        date.innerHTML =
            "📅 " +
            now.toLocaleDateString();

        location.innerHTML =
            "📍 Faisalabad, Pakistan";

        zone.innerHTML =
            "🌎 Asia/Karachi";

        utc.innerHTML =
            "🕐 UTC +05:00";

    }

    updateClock();

    setInterval(updateClock,1000);

}