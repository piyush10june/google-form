const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyQUT1fvXzL4j56dc3BkZvBkubxG5Jv8WwFeO1u7SQCVmH_-AnjPGwT0xeQAABPd2fe/exec";

// ========================================
// NEXT BUTTON
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const nextBtn = document.getElementById("nextBtn");

    if (!nextBtn) return;

    nextBtn.addEventListener("click", async function () {

        const form = document.getElementById("astroForm");

        const formData = new FormData(form);

        if (!form.reportValidity()) return;

        const uploadedFiles = {};

        const data = {};

        for (const [key, value] of formData.entries()) {

            if (value instanceof File && value.size > 0) {

                const result = await uploadSingleFile(value);

                if (!result.success) {

                    alert("Failed to upload " + value.name);

                    return;

                }

                if (!uploadedFiles[key]) {

                    uploadedFiles[key] = [];

                }

                uploadedFiles[key].push(result);

            }

            else {

                if (data[key]) {

                    if (!Array.isArray(data[key])) {

                        data[key] = [data[key]];

                    }

                    data[key].push(value);

                }

                else {

                    data[key] = value;

                }

            }

        }

        localStorage.setItem(
            "astroFormData",
            JSON.stringify(data)
        );

        localStorage.setItem(
            "page1UploadedFiles",
            JSON.stringify(uploadedFiles)
        );

        console.log(uploadedFiles);

        window.location.href = "page2.html";

    });

});

// ========================================
// SHOW / HIDE ACCESSORY DESCRIPTION
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".accessory-check").forEach(function (checkbox) {

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

});

function addField(containerId, name, placeholder) {

    const container = document.getElementById(containerId);

    const input = document.createElement("input");

    input.type = "text";

    input.name = name;

    input.placeholder = placeholder;

    input.style.marginTop = "10px";

    container.appendChild(input);

}

function addTextarea(containerId, name, placeholder) {

    const container = document.getElementById(containerId);

    const textarea = document.createElement("textarea");

    textarea.name = name;

    textarea.placeholder = placeholder;

    textarea.style.marginTop = "10px";

    container.appendChild(textarea);

}

function addFileField(containerId, name) {

    const container = document.getElementById(containerId);

    const input = document.createElement("input");

    input.type = "file";
    input.name = name;
    input.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.dwg,.dxf";
    input.style.marginTop = "10px";

    container.appendChild(input);

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

    const fd = new FormData();

    fd.append("action", "uploadSingleFile");
    fd.append("fileName", file.name);
    fd.append("mimeType", file.type);
    fd.append("base64", await fileToBase64(file));

    const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: fd,
        redirect: "follow"
    });

    return await response.json();

}