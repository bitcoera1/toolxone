function renderResults(containerId, results, message = "") {

    const container = document.getElementById(containerId);

    if (!container) return;

    let html = "";

    results.forEach(item => {

        html += `
            <div class="result-row">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
            </div>
        `;

    });

    if (message !== "") {

        html += `
            <div class="result-message">
                ${message}
            </div>
        `;

    }

    container.innerHTML = html;

}