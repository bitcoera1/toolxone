function renderForm(containerId, fields) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = "";

    fields.forEach(field => {
        html += `<div class="form-group">
            <label for="${field.id}">${field.label}</label>`;

        if (field.type === "select") {
            html += `<select id="${field.id}">`;

            field.options.forEach(option => {
                html += `<option value="${option.value}">${option.label}</option>`;
            });

            html += `</select>`;
        } else {
            html += `<input
                type="${field.type}"
                id="${field.id}"
                placeholder="${field.placeholder}"
            >`;
        }

        html += `</div>`;
    });

    container.innerHTML = html;
}