"use strict";

function emailValidation() {
    const email = document.getElementById("email").value;
    if (!email || !email.trim()) {
        return setInputErrorMessage("Email is requried", "email");
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        return setInputErrorMessage("Email format is not valid", "email");
    }
    setInputErrorMessage("", "email");
    return true;
}

function usernameValidation() {
    const username = document.getElementById("username").value;
    if (!username || !username.trim()) {
        return setInputErrorMessage("Username is requried", "username");
    }
    const usernameRegex = /^\S{8,}$/;
    if (!usernameRegex.test(username)) {
        return setInputErrorMessage("Username must contain at least eight characters without spaces", "username");
    }
    setInputErrorMessage("", "username");
    return true;
}

function phoneValidation() {
    setInputErrorMessage("", "phone");
    const phone = document.getElementById("phone").value;
    if (phone) {
        const phoneRegex = /^06[0-9]\/(([0-9]{2}-){2})([0-9]{3})$/;
        if (!phoneRegex.test(phone)) {
            return setInputErrorMessage(`Phone number format is not valid ("06X/XX-XX-XXX")`, "phone");
        }
    }
    return true;
}

function passwordValidation() {
    const password = document.getElementById("password").value;
    const repeatPasswordEl = document.getElementById("repeat-password");
    if (!password) {
        repeatPasswordEl.disabled = true;
        return setInputErrorMessage("Password is requried", "password");
    } else {
        repeatPasswordEl.disabled = false;
    }
    const passwordRegex = /^(?=.{0,}[A-Z])(?=.{0,}[0-9])(?=.{0,}[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return setInputErrorMessage("Password must contain at least eight characters, one capital letter, one digit, and one sign", "password");
    }
    setInputErrorMessage("", "password");
    return true;
}

function repeatPasswordValidation() {
    const repeatPassword = document.getElementById("repeat-password").value;
    if (!repeatPassword) {
        return setInputErrorMessage("Repeat password is required", "repeat-password");
    }
    setInputErrorMessage("", "repeat-password");
    return true;
}

function isUserValid() {
    const inputErrors = [emailValidation(), usernameValidation(), phoneValidation(), passwordValidation()].filter(x => x === false);
    if (inputErrors.length > 0) {
        return false;
    }
    return true;
}

function isFieldsInUsed(users) {
    if (!users) {
        const jsonUsers = localStorage.getItem("usersDB");
        users = jsonUsers ? JSON.parse(jsonUsers) : [];
    }
    if (users.find(user => user.email && user.email.toLowerCase() === document.getElementById("email").value.toLowerCase())) {
        return "Email is already taken";
    }
    if (users.find(user => user.username && user.username.toLowerCase() === document.getElementById("username").value.toLowerCase())) {
        return "Username is already taken";
    }
    if (users.find(user => user.phone === document.getElementById("phone").value)) {
        return "Phone is already taken";
    }
    return "";
}