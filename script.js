// ========================================
// Blueberry AstroVastu Client Form
// Page 1 JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("astroForm");

    if (!form) {
        console.error("Form with id='astroForm' not found.");
        return;
    }

    // ========================================
    // Show selected file name
    // ========================================

    const fileInputs = document.querySelectorAll("input[type='file']");

    fileInputs.forEach(input => {

        input.addEventListener("change", function () {

            let fileNameBox = this.parentElement.querySelector(".filename");

            if (!fileNameBox) {

                fileNameBox = document.createElement("small");

                fileNameBox.className = "filename";

                fileNameBox.style.display = "block";
                fileNameBox.style.marginTop = "8px";
                fileNameBox.style.color = "#f57c00";
                fileNameBox.style.fontWeight = "600";

                this.parentElement.appendChild(fileNameBox);

            }

            if (this.files.length > 0) {

                fileNameBox.innerHTML =
                    "📄 Selected: " + this.files[0].name;

            } else {

                fileNameBox.innerHTML = "";

            }

        });

    });

    // ========================================
    // Personal Accessories
    // ========================================

    const accessoryChecks = document.querySelectorAll(".accessory-check");

    accessoryChecks.forEach(check => {

        check.addEventListener("change", function () {

            const accessory =
                this.closest(".accessory");

            const textarea =
                accessory.querySelector(".accessory-desc");

            if (this.checked) {

                textarea.style.display = "block";

                textarea.required = true;

            }

            else {

                textarea.style.display = "none";

                textarea.required = false;

                textarea.value = "";

            }

        });

    });

    // ========================================
    // Remove red border automatically
    // ========================================

    const fields = form.querySelectorAll("input, textarea, select");

    fields.forEach(field => {

        field.addEventListener("input", function () {

            this.style.border = "1px solid #d8d8d8";

        });

        field.addEventListener("change", function () {

            this.style.border = "1px solid #d8d8d8";

        });

    });

    // ========================================
    // Form Validation
    // ========================================

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        let valid = true;

        let firstInvalid = null;

        const requiredFields = form.querySelectorAll("[required]");

        requiredFields.forEach(field => {

            let empty = false;

            if (field.type === "checkbox") {

                empty = !field.checked;

            }

            else if (field.type === "file") {

                empty = field.files.length === 0;

            }

            else {

                empty = field.value.trim() === "";

            }

            if (empty) {

                valid = false;

                field.style.border = "2px solid red";

                if (!firstInvalid) {

                    firstInvalid = field;

                }

            }

            else {

                field.style.border = "1px solid #d8d8d8";

            }

        });

        if (!valid) {

            alert("Please fill all required fields before proceeding.");

            firstInvalid.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

            firstInvalid.focus();

            return;

        }

        // ========================================
        // Confirmation
        // ========================================

        const proceed = confirm(

            "Are you sure you want to continue to the next page?"

        );

        if (!proceed) return;

        // ========================================
        // Save Page 1 Data
        // ========================================

        const formData = {};

        const allFields = form.querySelectorAll("input, textarea, select");

        allFields.forEach(field => {

            if (!field.name) return;

            if (field.type === "checkbox") {

                formData[field.name] = field.checked;

            }

            else if (field.type === "file") {

                if (field.files.length > 0) {

                    formData[field.name] = field.files[0].name;

                }

            }

            else {

                formData[field.name] = field.value;

            }

        });

        localStorage.setItem(

            "BlueberryForm",

            JSON.stringify(formData)

        );

        // ========================================
        // Go to Page 2
        // ========================================

        window.location.href = "page2.html";

    });

});

function addField(containerId, fieldName, placeholder) {

    const container = document.getElementById(containerId);

    const input = document.createElement("input");

    input.type = "text";

    if (fieldName.includes("mobile"))
        input.type = "tel";

    if (fieldName.includes("email"))
        input.type = "email";

    input.name = fieldName;

    input.placeholder = placeholder;

    input.style.marginTop = "10px";

    container.appendChild(input);
}

function addTextarea(containerId, fieldName, placeholder) {

    const container = document.getElementById(containerId);

    const textarea = document.createElement("textarea");

    textarea.name = fieldName;
    textarea.placeholder = placeholder;
    textarea.style.marginTop = "10px";

    container.appendChild(textarea);
}

function addFileField(containerId, fieldName, required = false) {

    const container = document.getElementById(containerId);

    const input = document.createElement("input");

    input.type = "file";
    input.name = fieldName;

    input.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.dwg,.dxf";

    if (required) {
        input.required = true;
    }

    input.style.display = "block";
    input.style.marginTop = "10px";

    // Show selected filename
    input.addEventListener("change", function () {

        let fileNameBox = this.nextElementSibling;

        if (!fileNameBox || !fileNameBox.classList.contains("filename")) {

            fileNameBox = document.createElement("small");

            fileNameBox.className = "filename";
            fileNameBox.style.display = "block";
            fileNameBox.style.marginTop = "8px";
            fileNameBox.style.color = "#f57c00";
            fileNameBox.style.fontWeight = "600";

            this.insertAdjacentElement("afterend", fileNameBox);
        }

        if (this.files.length > 0) {
            fileNameBox.innerHTML = "📄 Selected: " + this.files[0].name;
        } else {
            fileNameBox.innerHTML = "";
        }

    });

    container.appendChild(input);

}