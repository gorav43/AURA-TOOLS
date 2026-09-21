const imageInput = document.getElementById("imageInput");
const chooseBtn = document.getElementById("chooseBtn");
const uploadArea = document.getElementById("uploadArea");

const previewSection = document.getElementById("previewSection");
const imagePreviewGrid = document.getElementById("imagePreviewGrid");

const clearBtn = document.getElementById("clearBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

const pageSize = document.getElementById("pageSize");
const orientation = document.getElementById("orientation");
const margin = document.getElementById("margin");

const statusMessage = document.getElementById("statusMessage");

let selectedImages = [];

chooseBtn.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", (event) => {
  const files = Array.from(event.target.files);

  addImages(files);

  imageInput.value = "";
});

uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();

  uploadArea.classList.remove("dragover");

  const files = Array.from(event.dataTransfer.files)
    .filter((file) => file.type.startsWith("image/"));

  addImages(files);
});

function addImages(files) {
  if (files.length === 0) {
    showStatus("Please select valid image files.", true);
    return;
  }

  selectedImages.push(...files);

  renderPreviews();

  previewSection.style.display = "block";

  showStatus(`${selectedImages.length} image(s) selected.`);
}

function renderPreviews() {
  imagePreviewGrid.innerHTML = "";

  selectedImages.forEach((file, index) => {
    const imageCard = document.createElement("div");
    imageCard.className = "image-card";

    const image = document.createElement("img");
    image.alt = file.name;

    const imageInfo = document.createElement("div");
    imageInfo.className = "image-info";
    imageInfo.textContent = file.name;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-image";
    removeButton.innerHTML = "×";
    removeButton.title = "Remove image";

    removeButton.addEventListener("click", () => {
      selectedImages.splice(index, 1);

      renderPreviews();

      if (selectedImages.length === 0) {
        previewSection.style.display = "none";
        showStatus("");
      } else {
        showStatus(`${selectedImages.length} image(s) selected.`);
      }
    });

    const reader = new FileReader();

    reader.onload = (event) => {
      image.src = event.target.result;
    };

    reader.readAsDataURL(file);

    imageCard.appendChild(image);
    imageCard.appendChild(imageInfo);
    imageCard.appendChild(removeButton);

    imagePreviewGrid.appendChild(imageCard);
  });
}

clearBtn.addEventListener("click", () => {
  selectedImages = [];

  imagePreviewGrid.innerHTML = "";
  previewSection.style.display = "none";

  showStatus("");
});

downloadPdfBtn.addEventListener("click", async () => {
  if (selectedImages.length === 0) {
    showStatus("Please select at least one image.", true);
    return;
  }

  downloadPdfBtn.disabled = true;
  downloadPdfBtn.textContent = "Creating PDF...";

  try {
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
      orientation: orientation.value,
      unit: "mm",
      format: pageSize.value
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const pageMargin = Number(margin.value);

    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];

      const imageData = await readFileAsDataURL(file);

      const imageInfo = await getImageInfo(imageData);

      if (i > 0) {
        pdf.addPage();
      }

      const availableWidth = pageWidth - pageMargin * 2;
      const availableHeight = pageHeight - pageMargin * 2;

      const imageRatio = imageInfo.width / imageInfo.height;

      let imageWidth = availableWidth;
      let imageHeight = imageWidth / imageRatio;

      if (imageHeight > availableHeight) {
        imageHeight = availableHeight;
        imageWidth = imageHeight * imageRatio;
      }

      const x = (pageWidth - imageWidth) / 2;
      const y = (pageHeight - imageHeight) / 2;

      const imageFormat = getImageFormat(file.type);

      pdf.addImage(
        imageData,
        imageFormat,
        x,
        y,
        imageWidth,
        imageHeight
      );
    }

    pdf.save("toolbox-images.pdf");

    showStatus("PDF created successfully!");

  } catch (error) {
    console.error(error);
    showStatus("Something went wrong while creating PDF.", true);
  }

  downloadPdfBtn.disabled = false;
  downloadPdfBtn.textContent = "Download PDF";
});

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}

function getImageInfo(imageData) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height
      });
    };

    image.onerror = reject;
    image.src = imageData;
  });
}

function getImageFormat(fileType) {
  if (fileType === "image/png") {
    return "PNG";
  }

  if (fileType === "image/webp") {
    return "WEBP";
  }

  return "JPEG";
}

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "#ff5577" : "#27d69b";
}