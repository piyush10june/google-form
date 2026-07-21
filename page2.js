// =====================================
// GOOGLE APPS SCRIPT URL
// =====================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyQUT1fvXzL4j56dc3BkZvBkubxG5Jv8WwFeO1u7SQCVmH_-AnjPGwT0xeQAABPd2fe/exec";

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", submitForm);

async function submitForm(e) {

    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Uploading...";

    try {

        const form = document.getElementById("quizForm");

        const formData = new FormData(form);

        //--------------------------------------------------
        // PAGE 1 DATA
        //-------------------------------------------------

        const page1Data =
            JSON.parse(localStorage.getItem("astroFormData")) || {};

        Object.keys(page1Data).forEach(key => {

            formData.append(key, page1Data[key]);

        });

        //--------------------------------------------------
        // FIVE ELEMENT SCORE
        //--------------------------------------------------

        formData.append(
            "airScore",
            document.getElementById("airScore").innerText
        );

        formData.append(
            "fireScore",
            document.getElementById("fireScore").innerText
        );

        formData.append(
            "earthScore",
            document.getElementById("earthScore").innerText
        );

        formData.append(
            "spaceScore",
            document.getElementById("spaceScore").innerText
        );

        formData.append(
            "waterScore",
            document.getElementById("waterScore").innerText
        );

        //--------------------------------------------------
        // PLANET SCORE
        //--------------------------------------------------

        formData.append("ketuScore",
            document.getElementById("ketuScore").innerText);

        formData.append("venusScore",
            document.getElementById("venusScore").innerText);

        formData.append("sunScore",
            document.getElementById("sunScore").innerText);

        formData.append("moonScore",
            document.getElementById("moonScore").innerText);

        formData.append("marsScore",
            document.getElementById("marsScore").innerText);

        formData.append("rahuScore",
            document.getElementById("rahuScore").innerText);

        formData.append("jupiterScore",
            document.getElementById("jupiterScore").innerText);

        formData.append("saturnScore",
            document.getElementById("saturnScore").innerText);

        formData.append("mercuryScore",
            document.getElementById("mercuryScore").innerText);

        //--------------------------------------------------
        // GUNA SCORE
        //--------------------------------------------------

        formData.append(
            "sattavScore",
            document.getElementById("sattavScore").innerText
        );

        formData.append(
            "rajasScore",
            document.getElementById("rajasScore").innerText
        );

        formData.append(
            "tamasScore",
            document.getElementById("tamasScore").innerText
        );

        //--------------------------------------------------
        // DOSHA SCORE
        //--------------------------------------------------

        formData.append(
            "airElementScore",
            document.getElementById("airElementScore").innerText
        );

        formData.append(
            "fireElementScore",
            document.getElementById("fireElementScore").innerText
        );

        formData.append(
            "waterElementScore",
            document.getElementById("waterElementScore").innerText
        );

        //--------------------------------------------------
        // PRAKRITI SCORE
        //--------------------------------------------------

        formData.append(
            "prakritiAirTotal",
            document.getElementById("prakritiAirTotal").innerText
        );

        formData.append(
            "prakritiFireTotal",
            document.getElementById("prakritiFireTotal").innerText
        );

        formData.append(
            "prakritiWaterTotal",
            document.getElementById("prakritiWaterTotal").innerText
        );

        const fileInputs = form.querySelectorAll('input[type="file"]');

        for (const input of fileInputs) {

            if (input.files.length) {

                const file = input.files[0];

                const base64 = await fileToBase64(file);

                formData.append(input.name + "_base64", base64);

                formData.append(input.name + "_filename", file.name);

                formData.append(input.name + "_mime", file.type);

            }

        }

        //--------------------------------------------------
        // SEND
        //--------------------------------------------------

        const response = await fetch(SCRIPT_URL, {

            method: "POST",

            body: formData

        });

        const result = await response.json();

        if (result.success) {

            alert("Submitted Successfully");

            if (result.pdf) {

                window.open(result.pdf, "_blank");

            }

            form.reset();

            localStorage.removeItem("astroFormData");

            localStorage.removeItem("page2Draft");

        } else {

            alert(result.error);

        }

    }

    catch (err) {

        console.error(err);

        alert(err.message || err);

    }

    finally {

        submitBtn.disabled = false;

        submitBtn.innerText = "Submit";

    }

}

