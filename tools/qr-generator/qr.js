
"use strict";

const qrInput = document.getElementById("qrInput");
const generateQR = document.getElementById("generateQR");
const downloadQR = document.getElementById("downloadQR");

const qrResult = document.getElementById("qrResult");
const qrCanvas = document.getElementById("qrCanvas");
const status = document.getElementById("status");

let qrGenerated = false;

/* ================================
   STATUS MESSAGE
================================ */

function setStatus(message, type = "success") {
  status.textContent = message;

  status.style.color =
    type === "error"
      ? "#ff5577"
      : "#27d69b";
}

/* ================================
   GENERATE QR CODE
================================ */

generateQR.addEventListener("click", function () {
  const text = qrInput.value.trim();

  if (text === "") {
    setStatus(
      "Please enter text or a URL first.",
      "error"
    );

    qrResult.classList.remove("visible");
    qrGenerated = false;

    return;
  }

  if (typeof QRCode === "undefined") {
    setStatus(
      "QR library not loaded. Check qrcode.min.js file.",
      "error"
    );

    return;
  }

  qrCanvas.innerHTML = "";

  new QRCode(qrCanvas, {
    text: text,

    width: 240,
    height: 240,

    colorDark: "#111827",
    colorLight: "#ffffff",

    correctLevel: QRCode.CorrectLevel.H
  });

  qrResult.classList.add("visible");

  qrGenerated = true;

  setStatus("QR code generated successfully.");
});

/* ================================
   DOWNLOAD QR WITH WHITE BORDER
================================ */

downloadQR.addEventListener("click", function () {
  if (!qrGenerated) {
    setStatus(
      "Please generate a QR code first.",
      "error"
    );

    return;
  }

  const originalCanvas = qrCanvas.querySelector("canvas");
  const originalImage = qrCanvas.querySelector("img");

  if (!originalCanvas && !originalImage) {
    setStatus(
      "Unable to download QR code.",
      "error"
    );

    return;
  }

  /*
    FINAL IMAGE SIZE

    1200 x 1200 pixels
  */

  const exportSize = 1200;

  /*
    WHITE BORDER

    120 pixels on all sides
  */

  const padding = 120;

  /*
    QR SIZE

    960 x 960 pixels
  */

  const qrSize = exportSize - padding * 2;

  const exportCanvas = document.createElement("canvas");

  exportCanvas.width = exportSize;
  exportCanvas.height = exportSize;

  const ctx = exportCanvas.getContext("2d");

  /*
    WHITE BACKGROUND
  */

  ctx.fillStyle = "#ffffff";

  ctx.fillRect(
    0,
    0,
    exportSize,
    exportSize
  );

  /*
    SHARP QR PIXELS
  */

  ctx.imageSmoothingEnabled = false;

  /*
    DRAW QR WITH BORDER
  */

  if (originalCanvas) {
    ctx.drawImage(
      originalCanvas,
      padding,
      padding,
      qrSize,
      qrSize
    );

    saveQR(exportCanvas);

    return;
  }

  /*
    IMAGE FALLBACK
  */

  if (originalImage) {
    const drawImage = function () {
      ctx.drawImage(
        originalImage,
        padding,
        padding,
        qrSize,
        qrSize
      );

      saveQR(exportCanvas);
    };

    if (originalImage.complete) {
      drawImage();
    } else {
      originalImage.onload = drawImage;
    }
  }
});

/* ================================
   SAVE PNG
================================ */

function saveQR(canvas) {
  canvas.toBlob(function (blob) {
    if (!blob) {
      setStatus(
        "Unable to download QR code.",
        "error"
      );

      return;
    }

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "toolbox-qr-code-HD.png";

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);

    setStatus(
      "QR code downloaded with white border successfully."
    );
  }, "image/png");
}

/* ================================
   CTRL + ENTER SUPPORT
================================ */

qrInput.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "Enter") {
    generateQR.click();
  }
});