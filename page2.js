// =====================================
// GOOGLE APPS SCRIPT URL & CONSTANTS
// =====================================
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyQUT1fvXzL4j56dc3BkZvBkubxG5Jv8WwFeO1u7SQCVmH_-AnjPGwT0xeQAABPd2fe/exec";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

// =====================================
// DOM INITIALIZATION
// =====================================
document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("submitBtn");

  if (submitBtn) {
    submitBtn.addEventListener("click", submitForm);
  }

  // Attach File Size & Display Listeners
  document.querySelectorAll('input[type="file"]').forEach((fileInput) => {
    fileInput.addEventListener("change", function () {
      if (!this.files.length) return;
      if (this.files[0].size > MAX_FILE_SIZE) {
        alert("Maximum file size is 20 MB.");
        this.value = "";
        return;
      }
      showSelectedFile(this);
    });
  });

  // Score Calculation Listeners
  document.addEventListener("change", function (e) {
    if (e.target.type !== "radio") return;
    recalculateAllScores();
  });

  recalculateAllScores();
});

// =====================================
// FORM SUBMISSION PROCESSOR
// =====================================
async function submitForm(e) {
  if (e) e.preventDefault();

  const submitBtn = document.getElementById("submitBtn");

  if (!validateQuizForm()) {
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Uploading files & processing...";

  try {
    const form = document.getElementById("quizForm");
    const formData = new FormData(form);

    // 1. Upload Page 2 files individually
    const fileInputs = form.querySelectorAll('input[type="file"]');
    const page2UploadedFiles = {};

    for (const input of fileInputs) {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        submitBtn.innerText = `Uploading ${file.name}...`;

        const uploadRes = await uploadSingleFile(file);

        if (!uploadRes || !uploadRes.success) {
          alert(`Failed to upload ${file.name}. Please try again.`);
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit";
          return;
        }

        page2UploadedFiles[input.name] = [uploadRes];
      }
    }

    // 2. Retrieve Page 1 cached data
    const page1Data = JSON.parse(localStorage.getItem("astroFormData")) || {};
    const page1Files = JSON.parse(localStorage.getItem("page1UploadedFiles")) || {};

    const allUploadedFiles = { ...page1Files, ...page2UploadedFiles };

    // 3. Build final submission payload
    const payloadData = { ...page1Data };

    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) {
        payloadData[key] = value;
      }
    }

    // Capture score outputs from DOM
    payloadData.airScore = getDOMText("airScore");
    payloadData.fireScore = getDOMText("fireScore");
    payloadData.earthScore = getDOMText("earthScore");
    payloadData.spaceScore = getDOMText("spaceScore");
    payloadData.waterScore = getDOMText("waterScore");

    payloadData.ketuScore = getDOMText("ketuScore");
    payloadData.venusScore = getDOMText("venusScore");
    payloadData.sunScore = getDOMText("sunScore");
    payloadData.moonScore = getDOMText("moonScore");
    payloadData.marsScore = getDOMText("marsScore");
    payloadData.rahuScore = getDOMText("rahuScore");
    payloadData.jupiterScore = getDOMText("jupiterScore");
    payloadData.saturnScore = getDOMText("saturnScore");
    payloadData.mercuryScore = getDOMText("mercuryScore");

    payloadData.sattavScore = getDOMText("sattavScore");
    payloadData.rajasScore = getDOMText("rajasScore");
    payloadData.tamasScore = getDOMText("tamasScore");

    payloadData.airElementScore = getDOMText("airElementScore");
    payloadData.fireElementScore = getDOMText("fireElementScore");
    payloadData.waterElementScore = getDOMText("waterElementScore");

    payloadData.prakritiAirTotal = getDOMText("prakritiAirTotal");
    payloadData.prakritiFireTotal = getDOMText("prakritiFireTotal");
    payloadData.prakritiWaterTotal = getDOMText("prakritiWaterTotal");

    // Attach stringified file references
    payloadData.page1UploadedFiles = JSON.stringify(allUploadedFiles);

    submitBtn.innerText = "Generating PDF & Sending Email...";

    // 4. Send URL-encoded payload to Google Apps Script
    const urlParams = new URLSearchParams();
    Object.keys(payloadData).forEach((key) => {
      urlParams.append(key, payloadData[key]);
    });

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlParams.toString(),
    });

    alert("Form submitted successfully! Please check your email in a few minutes.");

    form.reset();
    localStorage.clear();
  } catch (err) {
    console.error("Submission error:", err);
    alert("Submission error: " + (err.message || err));
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
  }
}