// =====================================
// FORM VALIDATION
// =====================================

function validateQuizForm() {

    const form = document.getElementById("quizForm");

    const requiredFields = form.querySelectorAll("[required]");

    for (const field of requiredFields) {

        if (field.type === "radio") {

            const group = document.querySelectorAll(
                'input[name="' + field.name + '"]'
            );

            let checked = false;

            group.forEach(r => {

                if (r.checked) checked = true;

            });

            if (!checked) {

                alert("Please answer : " + field.name);

                return false;

            }

        }

        else if (field.type === "file") {

            if (field.files.length === 0) {

                alert("Please upload : " + field.name);

                return false;

            }

        }

        else {

            if (field.value.trim() === "") {

                alert("Please fill : " + field.name);

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

// =====================================
// SHOW FILE NAME
// =====================================

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
// MULTIPLE FILE INPUT
// =====================================

function addFileField(containerId, inputName, required = false) {

    const container = document.getElementById(containerId);

    if (!container) return;

    const wrapper = document.createElement("div");

    wrapper.className = "extra-upload";

    wrapper.style.marginTop = "12px";

    const input = document.createElement("input");

    input.type = "file";

    input.name = inputName;

    input.accept =
        "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.dwg,.dxf";

    if (required) input.required = true;

    input.addEventListener("change", function () {

        if (this.files.length) {

            if (this.files[0].size > MAX_FILE_SIZE) {

                alert("Maximum file size is 20 MB");

                this.value = "";

                return;

            }

        }

        showSelectedFile(this);

    });

    wrapper.appendChild(input);

    container.appendChild(wrapper);

}

// =====================================
// SAVE QUIZ AUTO
// =====================================

document.querySelectorAll("#quizForm input").forEach(input => {

    input.addEventListener("change", saveQuizDraft);

});

function saveQuizDraft() {

    const form = document.getElementById("quizForm");

    const data = {};

    new FormData(form).forEach((value, key) => {

        data[key] = value;

    });

    localStorage.setItem(

        "page2Draft",

        JSON.stringify(data)

    );

}

// =====================================
// LOAD QUIZ AUTO
// =====================================

function loadQuizDraft() {

    const draft = JSON.parse(

        localStorage.getItem("page2Draft")

    );

    if (!draft) return;

    Object.keys(draft).forEach(key => {

        const value = draft[key];

        const radio = document.querySelector(

            'input[name="' + key + '"][value="' + value + '"]'

        );

        if (radio) {

            radio.checked = true;

            return;

        }

        const field = document.querySelector(

            '[name="' + key + '"]'

        );

        if (field && field.type !== "file") {

            field.value = value;

        }

    });

    updateScore();

    updatePlanetScore();

    updateGunaScore();

    updateElementBalanceScore();

    updatePrakritiQuizScore();

}

window.addEventListener("load", loadQuizDraft);

// =====================================
// SAFE SCORE UPDATE
// =====================================

function setText(id, value) {

    const el = document.getElementById(id);

    if (el) {

        el.textContent = value;

    }

}

// =====================================
// CLEAR DRAFT
// =====================================

function clearPage2Draft() {

    localStorage.removeItem("page2Draft");

}

// =====================================
// RESET COMPLETE FORM
// =====================================

function resetQuizForm() {

    const form = document.getElementById("quizForm");

    if (!form) return;

    form.reset();

    document.querySelectorAll(".selected-file").forEach(el => {

        el.remove();

    });

    updateScore();

    updatePlanetScore();

    updateGunaScore();

    updateElementBalanceScore();

    updatePrakritiQuizScore();

}

// =====================================
// AUTO UPDATE WHEN ANY RADIO CHANGES
// =====================================

document.addEventListener("change", function (e) {

    if (!e.target.matches('input[type="radio"]')) return;

    updateScore();

    updatePlanetScore();

    updateGunaScore();

    updateElementBalanceScore();

    updatePrakritiQuizScore();

});

// =====================================
// AUTO SAVE TEXT INPUTS
// =====================================

document.querySelectorAll(

    "#quizForm input,#quizForm textarea,#quizForm select"

).forEach(field => {

    if (field.type !== "file") {

        field.addEventListener("input", saveQuizDraft);

    }

});

// =====================================
// SUBMIT VALIDATION
// =====================================

const originalSubmit = submitForm;

submitForm = async function (e) {

    e.preventDefault();

    if (!validateQuizForm()) {

        return;

    }

    await originalSubmit(e);

};

// =====================================
// PAGE STARTUP
// =====================================

window.addEventListener("load", function () {

    loadQuizDraft();

    updateScore();

    updatePlanetScore();

    updateGunaScore();

    updateElementBalanceScore();

    updatePrakritiQuizScore();

});

// =====================================
// DEBUG (REMOVE LATER IF NOT NEEDED)
// =====================================

function printAllScores() {

    console.log({

        air: document.getElementById("airScore")?.innerText,

        fire: document.getElementById("fireScore")?.innerText,

        earth: document.getElementById("earthScore")?.innerText,

        space: document.getElementById("spaceScore")?.innerText,

        water: document.getElementById("waterScore")?.innerText,

        ketu: document.getElementById("ketuScore")?.innerText,

        venus: document.getElementById("venusScore")?.innerText,

        sun: document.getElementById("sunScore")?.innerText,

        moon: document.getElementById("moonScore")?.innerText,

        mars: document.getElementById("marsScore")?.innerText,

        rahu: document.getElementById("rahuScore")?.innerText,

        jupiter: document.getElementById("jupiterScore")?.innerText,

        saturn: document.getElementById("saturnScore")?.innerText,

        mercury: document.getElementById("mercuryScore")?.innerText,

        sattav: document.getElementById("sattavScore")?.innerText,

        rajas: document.getElementById("rajasScore")?.innerText,

        tamas: document.getElementById("tamasScore")?.innerText,

        airElement: document.getElementById("airElementScore")?.innerText,

        fireElement: document.getElementById("fireElementScore")?.innerText,

        waterElement: document.getElementById("waterElementScore")?.innerText,

        prakritiAir: document.getElementById("prakritiAirTotal")?.innerText,

        prakritiFire: document.getElementById("prakritiFireTotal")?.innerText,

        prakritiWater: document.getElementById("prakritiWaterTotal")?.innerText

    });

}

window.printAllScores = printAllScores;

// =====================================
// END OF FILE
// =====================================

async function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function () {

            resolve(reader.result.split(",")[1]);

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}

function updateScore() {

    const scores = {
        Air: 0,
        Fire: 0,
        Earth: 0,
        Space: 0,
        Water: 0
    };

    for (let i = 1; i <= 25; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected) scores[selected.value]++;
    }

    document.getElementById("airScore").textContent = `${scores.Air} /25`;
    document.getElementById("fireScore").textContent = `${scores.Fire} /25`;
    document.getElementById("earthScore").textContent = `${scores.Earth} /25`;
    document.getElementById("spaceScore").textContent = `${scores.Space} /25`;
    document.getElementById("waterScore").textContent = `${scores.Water} /25`;
}

function updatePlanetScore() {

    const scores = {
        Ketu: 0,
        Venus: 0,
        Sun: 0,
        Moon: 0,
        Mars: 0,
        Rahu: 0,
        Jupiter: 0,
        Saturn: 0,
        Mercury: 0
    };

    for (let i = 1; i <= 13; i++) {

        const selected = document.querySelector(`input[name="p1_q${i}"]:checked`);

        if (selected) {
            scores[selected.value]++;
        }
    }

    document.getElementById("ketuScore").textContent = `${scores.Ketu} /13`;
    document.getElementById("venusScore").textContent = `${scores.Venus} /13`;
    document.getElementById("sunScore").textContent = `${scores.Sun} /13`;
    document.getElementById("moonScore").textContent = `${scores.Moon} /13`;
    document.getElementById("marsScore").textContent = `${scores.Mars} /13`;
    document.getElementById("rahuScore").textContent = `${scores.Rahu} /13`;
    document.getElementById("jupiterScore").textContent = `${scores.Jupiter} /13`;
    document.getElementById("saturnScore").textContent = `${scores.Saturn} /13`;
    document.getElementById("mercuryScore").textContent = `${scores.Mercury} /13`;
}

function updateGunaScore() {

    const scores = {
        Sattav: 0,
        Rajas: 0,
        Tamas: 0
    };

    for (let i = 1; i <= 25; i++) {

        const selected = document.querySelector(`input[name="gu_q${i}"]:checked`);

        if (selected) {
            scores[selected.value]++;
        }
    }

    document.getElementById("sattavScore").textContent = `${scores.Sattav} /25`;
    document.getElementById("rajasScore").textContent = `${scores.Rajas} /25`;
    document.getElementById("tamasScore").textContent = `${scores.Tamas} /25`;
}

function updateElementBalanceScore() {

    const scores = {
        Air: 0,
        Fire: 0,
        Water: 0
    };

    for (let i = 1; i <= 30; i++) {

        const selected = document.querySelector(
            `input[name="eb_q${i}"]:checked`
        );

        if (selected) {
            scores[selected.value]++;
        }

    }

    const air = document.getElementById("airElementScore");
    const fire = document.getElementById("fireElementScore");
    const water = document.getElementById("waterElementScore");

    if (air) {
        air.textContent = scores.Air + " /30";
    }

    if (fire) {
        fire.textContent = scores.Fire + " /30";
    }

    if (water) {
        water.textContent = scores.Water + " /30";
    }

}

/* =====================================================
   DOSHA QUIZ SCORE (30 Questions)
===================================================== */

function updateDoshaQuizScore() {

    let air = 0;
    let fire = 0;
    let water = 0;

    for (let i = 1; i <= 30; i++) {

        const selected = document.querySelector(`input[name="eb_q${i}"]:checked`);

        if (!selected) continue;

        switch (selected.value) {

            case "Air":
                air++;
                break;

            case "Fire":
                fire++;
                break;

            case "Water":
                water++;
                break;
        }
    }

    document.getElementById("airElementScore").textContent = air + " /30";
    document.getElementById("fireElementScore").textContent = fire + " /30";
    document.getElementById("waterElementScore").textContent = water + " /30";
}



/* =====================================================
   PRAKRITI QUIZ SCORE
===================================================== */

function updatePrakritiQuizScore() {

    let air = 0;
    let fire = 0;
    let water = 0;

    const fields = [
        "bodyWeight",
        "nose",
        "teeth",
        "nails",
        "skin",
        "taste"
    ];

    fields.forEach(name => {

        const selected = document.querySelector(`input[name="${name}"]:checked`);

        if (!selected) return;

        switch (selected.value) {

            case "Air":
                air++;
                break;

            case "Fire":
                fire++;
                break;

            case "Water":
                water++;
                break;
        }

    });

    document.getElementById("prakritiAirTotal").textContent = air;
    document.getElementById("prakritiFireTotal").textContent = fire;
    document.getElementById("prakritiWaterTotal").textContent = water;
}



/* =====================================================
   AUTO UPDATE
===================================================== */

document.addEventListener("change", function (e) {

    if (e.target.type !== "radio") return;

    updateDoshaQuizScore();
    updatePrakritiQuizScore();

});


window.addEventListener("load", function () {

    updateDoshaQuizScore();
    updatePrakritiQuizScore();

});

document.addEventListener("change", function (e) {

    if (e.target.type !== "radio") return;

    updateScore();
    updatePlanetScore();
    updateGunaScore();
    updateElementBalanceScore();
    updatePrakritiQuizScore();

});

window.addEventListener("pageshow", function () {
    document.getElementById("quizForm").reset();
});

window.addEventListener("load", function () {

    // Reset form
    document.getElementById("quizForm").reset();

    // Five Elements
    airScore.textContent = "0 /25";
    fireScore.textContent = "0 /25";
    earthScore.textContent = "0 /25";
    spaceScore.textContent = "0 /25";
    waterScore.textContent = "0 /25";

    // Planets
    ketuScore.textContent = "0 /13";
    venusScore.textContent = "0 /13";
    sunScore.textContent = "0 /13";
    moonScore.textContent = "0 /13";
    marsScore.textContent = "0 /13";
    rahuScore.textContent = "0 /13";
    jupiterScore.textContent = "0 /13";
    saturnScore.textContent = "0 /13";
    mercuryScore.textContent = "0 /13";

    // Gunas
    sattavScore.textContent = "0 /25";
    rajasScore.textContent = "0 /25";
    tamasScore.textContent = "0 /25";

    // Dosha
    airElementScore.textContent = "0 /30";
    fireElementScore.textContent = "0 /30";
    waterElementScore.textContent = "0 /30";

    // Prakriti
    prakritiAirTotal.textContent = "0";
    prakritiFireTotal.textContent = "0";
    prakritiWaterTotal.textContent = "0";

});
