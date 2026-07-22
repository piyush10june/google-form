// =====================================
// GOOGLE APPS SCRIPT URL
// =====================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyQUT1fvXzL4j56dc3BkZvBkubxG5Jv8WwFeO1u7SQCVmH_-AnjPGwT0xeQAABPd2fe/exec";

const submitBtn = document.getElementById("submitBtn");

if (submitBtn) {
    submitBtn.addEventListener("click", submitForm);
}

async function submitForm(e) {
    if (e) e.preventDefault();

    if (!validateQuizForm()) {
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Uploading files & processing...";

    try {
        const form = document.getElementById("quizForm");
        const formData = new FormData(form);

        // --------------------------------------------------
        // 1. COLLECT & UPLOAD PAGE 2 FILES INDIVIDUALLY
        // --------------------------------------------------
        const fileInputs = form.querySelectorAll('input[type="file"]');
        const page2UploadedFiles = {};

        for (const input of fileInputs) {
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                submitBtn.innerText = "Uploading " + file.name + "...";

                const uploadRes = await uploadSingleFile(file);

                if (!uploadRes.success) {
                    alert("Failed to upload " + file.name + ". Please try again.");
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Submit";
                    return;
                }

                page2UploadedFiles[input.name] = [uploadRes];
            }
        }

        // --------------------------------------------------
        // 2. RETRIEVE PAGE 1 DATA & FILES FROM LOCALSTORAGE
        // --------------------------------------------------
        const page1Data = JSON.parse(localStorage.getItem("astroFormData")) || {};
        const page1Files = JSON.parse(localStorage.getItem("page1UploadedFiles")) || {};

        // Combine Page 1 and Page 2 uploaded file objects
        const allUploadedFiles = { ...page1Files, ...page2UploadedFiles };

        // --------------------------------------------------
        // 3. BUILD FINAL PAYLOAD
        // --------------------------------------------------
        const payloadData = { ...page1Data };

        // Add form inputs from Page 2 to payload
        for (const [key, value] of formData.entries()) {
            if (!(value instanceof File)) {
                payloadData[key] = value;
            }
        }

        // Add Scores
        payloadData.airScore = document.getElementById("airScore")?.innerText || "";
        payloadData.fireScore = document.getElementById("fireScore")?.innerText || "";
        payloadData.earthScore = document.getElementById("earthScore")?.innerText || "";
        payloadData.spaceScore = document.getElementById("spaceScore")?.innerText || "";
        payloadData.waterScore = document.getElementById("waterScore")?.innerText || "";

        payloadData.ketuScore = document.getElementById("ketuScore")?.innerText || "";
        payloadData.venusScore = document.getElementById("venusScore")?.innerText || "";
        payloadData.sunScore = document.getElementById("sunScore")?.innerText || "";
        payloadData.moonScore = document.getElementById("moonScore")?.innerText || "";
        payloadData.marsScore = document.getElementById("marsScore")?.innerText || "";
        payloadData.rahuScore = document.getElementById("rahuScore")?.innerText || "";
        payloadData.jupiterScore = document.getElementById("jupiterScore")?.innerText || "";
        payloadData.saturnScore = document.getElementById("saturnScore")?.innerText || "";
        payloadData.mercuryScore = document.getElementById("mercuryScore")?.innerText || "";

        payloadData.sattavScore = document.getElementById("sattavScore")?.innerText || "";
        payloadData.rajasScore = document.getElementById("rajasScore")?.innerText || "";
        payloadData.tamasScore = document.getElementById("tamasScore")?.innerText || "";

        payloadData.airElementScore = document.getElementById("airElementScore")?.innerText || "";
        payloadData.fireElementScore = document.getElementById("fireElementScore")?.innerText || "";
        payloadData.waterElementScore = document.getElementById("waterElementScore")?.innerText || "";

        payloadData.prakritiAirTotal = document.getElementById("prakritiAirTotal")?.innerText || "";
        payloadData.prakritiFireTotal = document.getElementById("prakritiFireTotal")?.innerText || "";
        payloadData.prakritiWaterTotal = document.getElementById("prakritiWaterTotal")?.innerText || "";

        // Attach lightweight stringified file details
        payloadData.page1UploadedFiles = JSON.stringify(allUploadedFiles);

        submitBtn.innerText = "Generating PDF & Sending Email...";

        // --------------------------------------------------
        // 4. SEND URL-ENCODED FORM POST TO APPS SCRIPT
        // --------------------------------------------------
        const urlParams = new URLSearchParams();
        Object.keys(payloadData).forEach(key => {
            urlParams.append(key, payloadData[key]);
        });

        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: urlParams.toString()
        });

        alert("Form submitted successfully! Please check your email in a few minutes.");

        form.reset();
        localStorage.clear();

    } catch (err) {
        console.error(err);
        alert("Submission error: " + (err.message || err));
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";
    }
}

