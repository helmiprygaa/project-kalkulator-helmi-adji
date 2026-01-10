const display = document.getElementById("display");
const buttons = document.querySelectorAll(".calc-btn");
const historyBox = document.getElementById("history");
const historyToggle = document.getElementById("historyToggle");

/* ================= INPUT ================= */
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.innerText;

        if (value === "C") return clearDisplay();
        if (value === "⌫") return deleteLast();
        if (value === "=") return calculate();

        // KHUSUS TRIGONOMETRI
        if (["sin", "cos", "tan"].includes(value)) {
            append(value + "(");
            return;
        }

        append(value);
    });
});

/* ================= DISPLAY WOIIII ================= */
function append(value) {
    
    const allowedChars = /^[0-9+\-×÷().]*$/;

    
    if (["sin(", "cos(", "tan("].includes(value)) {
        display.innerText =
            display.innerText === "0" ? value : display.innerText + value;
        return;
    }

    
    if (!allowedChars.test(value)) return;

    display.innerText =
        display.innerText === "0" ? value : display.innerText + value;
}

function clearDisplay() {
    display.innerText = "0";
}

function deleteLast() {
    display.innerText = display.innerText.slice(0, -1) || "0";
}

/* ================= TRIGONOMETRI (DERAJAT) ================= */
function convertTrig(exp) {
    return exp
        .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1)*Math.PI/180)');
}
/* ================= KALKULATORRRRRRR ================= */
function calculate() {
    try {
        let original = display.innerText;

        let exp = original
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-");

        exp = convertTrig(exp);

        let result = eval(exp);

        addHistory(original, result);
        display.innerText = result;
    } catch {
        display.innerText = "Error";
    }
}

/* ================= HISTORY ================= */
function addHistory(exp, result) {
    const item = document.createElement("div");
    item.className = "history-item";

    const text = document.createElement("span");
    text.textContent = `${exp} = ${result}`;

    const del = document.createElement("button");
    del.className = "delete-history";
    del.textContent = "×";
    del.onclick = () => item.remove();

    item.appendChild(text);
    item.appendChild(del);
    historyBox.appendChild(item);
}

/* ================= TOGGLE HISTORY ================= */
historyToggle.addEventListener("click", () => {
    historyBox.classList.toggle("active");
});

/* ================= KEYBOARD SUPPORT ================= */
document.addEventListener("keydown", e => {

    // ANGKA
    if (!isNaN(e.key)) {
        append(e.key);
        return;
    }

    // OPERATOR
    if (["+", "-", "*", "/", ".", "(", ")"].includes(e.key)) {
        append(e.key);
        return;
    }

    // ENTER
    if (e.key === "Enter") {
        calculate();
        return;
    }

    // BACKSPACE
    if (e.key === "Backspace") {
        deleteLast();
        return;
    }

    // ESC
    if (e.key === "Escape") {
        clearDisplay();
        return;
    }

    // BLOKIR SEMUA HURUF
    if (/[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
    }
});