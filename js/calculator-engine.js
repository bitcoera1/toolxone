function renderCalculator(config) {

    document.querySelector(".calculator-title").textContent =
        `${config.icon} ${config.title}`;

    document.querySelector(".tool-subtitle").textContent =
        config.subtitle;

    renderForm("calculatorForm", config.fields);

}