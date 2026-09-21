/* =========================================================
   IMAGE COMPRESSOR
   ========================================================= */

const compressorInput =
    document.getElementById("compressorInput");

const compressorUploadBox =
    document.getElementById("compressorUploadBox");

const previewSection =
    document.getElementById("imagePreview");

const previewImage =
    document.getElementById("previewImage");

const fileName =
    document.getElementById("fileName");

const fileInfo =
    document.getElementById("fileInfo");

const compressorControls =
    document.getElementById("compressorControls");

const compressorActions =
    document.getElementById("compressorActions");

const compressorResult =
    document.getElementById("compressorResult");

const compressorQuality =
    document.getElementById("compressorQuality");

const compressorQualityValue =
    document.getElementById("compressorQualityValue");

const compressorFormat =
    document.getElementById("compressorFormat");

const compressBtn =
    document.getElementById("compressBtn");

const resetCompressorBtn =
    document.getElementById("resetCompressorBtn");

const progress =
    document.getElementById("compressorProgress");

const progressBar =
    document.getElementById("compressorProgressBar");

const resultImage =
    document.getElementById("compressorResultImage");

const resultInfo =
    document.getElementById("compressorResultInfo");

const downloadLink =
    document.getElementById("compressorDownload");


/* =========================================================
   VARIABLES
   ========================================================= */

let compressorFile = null;
let compressorFileNameValue = "compressed-image";
let currentPreviewURL = null;
let currentResultURL = null;


/* =========================================================
   INITIAL STATE
   ========================================================= */

previewImage.style.display = "none";
compressorControls.style.display = "none";
compressorActions.style.display = "none";
compressorResult.style.display = "none";
progress.style.display = "none";


/* =========================================================
   OPEN FILE SELECTOR
   ========================================================= */

compressorUploadBox.addEventListener("click", () => {
    compressorInput.click();
});


/* =========================================================
   FILE SELECT
   ========================================================= */

compressorInput.addEventListener(
    "change",
    handleCompressorUpload
);


/* =========================================================
   QUALITY SLIDER
   ========================================================= */

compressorQuality.addEventListener("input", () => {

    compressorQualityValue.textContent =
        `${compressorQuality.value}%`;

});


/* =========================================================
   HANDLE IMAGE UPLOAD
   ========================================================= */

