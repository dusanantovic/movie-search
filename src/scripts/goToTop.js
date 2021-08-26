const goToTopButton = document.getElementById("go-to-top");

document.addEventListener("scroll", () => {
    if (window.scrollY - 100 > window.innerHeight) {
        goToTopButton.style.opacity = 1;
    } else {
        goToTopButton.style.opacity = 0;
    }
});

goToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});