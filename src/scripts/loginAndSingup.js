"use strict";

function login() {
    setErrorMessage("", "login");
    const usernameOrEmail = document.getElementById("email-or-username").value;
    const password = document.getElementById("password-login").value;
    if (!usernameOrEmail) {
        return setErrorMessage("Please enter your email or username", "login");
    }
    if (!password) {
        return setErrorMessage("Please enter your password", "login");
    }
    const jsonUsers = localStorage.getItem("usersDB");
    const users = jsonUsers ? JSON.parse(jsonUsers) : [];
    const userExists = users.find(user => [user.email, user.username].includes(usernameOrEmail) && user.password === password);
    if (!userExists) {
        return setErrorMessage("User not found", "login");
    }
    localStorage.setItem("loggedIn", usernameOrEmail);
    location.href = `${getSrcPath()}/topNews.html`;
    return false;
}

function switchScreens() {
    const loginContainer = document.getElementById("login-container");
    const signupContainer = document.getElementById("signup-container");
    if (loginContainer.style.display === "none") {
        loginContainer.style.display = "block";
        signupContainer.style.display = "none";
    } else {
        signupContainer.style.display = "block";
        loginContainer.style.display = "none";
    }
    setErrorMessage("", "login");
    setErrorMessage("", "signup");
}

function goToSignupTop() {
    const signupEl = document.getElementById("signup-container");
    signupEl.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function signup() {
    setErrorMessage("", "signup");
    if (!isUserValid()) {
        goToSignupTop();
        return false;
    }
    if (!repeatPasswordValidation()) {
        goToSignupTop();
        return false;
    }
    const repeatPassword = document.getElementById("repeat-password").value;
    const newPassword = document.getElementById("password").value;
    if (newPassword !== repeatPassword) {
        goToSignupTop();
        return setErrorMessage("Passwords do not match", "signup");
    }
    const usedMessage = isFieldsInUsed();
    if (usedMessage) {
        goToSignupTop();
        return setErrorMessage(usedMessage, "signup");
    }
    addUser({
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        phone: document.getElementById("phone").value,
        password: newPassword
    });
    switchScreens();
    return false;
}

function setErrorMessage(message, type) {
    const errorEl = document.getElementById(`error-${type}-container`);
    errorEl.innerHTML = message;
    if (message) {
        errorEl.style.display = "block";
    } else {
        errorEl.style.display = "none";
    }
    return false;
}