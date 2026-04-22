"use strict";

(() => {
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");
    const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
    const sections = Array.from(document.querySelectorAll("main section[id]"));

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