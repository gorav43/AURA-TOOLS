/* =========================================
   WORD CALCULATOR
========================================= */

const textInput = document.getElementById("text-input");

const wordCount = document.getElementById("word-count");
const characterCount = document.getElementById("character-count");
const characterNoSpaceCount = document.getElementById(
    "character-no-space-count"
);

const sentenceCount = document.getElementById("sentence-count");
const paragraphCount = document.getElementById("paragraph-count");
const readingTime = document.getElementById("reading-time");

const clearTextButton = document.getElementById("clear-text");
const copyTextButton = document.getElementById("copy-text");

const textLength = document.getElementById("text-length");
const progressFill = document.getElementById("progress-fill");


/* =========================================
   UPDATE ALL COUNTS
========================================= */

function updateWordStats() {

    const text = textInput.value;

    /* Characters */
    const characters = text.length;

    const charactersWithoutSpaces = text
        .replace(/\s/g, "")
        .length;


    /* Words */
    const trimmedText = text.trim();

    const words = trimmedText === ""
        ? []
        : trimmedText.split(/\s+/);

    const totalWords = words.length;


    /* Sentences */
    const sentences = text
        .split(/[.!?]+/)
        .filter(sentence => sentence.trim().length > 0);

    const totalSentences = sentences.length;


    /* Paragraphs */
    const paragraphs = text
        .split(/\n+/)
        .filter(paragraph => paragraph.trim().length > 0);

    const totalParagraphs = paragraphs.length;


    /* Reading Time */
    const wordsPerMinute = 200;

    const totalReadingMinutes = totalWords === 0
        ? 0
        : Math.ceil(totalWords / wordsPerMinute);


    /* Update UI */
    wordCount.textContent = totalWords;

    characterCount.textContent = characters;

    characterNoSpaceCount.textContent =
        charactersWithoutSpaces;

    sentenceCount.textContent = totalSentences;

    paragraphCount.textContent = totalParagraphs;

    readingTime.textContent =
        `${totalReadingMinutes} min`;

    textLength.textContent =
        `${characters} characters`;


    /* Progress Bar */
    const progressPercentage = Math.min(
        (characters / 1000) * 100,
        100
    );

    progressFill.style.width =
        `${progressPercentage}%`;

}


/* =========================================
   LIVE TEXT COUNT
========================================= */

textInput.addEventListener(
    "input",
    updateWordStats
);


/* =========================================
   CLEAR TEXT
========================================= */

clearTextButton.addEventListener(
    "click",
    function () {

        textInput.value = "";

        updateWordStats();

        textInput.focus();

    }
);


/* =========================================
   COPY TEXT
========================================= */

copyTextButton.addEventListener(
    "click",
    async function () {

        const text = textInput.value.trim();

        if (text === "") {
            alert("There is no text to copy.");
            return;
        }

        try {

            await navigator.clipboard.writeText(text);

            copyTextButton.textContent = "Copied!";

            setTimeout(function () {
                copyTextButton.textContent = "Copy Text";
            }, 1500);

        } catch (error) {

            textInput.select();
            document.execCommand("copy");

            copyTextButton.textContent = "Copied!";

            setTimeout(function () {
                copyTextButton.textContent = "Copy Text";
            }, 1500);

        }

    }
);


/* =========================================
   INITIAL COUNT
========================================= */

updateWordStats();