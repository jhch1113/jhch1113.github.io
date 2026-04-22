"use strict";

(() => {
    const root = document.documentElement;
    const header = document.querySelector(".site-header");
    const themeToggle = document.querySelector(".theme-toggle");
    const themeToggleText = document.querySelector(".theme-toggle-text");
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");
    const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
    const sections = Array.from(document.querySelectorAll("main section[id]"));

    const THEME_KEY = "jhch1113-theme";

    const applyTheme = (theme) => {
        root.setAttribute("data-theme", theme);
        if (!themeToggle || !themeToggleText) {
            return;
        }
        const isDark = theme === "dark";
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggleText.textContent = isDark ? "Light Mode" : "Dark Mode";
    };

    const getInitialTheme = () => {
        const saved = window.localStorage.getItem(THEME_KEY);
        if (saved === "light" || saved === "dark") {
            return saved;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    applyTheme(getInitialTheme());

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
            const next = current === "dark" ? "light" : "dark";
            applyTheme(next);
            window.localStorage.setItem(THEME_KEY, next);
        });
    }

    const setHeaderState = () => {
        if (!header) {
            return;
        }
        header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    const closeMenu = () => {
        if (!menuToggle || !siteNav) {
            return;
        }
        menuToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
    };

    if (menuToggle && siteNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            siteNav.classList.toggle("is-open", !isOpen);
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof Element)) {
                return;
            }
            if (!siteNav.contains(target) && !menuToggle.contains(target)) {
                closeMenu();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();

    const yearNode = document.getElementById("current-year");
    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
    };

    if ("IntersectionObserver" in window && sections.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.id);
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: "-45% 0px -48% 0px"
            }
        );

        sections.forEach((section) => observer.observe(section));
    }
})();