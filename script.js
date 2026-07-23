// =======================================
// CONFIGURATION & CONSTANTS
// =======================================
const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyQUT1fvXzL4j56dc3BkZvBkubxG5Jv8WwFeO1u7SQCVmH_-AnjPGwT0xeQAABPd2fe/exec";

// =======================================
// DOM INITIALIZATION
// =======================================
document.addEventListener("DOMContentLoaded", function () {
    const nextBtn = document.getElementById("nextBtn");

    if (nextBtn) {
        nextBtn.addEventListener("click", handleNextButtonClick);
    }

    setupAccessoryToggles();
});

// =======================================
// NEXT BUTTON & PAGE 1 SUBMISSION
// =======================================
async function handleNextButtonClick() {
    const form = document.getElementById("astroForm");
    if (!form) return;

    const nextBtn = document.getElementById("nextBtn");

    // Validate standard HTML5 form controls
    if (!form.reportValidity()) return;

    const originalText = nextBtn.innerText;
    nextBtn.disabled = true;
    nextBtn.innerText = "Processing & uploading files...";

    try {
        const formData = new FormData(form);
        const uploadedFiles = {};
        const data = {};

        for (const [key, value] of formData.entries()) {
            if (value instanceof File && value.size > 0) {
                nextBtn.innerText = `Uploading ${value.name}...`;
                const result = await uploadSingleFile(value);

                if (!result || !result.success) {
                    alert(`Failed to upload ${value.name}. Please try again.`);
                    nextBtn.disabled = false;
                    nextBtn.innerText = originalText;
                    return;
                }

                if (!uploadedFiles[key]) {
                    uploadedFiles[key] = [];
                }
                uploadedFiles[key].push(result);
            } else if (value instanceof File) {
                // Skip empty file inputs
                continue;
            } else {
                if (data[key] !== undefined) {
                    if (!Array.isArray(data[key])) {
                        data[key] = [data[key]];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }
        }

        // Cache text responses and file data to local storage for Page 2 retrieval
        localStorage.setItem("astroFormData", JSON.stringify(data));
        localStorage.setItem("page1UploadedFiles", JSON.stringify(uploadedFiles));

        window.location.href = "page2.html";
    } catch (error) {
        console.error("Page 1 processing error:", error);
        alert("An error occurred while saving step 1. Please try again.");
        nextBtn.disabled = false;
        nextBtn.innerText = originalText;
    }
}

// =======================================
// ACCESSORY CHECKBOX TOGGLES
// =======================================
function setupAccessoryToggles() {
    document.querySelectorAll(".accessory-check").forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const description = document.getElementById(
                this.id.replace("Check", "Description")
            );

            if (!description) return;

            if (this.checked) {
                description.style.display = "block";
                description.required = true;
            } else {
                description.style.display = "none";
                description.required = false;
                description.value = "";
            }
        });
    });
}

// =======================================
// DYNAMIC FORM FIELD ADDITION
// =======================================
function addField(containerId, name, placeholder) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.placeholder = placeholder;
    input.style.marginTop = "10px";

    container.appendChild(input);
}

function addTextarea(containerId, name, placeholder) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const textarea = document.createElement("textarea");
    textarea.name = name;
    textarea.placeholder = placeholder;
    textarea.style.marginTop = "10px";

    container.appendChild(textarea);
}

function addFileField(containerId, name, isRequired = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const input = document.createElement("input");
    input.type = "file";
    input.name = name;
    input.accept =
        "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.dwg,.dxf";
    input.style.marginTop = "10px";
    if (isRequired) input.required = true;

    container.appendChild(input);
}

// =======================================
// FILE UPLOAD HELPERS
// =======================================
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