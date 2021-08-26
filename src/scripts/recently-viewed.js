"use strict";

// from search.js

// template
// templateItem
// getMovieCardElement

function showOrHideButtons(sliderContainerEl) {
    const childrens = sliderContainerEl.children;
    const firstElOffsetLeft = parseInt(childrens[0].style.left.replace("px", ""));
    const lastElOffsetLeft = parseInt(childrens[childrens.length - 1].style.left.replace("px", ""));
    if (sliderContainerEl.offsetWidth - lastElOffsetLeft >= 156) { // 180 width of #slider-list .movie-container minus 24 right margin
        showOrHideElementById("slider-button-next", "hide");
    } else {
        showOrHideElementById("slider-button-next", "show");
    }
    if (firstElOffsetLeft < 0) {
        showOrHideElementById("slider-button-prev", "show");
    } else {
        showOrHideElementById("slider-button-prev", "hide");
    }
}

function fulfillRecentlyViewed() {
    const currentUser = getCurrentUser();
    if (currentUser.recentlyViewed) {
        const recentlyViewedSliderEl = document.getElementById("recently-viewed-slider");
        const sliderContainerEl = document.getElementById("slider-list");
        sliderContainerEl.innerHTML = "";
        for (let i = 0; i < currentUser.recentlyViewed.length; i++) {
            const movie = currentUser.recentlyViewed[i];
            const cardEl = getMovieCardElement(movie);
            sliderContainerEl.appendChild(cardEl);
        }
        const recentlyViewedContainerEl = showOrHideElementById("recently-viewed-container", "show");
        let titleMax = 0;
        for (let i = 0; i < sliderContainerEl.children.length; i++) {
            const cardElement = sliderContainerEl.children[i];
            const title = cardElement.children[0];
            if (titleMax < title.offsetHeight) {
                titleMax = title.offsetHeight;
            }
            cardElement.style.left = `${(i * 180) + (i * 24)}`; // 180 width of #slider-list .movie-container
        }
        recentlyViewedSliderEl.style.height = `${titleMax + 12 + 200}`; // 12 is margin-bottom and 200 is height of image
        showOrHideButtons(sliderContainerEl);
        recentlyViewedContainerEl.style.opacity = 1;
    }
}

function handleMove(move) {
    const sliderContainerEl = document.getElementById("slider-list");
    for (let i = 0; i < sliderContainerEl.children.length; i++) {
        const cardElement = sliderContainerEl.children[i];
        const cardElementLeft = parseInt(cardElement.style.left.replace("px", ""));
        if (move === -1) {
            cardElement.style.left = `${cardElementLeft + 180 + 24}px`; // 180 width of #slider-list .movie-container
        } else {
            cardElement.style.left = `${cardElementLeft - 180 - 24}px`; // 180 width of #slider-list .movie-container
        }
    }
    showOrHideButtons(sliderContainerEl);
}

setTimeout(() => {
    fulfillRecentlyViewed();
    window.addEventListener("resize", () => {
        const currentUser = getCurrentUser();
        if (currentUser.recentlyViewed) {
            const sliderContainerEl = document.getElementById("slider-list");
            showOrHideButtons(sliderContainerEl);
        }
    });
}, 1500); // show recently viewed after searach animation