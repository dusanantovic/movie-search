"use strict";

function updateProfile() {
    setErrorMessage("");
    if (!isUserValid()) {
        return false;
    }
    const currentUser = getCurrentUser();
    const password = document.getElementById("password").value;
    if (currentUser.password !== password) {
        if (!repeatPasswordValidation()) {
            return false;
        }
        const repeatPassword = document.getElementById("repeat-password").value;
        if (password !== repeatPassword) {
            return setErrorMessage("Passwords do not match");
        }
    }
    const jsonUsers = localStorage.getItem("usersDB");
    let users = JSON.parse(jsonUsers);
    users = users.filter(user => user.email !== currentUser.email || user.username !== currentUser.username);
    const usedMessage = isFieldsInUsed(users);
    if (usedMessage) {
        return setErrorMessage(usedMessage);
    }
    const email = document.getElementById("email").value;
    updateUser({
        email,
        username: document.getElementById("username").value,
        phone: document.getElementById("phone").value || "",
        password: document.getElementById("password").value
    });
    localStorage.setItem("loggedIn", email);
    return false;
}

function deleteAccount() {
    if (confirm("Are your sure you want to delete your account?")) {
        const jsonUsers = localStorage.getItem("usersDB");
        const loggedIn = localStorage.getItem("loggedIn");
        const users = jsonUsers ? JSON.parse(jsonUsers) : [];
        const newUsers = users.filter(user => ![user.email, user.username].includes(loggedIn));
        localStorage.setItem("usersDB", JSON.stringify(newUsers));
        logout();
    }
}

function showHideRepeatPassword() {
    const currentUser = getCurrentUser();
    const password = document.getElementById("password").value;
    if (password === currentUser.password) {
        setInputErrorMessage("", "repeat-password");
        showOrHideElementById("repeat-password-label", "hide");
        showOrHideElementById("repeat-password", "hide");
    } else {
        showOrHideElementById("repeat-password-label", "show");
        showOrHideElementById("repeat-password", "show");
    }
}

function fillTheFields() {
    const currentUser = getCurrentUser();
    Object.keys(currentUser).forEach(key => {
        if (!["recentlyViewed", "sentEmails"].includes(key)) {
            document.getElementById(key).value = currentUser[key];
        }
    });
    showHideRepeatPassword();
}

function callPasswordValidation() {
    passwordValidation();
    showHideRepeatPassword();
}

function setErrorMessage(message) {
    const errorEl = document.getElementById("error-profile-container");
    errorEl.innerHTML = message;
    if (message) {
        errorEl.style.display = "block";
    } else {
        errorEl.style.display = "none";
    }
    return false;
}