// Helper to convert single file to Base64
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Helper to upload single file to Apps Script
async function uploadSingleFile(file) {
    const urlParams = new URLSearchParams();
    urlParams.append("action", "uploadSingleFile");
    urlParams.append("fileName", file.name);
    urlParams.append("mimeType", file.type);
    urlParams.append("base64", await fileToBase64(file));

    const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlParams.toString()
    });

    return await response.json();
}

// =====================================
// FORM VALIDATION
// =====================================
function validateQuizForm() {
    const form = document.getElementById("quizForm");
    if (!form) return true;

    const requiredFields = form.querySelectorAll("[required]");

    for (const field of requiredFields) {
        if (field.type === "radio") {
            const group = document.querySelectorAll('input[name="' + field.name + '"]');
            let checked = false;
            group.forEach(r => { if (r.checked) checked = true; });
            if (!checked) {
                alert("Please answer: " + field.name);
                return false;
            }
        } else if (field.type === "file") {
            if (field.files.length === 0) {
                alert("Please upload: " + field.name);
                return false;
            }
        } else {
            if (field.value.trim() === "") {
                alert("Please fill: " + field.name);
                field.focus();
                return false;
            }
        }
    }
    return true;
}

// =====================================
// FILE SIZE CHECK
// =====================================
const MAX_FILE_SIZE = 20 * 1024 * 1024;

document.querySelectorAll('input[type="file"]').forEach(file => {
    file.addEventListener("change", function () {
        if (!this.files.length) return;
        if (this.files[0].size > MAX_FILE_SIZE) {
            alert("Maximum file size is 20 MB.");
            this.value = "";
            return;
        }
        showSelectedFile(this);
    });
});

function showSelectedFile(input) {
    let span = input.parentNode.querySelector(".selected-file");
    if (!span) {
        span = document.createElement("div");
        span.className = "selected-file";
        span.style.marginTop = "5px";
        span.style.fontWeight = "600";
        span.style.color = "#0d6efd";
        input.parentNode.appendChild(span);
    }
    if (input.files.length) {
        span.textContent = "Selected : " + input.files[0].name;
    } else {
        span.textContent = "";
    }
}

// =====================================
// SCORE CALCULATIONS
// =====================================
function updateScore() {
    const scores = { Air: 0, Fire: 0, Earth: 0, Space: 0, Water: 0 };
    for (let i = 1; i <= 25; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected) scores[selected.value]++;
    }
    if (document.getElementById("airScore")) document.getElementById("airScore").textContent = `${scores.Air} /25`;
    if (document.getElementById("fireScore")) document.getElementById("fireScore").textContent = `${scores.Fire} /25`;
    if (document.getElementById("earthScore")) document.getElementById("earthScore").textContent = `${scores.Earth} /25`;
    if (document.getElementById("spaceScore")) document.getElementById("spaceScore").textContent = `${scores.Space} /25`;
    if (document.getElementById("waterScore")) document.getElementById("waterScore").textContent = `${scores.Water} /25`;
}

