let expression = "";
let ans = 0;
let soundEnabled = false;
let justCalculated = false;

const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

function updateDisplay() {
    expressionDisplay.textContent = expression;
}

function playSound() {
    if (!soundEnabled) return;

    try {
        const audioContext =
            new (window.AudioContext || window.webkitAudioContext)();

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "square";
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.05;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {}
}

function appendValue(value) {
    if (justCalculated) {
        if ("0123456789.".includes(value)) {
            expression = "";
            resultDisplay.textContent = "0";
        } else if (["+", "-", "*", "/", "%"].includes(value)) {
            expression = String(ans);
        }

        justCalculated = false;
    }

    expression += value;
    updateDisplay();
    playSound();
}

function appendFunction(func) {
    if (justCalculated) {
        expression = "";
        resultDisplay.textContent = "0";
        justCalculated = false;
    }

    expression += func + "(";
    updateDisplay();
    playSound();
}

function clearAll() {
    expression = "";
    resultDisplay.textContent = "0";
    justCalculated = false;
    updateDisplay();
}

function clearResult() {
    resultDisplay.textContent = "0";
}

function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function useAns() {
    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    expression += ans;
    updateDisplay();
}

function insertPi() {
    appendValue("π");
}

function insertE() {
    appendValue("e");
}

function toggleSound() {
    soundEnabled = !soundEnabled;

    document.getElementById("status").textContent =
        soundEnabled ? "Sound ON" : "Sound OFF";
}

function preprocessExpression(expr) {
    expr = expr.replace(/π/g, Math.PI);
    expr = expr.replace(/\be\b/g, Math.E);

    expr = expr.replace(/(\d+(\.\d+)?)\^2/g, "($1**2)");
    expr = expr.replace(/\^/g, "**");

    expr = expr.replace(/√\(/g, "Math.sqrt(");

    expr = expr.replace(/sin\(([^()]*)\)/g,
        (_, x) => `Math.sin((${x})*Math.PI/180)`);

    expr = expr.replace(/cos\(([^()]*)\)/g,
        (_, x) => `Math.cos((${x})*Math.PI/180)`);

    expr = expr.replace(/tan\(([^()]*)\)/g,
        (_, x) => `Math.tan((${x})*Math.PI/180)`);

    expr = expr.replace(/log\(([^()]*)\)/g,
        (_, x) => `Math.log10(${x})`);

    expr = expr.replace(/ln\(([^()]*)\)/g,
        (_, x) => `Math.log(${x})`);

    return expr;
}

function calculate() {
    try {
        let processed = preprocessExpression(expression);
        let result = eval(processed);

        if (!isFinite(result)) {
            throw new Error();
        }

        result = Number(result.toFixed(12));

        ans = result;
        resultDisplay.textContent = result;
        expression = String(result);
        justCalculated = true;
        updateDisplay();
    } catch {
        resultDisplay.textContent = "Error";
    }
}

document.addEventListener("keydown", function(e) {
    const key = e.key;

    if ("0123456789".includes(key)) {
        appendValue(key);
    } else if (["+", "-", "*", "/", ".", "%", "(", ")"].includes(key)) {
        appendValue(key);
    } else if (key === "Enter") {
        e.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        backspace();
    } else if (key === "Delete") {
        clearAll();
    }
});

updateDisplay();