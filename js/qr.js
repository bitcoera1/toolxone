// ======================================
// TOOLXONE QR CODE GENERATOR PRO
// ======================================

let qrCode = null;
let lastQRText = "";

function changeQRType() {
    const type = document.getElementById("qrType").value;
    const inputs = document.getElementById("qrInputs");

    clearQR();

    if (type === "text") {
        inputs.innerHTML = `
            <label for="qrText">Enter Text or URL</label>
            <textarea id="qrText" placeholder="Example: https://example.com or any text"></textarea>
        `;
    }

    if (type === "email") {
        inputs.innerHTML = `
            <label for="emailAddress">Email Address</label>
            <input type="email" id="emailAddress" placeholder="Example: someone@example.com">

            <label for="emailSubject">Subject</label>
            <input type="text" id="emailSubject" placeholder="Example: Hello">

            <label for="emailBody">Message</label>
            <textarea id="emailBody" placeholder="Write your email message"></textarea>
        `;
    }

    if (type === "phone") {
        inputs.innerHTML = `
            <label for="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" placeholder="Example: +923001234567">
        `;
    }

    if (type === "sms") {
        inputs.innerHTML = `
            <label for="smsNumber">Phone Number</label>
            <input type="tel" id="smsNumber" placeholder="Example: +923001234567">

            <label for="smsMessage">SMS Message</label>
            <textarea id="smsMessage" placeholder="Write your SMS message"></textarea>
        `;
    }

    if (type === "wifi") {
        inputs.innerHTML = `
            <label for="wifiName">WiFi Name / SSID</label>
            <input type="text" id="wifiName" placeholder="Example: My WiFi">

            <label for="wifiPassword">WiFi Password</label>
            <input type="text" id="wifiPassword" placeholder="Example: password123">

            <label for="wifiSecurity">Security Type</label>
            <select id="wifiSecurity">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
            </select>
        `;
    }

    addEnterSupport();
}

function getQRContent() {
    const type = document.getElementById("qrType").value;

    if (type === "text") {
        return document.getElementById("qrText").value.trim();
    }

    if (type === "email") {
        const email = document.getElementById("emailAddress").value.trim();
        const subject = encodeURIComponent(document.getElementById("emailSubject").value.trim());
        const body = encodeURIComponent(document.getElementById("emailBody").value.trim());

        if (!email) return "";

        return `mailto:${email}?subject=${subject}&body=${body}`;
    }

    if (type === "phone") {
        const phone = document.getElementById("phoneNumber").value.trim();
        if (!phone) return "";
        return `tel:${phone}`;
    }

    if (type === "sms") {
        const number = document.getElementById("smsNumber").value.trim();
        const message = encodeURIComponent(document.getElementById("smsMessage").value.trim());

        if (!number) return "";

        return `sms:${number}?body=${message}`;
    }

    if (type === "wifi") {
        const ssid = document.getElementById("wifiName").value.trim();
        const password = document.getElementById("wifiPassword").value.trim();
        const security = document.getElementById("wifiSecurity").value;

        if (!ssid) return "";

        return `WIFI:T:${security};S:${ssid};P:${password};;`;
    }

    return "";
}

function generateQR() {
    const text = getQRContent();
    const preview = document.getElementById("qrPreview");
    const downloadBtn = document.getElementById("downloadBtn");

    if (text === "") {
        alert("Please fill the required field.");
        return;
    }

    preview.innerHTML = "";

    qrCode = new QRCode(preview, {
        text: text,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    lastQRText = text;
setTimeout(() => {
    downloadBtn.style.display = "block";
}, 300);
}

function clearQR() {
    const preview = document.getElementById("qrPreview");
    const downloadBtn = document.getElementById("downloadBtn");

    preview.innerHTML = "<p>QR Code will appear here</p>";
    downloadBtn.style.display = "none";
    lastQRText = "";
}

function downloadQR() {
    const preview = document.getElementById("qrPreview");
    const img = preview.querySelector("img");
    const canvas = preview.querySelector("canvas");

    let source = null;

    if (img && img.src) {
        source = img.src;
    } else if (canvas) {
        source = canvas.toDataURL("image/png");
    }

    if (!source) {
        alert("Please generate a QR code first.");
        return;
    }

    const link = document.createElement("a");
    link.href = source;
    link.download = "ToolXone-QR-Code.png";
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function addEnterSupport() {
    document.querySelectorAll("#qrInputs input, #qrInputs textarea").forEach(input => {
        input.addEventListener("keydown", function(e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                generateQR();
            }
        });
    });
}

addEnterSupport();