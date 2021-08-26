"use strict";

function clearAll() {
    localStorage.clear();
    goTo("index");
}

function logout() {
    location.href = `${getSrcPath()}/index.html`;
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("temporaryTopNews");
}

const jsonUsers = localStorage.getItem("usersDB");
const loggedIn = localStorage.getItem("loggedIn");
let users = [];

try {
    users = jsonUsers ? JSON.parse(jsonUsers) : [];
} catch (e) {
    clearAll();
}

if (!Array.isArray(users)) {
    clearAll();
} else if (!window.location.href.endsWith("/index.html")) {
    if (users.length === 0 || !loggedIn || !users.find(user => [user.email, user.username].includes(loggedIn))) {
        logout();
    }
} else if (users.find(user => [user.email, user.username].includes(loggedIn))) {
    location.href = `${getSrcPath()}/topNews.html`;
}