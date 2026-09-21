/* =========================================================
   TOOLBOX JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const toolsGrid =
    document.getElementById("toolsGrid");

const toolCards =
    Array.from(
        document.querySelectorAll(".tool-card")
    );

const filterButtons =
    document.querySelectorAll(".filter-btn");

const resultsCount =
    document.getElementById("resultsCount");

const noResults =
    document.getElementById("noResults");

const resetSearch =
    document.getElementById("resetSearch");

const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.getElementById("navLinks");

const themeBtn =
    document.getElementById("themeBtn");


let currentFilter = "all";


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("open");

        const isOpen =
            navLinks.classList.contains("open");

        menuBtn.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

    });


    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuBtn.innerHTML =
                    '<i class="fa-solid fa-bars"></i>';

            });

        });

}


/* =========================================================
   SEARCH + FILTER
========================================================= */

function updateTools() {

    if (!searchInput) return;

    const query =
        searchInput.value
            .trim()
            .toLowerCase();

    let visibleCount = 0;


    toolCards.forEach(card => {

        const name =
            (
                card.dataset.name ||
                card.querySelector("h3")?.textContent ||
                ""
            )
            .toLowerCase();


        const category =
            card.dataset.category || "all";


        const matchesSearch =
            name.includes(query);


        const matchesFilter =
            currentFilter === "all" ||
            category === currentFilter;


        const shouldShow =
            matchesSearch &&
            matchesFilter;


        card.style.display =
            shouldShow
                ? "flex"
                : "none";


        if (shouldShow) {
            visibleCount++;
        }

    });


    if (resultsCount) {

        resultsCount.textContent =
            `${visibleCount} tools available`;

    }


    if (noResults) {

        noResults.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }

}


/* =========================================================
   SEARCH INPUT
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        updateTools
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                updateTools();

            }

        }
    );

}


/* =========================================================
   SEARCH BUTTON
========================================================= */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        updateTools
    );

}


/* =========================================================
   FILTER BUTTONS
========================================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        currentFilter =
            button.dataset.filter || "all";


        updateTools();

    });

});


/* =========================================================
   POPULAR SEARCH
========================================================= */

document
    .querySelectorAll("[data-search]")
    .forEach(button => {

        button.addEventListener("click", () => {

            if (!searchInput) return;


            searchInput.value =
                button.dataset.search || "";


            currentFilter = "all";


            filterButtons.forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn.dataset.filter === "all"
                );

            });


            updateTools();


            const toolsSection =
                document.getElementById("tools");


            if (toolsSection) {

                toolsSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });


/* =========================================================
   RESET SEARCH
========================================================= */

if (resetSearch) {

    resetSearch.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchInput.value = "";

            }


            currentFilter = "all";


            filterButtons.forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn.dataset.filter === "all"
                );

            });


            updateTools();

        }
    );

}


/* =========================================================
   TOOL MODAL REMOVED
=========================================================

   IMPORTANT:

   Old TOOL INFORMATION modal system has been removed.

   Tools will now open normally through their
   <a href="..."> links.

   Example:

   <a href="tools/exam-countdown.html"
      class="tool-card">

========================================================= */


/* =========================================================
   LIGHT / DARK MODE
========================================================= */

function setTheme(theme) {

    const isDark =
        theme === "dark";


    document.body.classList.toggle(
        "dark-mode",
        isDark
    );


    if (themeBtn) {

        themeBtn.innerHTML = isDark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';


        themeBtn.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

    }


    localStorage.setItem(
        "theme",
        isDark
            ? "dark"
            : "light"
    );

}


/* =========================================================
   LOAD SAVED THEME
========================================================= */

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    setTheme("dark");

} else {

    setTheme("light");

}


/* =========================================================
   THEME BUTTON
========================================================= */

if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {

            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            setTheme(
                isDark
                    ? "light"
                    : "dark"
            );

        }
    );

}


/* =========================================================
   KEYBOARD SEARCH
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const isShortcut =
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k";


        if (isShortcut) {

            event.preventDefault();


            if (searchInput) {

                searchInput.focus();

            }

        }

    }
);


/* =========================================================
   FOOTER YEAR
========================================================= */

const yearElement =
    document.getElementById("year");


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   INITIAL LOAD
========================================================= */

updateTools();