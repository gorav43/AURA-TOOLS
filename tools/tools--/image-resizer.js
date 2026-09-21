/* ================================
   IMAGE RESIZER
================================ */

const resizerInput = document.getElementById("resizerInput");
const resizerUploadBox = document.getElementById("resizerUploadBox");
const resizerPreview = document.getElementById("resizerPreview");
const resizerPreviewImage = document.getElementById("resizerPreviewImage");
const resizerFileName = document.getElementById("resizerFileName");
const resizerControls = document.getElementById("resizerControls");
const resizerActions = document.getElementById("resizerActions");
const resizerResult = document.getElementById("resizerResult");

const resizerWidth = document.getElementById("resizerWidth");
const resizerHeight = document.getElementById("resizerHeight");
const resizerFormat = document.getElementById("resizerFormat");
const resizerQuality = document.getElementById("resizerQuality");
const resizerLockRatio = document.getElementById("resizerLockRatio");

const resizeBtn = document.getElementById("resizeBtn");
const resetResizerBtn = document.getElementById("resetResizerBtn");

let selectedImage = null;
let originalWidth = 0;
let originalHeight = 0;
let imageFileName = "resized-image";

resizerUploadBox.addEventListener("click", () => {
  resizerInput.click();
});

resizerInput.addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }

  selectedImage = file;
  imageFileName = file.name.split(".")[0];

  const reader = new FileReader();

  reader.onload = function (e) {
    const image = new Image();

    image.onload = function () {
      originalWidth = image.width;
      originalHeight = image.height;

      resizerPreviewImage.src = e.target.result;
      resizerFileName.textContent =
        `${file.name} • ${originalWidth} × ${originalHeight}px`;

      resizerWidth.value = originalWidth;
      resizerHeight.value = originalHeight;

      resizerPreview.style.display = "block";
      resizerControls.style.display = "grid";
      resizerActions.style.display = "flex";
      resizerResult.style.display = "none";
    };

    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

resizerWidth.addEventListener("input", () => {
  if (!resizerLockRatio.checked || !originalWidth || !originalHeight) {
    return;
  }

  const newWidth = Number(resizerWidth.value);

  if (newWidth > 0) {
    resizerHeight.value = Math.round(
      (newWidth / originalWidth) * originalHeight
    );
  }
});

resizerHeight.addEventListener("input", () => {
  if (!resizerLockRatio.checked || !originalWidth || !originalHeight) {
    return;
  }

  const newHeight = Number(resizerHeight.value);

  if (newHeight > 0) {
    resizerWidth.value = Math.round(
      (newHeight / originalHeight) * originalWidth
    );
  }
});

resizeBtn.addEventListener("click", resizeImage);

function resizeImage() {
  if (!selectedImage) {
    alert("Please select an image first.");
    return;
  }

  const width = Number(resizerWidth.value);
  const height = Number(resizerHeight.value);
  const format = resizerFormat.value;
  const quality = Number(resizerQuality.value) / 100;

  if (width <= 0 || height <= 0) {
    alert("Please enter a valid width and height.");
    return;
  }

  const image = new Image();
  const reader = new FileReader();

  reader.onload = function (event) {
    image.onload = function () {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      context.drawImage(image, 0, 0, width, height);

      const mimeType =
        format === "jpg" ? "image/jpeg" : `image/${format}`;

      const outputQuality =
        format === "png" ? undefined : quality;

      const resizedImage = canvas.toDataURL(mimeType, outputQuality);

      document.getElementById("resizerResultImage").src = resizedImage;

      const downloadLink = document.getElementById("resizerDownload");
      downloadLink.href = resizedImage;
      downloadLink.download = `${imageFileName}-resized.${format}`;

      document.getElementById("resizerResultInfo").textContent =
        `New size: ${width} × ${height}px`;

      resizerResult.style.display = "block";
    };

    image.src = event.target.result;
  };

  reader.readAsDataURL(selectedImage);
}

resetResizerBtn.addEventListener("click", () => {
  selectedImage = null;
  originalWidth = 0;
  originalHeight = 0;

  resizerInput.value = "";
  resizerPreviewImage.src = "";
  resizerFileName.textContent = "";

  resizerPreview.style.display = "none";
  resizerControls.style.display = "none";
  resizerActions.style.display = "none";
  resizerResult.style.display = "none";
});