function handleCompressorUpload(event) {

    const file = event.target.files[0];

    if (!file) return;


    /* Check image */

    if (!file.type.startsWith("image/")) {

        alert("Please select a valid image file.");

        compressorInput.value = "";

        return;
    }


    /* Save file */

    compressorFile = file;

    compressorFileNameValue =
        file.name.replace(/\.[^/.]+$/, "");


    /* Revoke old preview URL */

    if (currentPreviewURL) {
        URL.revokeObjectURL(currentPreviewURL);
    }


    /* Create preview URL */

    currentPreviewURL =
        URL.createObjectURL(file);


    /* Show image */

    previewImage.src = currentPreviewURL;

    previewImage.style.display = "block";


    /* File name */

    fileName.textContent =
        file.name;


    /* File information */

    const sizeKB =
        file.size / 1024;

    const sizeMB =
        file.size / (1024 * 1024);


    let sizeText;

    if (sizeMB >= 1) {

        sizeText =
            `${sizeMB.toFixed(2)} MB`;

    } else {

        sizeText =
            `${sizeKB.toFixed(2)} KB`;
    }


    /* Get image dimensions */

    const image = new Image();

    image.onload = function () {

        fileInfo.textContent =
            `${sizeText} • ${image.width} × ${image.height}`;

    };

    image.src = currentPreviewURL;


    /* Show controls */

    compressorControls.style.display =
        "block";

    compressorActions.style.display =
        "grid";


    /* Hide previous result */

    compressorResult.style.display =
        "none";

    progress.style.display =
        "none";


    /* Scroll slightly to preview */

    setTimeout(() => {

        previewSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


/* =========================================================
   COMPRESS BUTTON
   ========================================================= */

compressBtn.addEventListener(
    "click",
    compressImage
);


/* =========================================================
   COMPRESS IMAGE
   ========================================================= */

function compressImage() {

    if (!compressorFile) {

        alert("Please select an image first.");

        return;
    }


    /* Get settings */

    const quality =
        Number(compressorQuality.value) / 100;

    const format =
        compressorFormat.value;


    /* MIME TYPE */

    let mimeType;

    if (format === "jpeg") {

        mimeType = "image/jpeg";

    } else if (format === "webp") {

        mimeType = "image/webp";

    } else {

        mimeType = "image/png";
    }


    /* Show progress */

    progress.style.display =
        "block";

    progressBar.style.width =
        "20%";


    /* Create image */

    const image =
        new Image();


    const reader =
        new FileReader();


    reader.onload = function (event) {

        progressBar.style.width =
            "50%";


        image.onload = function () {

            /* Create canvas */

            const canvas =
                document.createElement("canvas");

            const context =
                canvas.getContext("2d");


            canvas.width =
                image.width;

            canvas.height =
                image.height;


            /* White background for JPG */

            if (format === "jpeg") {

                context.fillStyle =
                    "#ffffff";

                context.fillRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            }


            /* Draw image */

            context.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height
            );


            progressBar.style.width =
                "75%";


            /* PNG doesn't use quality */

            const outputQuality =
                format === "png"
                    ? undefined
                    : quality;


            /* Convert canvas */

            canvas.toBlob(

                function (blob) {

                    if (!blob) {

                        alert(
                            "Compression failed. Please try again."
                        );

                        progress.style.display =
                            "none";

                        return;
                    }


                    progressBar.style.width =
                        "100%";


                    /* Remove previous result URL */

                    if (currentResultURL) {

                        URL.revokeObjectURL(
                            currentResultURL
                        );
                    }


                    /* Create output URL */

                    currentResultURL =
                        URL.createObjectURL(blob);


                    /* Show output image */

                    resultImage.src =
                        currentResultURL;


                    /* File sizes */

                    const originalSize =
                        compressorFile.size;

                    const compressedSize =
                        blob.size;


                    let reduction =
                        (
                            (
                                (originalSize -
                                    compressedSize) /
                                originalSize
                            ) * 100
                        );


                    /* Prevent negative reduction */

                    reduction =
                        Math.max(
                            0,
                            reduction
                        );


                    /* Format size */

                    const originalText =
                        formatFileSize(
                            originalSize
                        );

                    const compressedText =
                        formatFileSize(
                            compressedSize
                        );


                    /* Result information */

                    resultInfo.textContent =
                        `Original: ${originalText} • ` +
                        `Compressed: ${compressedText} • ` +
                        `Reduced: ${reduction.toFixed(1)}%`;


                    /* Download */

                    downloadLink.href =
                        currentResultURL;

                    downloadLink.download =
                        `${compressorFileNameValue}-compressed.${format === "jpeg" ? "jpg" : format}`;


                    /* Show result */

                    compressorResult.style.display =
                        "block";


                    /* Hide progress */

                    setTimeout(() => {

                        progress.style.display =
                            "none";

                        progressBar.style.width =
                            "0%";

                    }, 500);


                    /* Scroll to result */

                    setTimeout(() => {

                        compressorResult.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }, 550);

                },

                mimeType,

                outputQuality
            );

        };


        image.onerror = function () {

            alert(
                "Unable to process this image."
            );

            progress.style.display =
                "none";
        };


        image.src =
            event.target.result;
    };


    reader.onerror = function () {

        alert(
            "Unable to read the selected image."
        );

        progress.style.display =
            "none";
    };


    reader.readAsDataURL(
        compressorFile
    );
}


/* =========================================================
   FORMAT FILE SIZE
   ========================================================= */

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return `${bytes} B`;

    }


    if (bytes < 1024 * 1024) {

        return `${(bytes / 1024).toFixed(2)} KB`;

    }


    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}


/* =========================================================
   RESET
   ========================================================= */

resetCompressorBtn.addEventListener(
    "click",
    resetCompressor
);


function resetCompressor() {

    /* Remove file */

    compressorFile = null;

    compressorInput.value = "";


    /* Revoke URLs */

    if (currentPreviewURL) {

        URL.revokeObjectURL(
            currentPreviewURL
        );

        currentPreviewURL = null;
    }


    if (currentResultURL) {

        URL.revokeObjectURL(
            currentResultURL
        );

        currentResultURL = null;
    }


    /* Reset preview */

    previewImage.src = "";

    previewImage.style.display =
        "none";

    fileName.textContent =
        "No image selected";

    fileInfo.textContent =
        "Select an image to preview";


    /* Reset settings */

    compressorQuality.value =
        70;

    compressorQualityValue.textContent =
        "70%";

    compressorFormat.value =
        "jpeg";


    /* Hide sections */

    compressorControls.style.display =
        "none";

    compressorActions.style.display =
        "none";

    compressorResult.style.display =
        "none";

    progress.style.display =
        "none";


    /* Reset progress */

    progressBar.style.width =
        "0%";


    /* Reset result */

    resultImage.src = "";

    resultInfo.textContent = "";

    downloadLink.href = "#";

}


/* =========================================================
   DRAG & DROP
   ========================================================= */

compressorUploadBox.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        compressorUploadBox.classList.add(
            "dragover"
        );

    }
);


compressorUploadBox.addEventListener(
    "dragleave",
    function () {

        compressorUploadBox.classList.remove(
            "dragover"
        );

    }
);


compressorUploadBox.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        compressorUploadBox.classList.remove(
            "dragover"
        );


        const file =
            event.dataTransfer.files[0];


        if (!file) return;


        if (!file.type.startsWith("image/")) {

            alert(
                "Please drop a valid image file."
            );

            return;
        }


        /* Put dropped file into input */

        const dataTransfer =
            new DataTransfer();

        dataTransfer.items.add(file);

        compressorInput.files =
            dataTransfer.files;


        /* Trigger normal upload */

        handleCompressorUpload({
            target: compressorInput
        });

    }
);