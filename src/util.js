"use strict";

const getSrcPath = () => window.location.origin;

function goTo(to) {
    window.location.href = `${getSrcPath()}/${to}.html`;
}

function showOrHideElementById(elementName, action, showStyle = "") {
    const element = document.getElementById(elementName);
    if (action === "show") {
        element.style.display = showStyle || "block";
    } else if (action === "hide") {
        element.style.display = "none";
    }
    return element;
}

function setInputErrorMessage(message, type) {
    const errorEl = document.getElementById(`${type}-error`);
    errorEl.innerHTML = message;
    if (message) {
        errorEl.style.display = "block";
    } else {
        errorEl.style.display = "none";
    }
    return false;
}