function updatePlanetScore() {
    const scores = { Ketu: 0, Venus: 0, Sun: 0, Moon: 0, Mars: 0, Rahu: 0, Jupiter: 0, Saturn: 0, Mercury: 0 };
    for (let i = 1; i <= 13; i++) {
        const selected = document.querySelector(`input[name="p1_q${i}"]:checked`);
        if (selected) scores[selected.value]++;
    }
    if (document.getElementById("ketuScore")) document.getElementById("ketuScore").textContent = `${scores.Ketu} /13`;
    if (document.getElementById("venusScore")) document.getElementById("venusScore").textContent = `${scores.Venus} /13`;
    if (document.getElementById("sunScore")) document.getElementById("sunScore").textContent = `${scores.Sun} /13`;
    if (document.getElementById("moonScore")) document.getElementById("moonScore").textContent = `${scores.Moon} /13`;
    if (document.getElementById("marsScore")) document.getElementById("marsScore").textContent = `${scores.Mars} /13`;
    if (document.getElementById("rahuScore")) document.getElementById("rahuScore").textContent = `${scores.Rahu} /13`;
    if (document.getElementById("jupiterScore")) document.getElementById("jupiterScore").textContent = `${scores.Jupiter} /13`;
    if (document.getElementById("saturnScore")) document.getElementById("saturnScore").textContent = `${scores.Saturn} /13`;
    if (document.getElementById("mercuryScore")) document.getElementById("mercuryScore").textContent = `${scores.Mercury} /13`;
}

function updateGunaScore() {
    const scores = { Sattav: 0, Rajas: 0, Tamas: 0 };
    for (let i = 1; i <= 25; i++) {
        const selected = document.querySelector(`input[name="gu_q${i}"]:checked`);
        if (selected) scores[selected.value]++;
    }
    if (document.getElementById("sattavScore")) document.getElementById("sattavScore").textContent = `${scores.Sattav} /25`;
    if (document.getElementById("rajasScore")) document.getElementById("rajasScore").textContent = `${scores.Rajas} /25`;
    if (document.getElementById("tamasScore")) document.getElementById("tamasScore").textContent = `${scores.Tamas} /25`;
}

function updateDoshaQuizScore() {
    let air = 0, fire = 0, water = 0;
    for (let i = 1; i <= 30; i++) {
        const selected = document.querySelector(`input[name="eb_q${i}"]:checked`);
        if (!selected) continue;
        if (selected.value === "Air") air++;
        if (selected.value === "Fire") fire++;
        if (selected.value === "Water") water++;
    }
    if (document.getElementById("airElementScore")) document.getElementById("airElementScore").textContent = air + " /30";
    if (document.getElementById("fireElementScore")) document.getElementById("fireElementScore").textContent = fire + " /30";
    if (document.getElementById("waterElementScore")) document.getElementById("waterElementScore").textContent = water + " /30";
}

function updatePrakritiQuizScore() {
    let air = 0, fire = 0, water = 0;
    const fields = ["bodyWeight", "nose", "teeth", "nails", "skin", "taste"];
    fields.forEach(name => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (!selected) return;
        if (selected.value === "Air") air++;
        if (selected.value === "Fire") fire++;
        if (selected.value === "Water") water++;
    });
    if (document.getElementById("prakritiAirTotal")) document.getElementById("prakritiAirTotal").textContent = air;
    if (document.getElementById("prakritiFireTotal")) document.getElementById("prakritiFireTotal").textContent = fire;
    if (document.getElementById("prakritiWaterTotal")) document.getElementById("prakritiWaterTotal").textContent = water;
}

document.addEventListener("change", function (e) {
    if (e.target.type !== "radio") return;
    updateScore();
    updatePlanetScore();
    updateGunaScore();
    updateDoshaQuizScore();
    updatePrakritiQuizScore();
});

window.addEventListener("load", function () {
    updateScore();
    updatePlanetScore();
    updateGunaScore();
    updateDoshaQuizScore();
    updatePrakritiQuizScore();
});                    