// =====================================
// HELPER UTILITIES
// =====================================
function getDOMText(id) {
  const el = document.getElementById(id);
  return el ? el.innerText : "";
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadSingleFile(file) {
  const urlParams = new URLSearchParams();
  urlParams.append("action", "uploadSingleFile");
  urlParams.append("fileName", file.name);
  urlParams.append("mimeType", file.type);
  urlParams.append("base64", await fileToBase64(file));

  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlParams.toString(),
  });

  return await response.json();
}

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
// FORM VALIDATION
// =====================================
function validateQuizForm() {
  const form = document.getElementById("quizForm");
  if (!form) return true;

  const requiredFields = form.querySelectorAll("[required]");

  for (const field of requiredFields) {
    if (field.type === "radio") {
      const group = document.querySelectorAll(`input[name="${field.name}"]`);
      let checked = Array.from(group).some((r) => r.checked);
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
// SCORE CALCULATIONS
// =====================================
function recalculateAllScores() {
  updateScore();
  updatePlanetScore();
  updateGunaScore();
  updateDoshaQuizScore();
  updatePrakritiQuizScore();
}

function updateScore() {
  const scores = { Air: 0, Fire: 0, Earth: 0, Space: 0, Water: 0 };
  for (let i = 1; i <= 25; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && scores[selected.value] !== undefined) {
      scores[selected.value]++;
    }
  }
  setScoreText("airScore", `${scores.Air} /25`);
  setScoreText("fireScore", `${scores.Fire} /25`);
  setScoreText("earthScore", `${scores.Earth} /25`);
  setScoreText("spaceScore", `${scores.Space} /25`);
  setScoreText("waterScore", `${scores.Water} /25`);
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
    Mercury: 0,
  };
  for (let i = 1; i <= 13; i++) {
    const selected = document.querySelector(`input[name="p1_q${i}"]:checked`);
    if (selected && scores[selected.value] !== undefined) {
      scores[selected.value]++;
    }
  }
  setScoreText("ketuScore", `${scores.Ketu} /13`);
  setScoreText("venusScore", `${scores.Venus} /13`);
  setScoreText("sunScore", `${scores.Sun} /13`);
  setScoreText("moonScore", `${scores.Moon} /13`);
  setScoreText("marsScore", `${scores.Mars} /13`);
  setScoreText("rahuScore", `${scores.Rahu} /13`);
  setScoreText("jupiterScore", `${scores.Jupiter} /13`);
  setScoreText("saturnScore", `${scores.Saturn} /13`);
  setScoreText("mercuryScore", `${scores.Mercury} /13`);
}

function updateGunaScore() {
  const scores = { Sattav: 0, Rajas: 0, Tamas: 0 };
  for (let i = 1; i <= 25; i++) {
    const selected = document.querySelector(`input[name="gu_q${i}"]:checked`);
    if (selected && scores[selected.value] !== undefined) {
      scores[selected.value]++;
    }
  }
  setScoreText("sattavScore", `${scores.Sattav} /25`);
  setScoreText("rajasScore", `${scores.Rajas} /25`);
  setScoreText("tamasScore", `${scores.Tamas} /25`);
}

function updateDoshaQuizScore() {
  let air = 0,
    fire = 0,
    water = 0;
  for (let i = 1; i <= 30; i++) {
    const selected = document.querySelector(`input[name="eb_q${i}"]:checked`);
    if (!selected) continue;
    if (selected.value === "Air") air++;
    if (selected.value === "Fire") fire++;
    if (selected.value === "Water") water++;
  }
  setScoreText("airElementScore", `${air} /30`);
  setScoreText("fireElementScore", `${fire} /30`);
  setScoreText("waterElementScore", `${water} /30`);
}

function updatePrakritiQuizScore() {
  let air = 0,
    fire = 0,
    water = 0;
  const fields = ["bodyWeight", "nose", "teeth", "nails", "skin", "taste"];
  fields.forEach((name) => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (!selected) return;
    if (selected.value === "Air") air++;
    if (selected.value === "Fire") fire++;
    if (selected.value === "Water") water++;
  });
  setScoreText("prakritiAirTotal", air);
  setScoreText("prakritiFireTotal", fire);
  setScoreText("prakritiWaterTotal", water);
}

function setScoreText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}