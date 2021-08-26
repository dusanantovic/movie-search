function getCurrentUser() {
    const loggedIn = localStorage.getItem("loggedIn");
    const jsonUsers = localStorage.getItem("usersDB");
    const users = JSON.parse(jsonUsers);
    return users.find(user => [user.email, user.username].includes(loggedIn));
}

function updateUser(updateData) {
    const loggedIn = localStorage.getItem("loggedIn");
    const jsonUsers = localStorage.getItem("usersDB");
    const users = JSON.parse(jsonUsers);
    const user = users.find(user => [user.email, user.username].includes(loggedIn));
    Object.keys(updateData).forEach(key => {
        user[key] = updateData[key];
    });
    localStorage.setItem("usersDB", JSON.stringify(users));
}

function addUser(newUser) {
    const jsonUsers = localStorage.getItem("usersDB");
    if(jsonUsers) {
        const users = JSON.parse(jsonUsers);
        users.push(newUser);
        localStorage.setItem("usersDB", JSON.stringify(users));
    } else {
        localStorage.setItem("usersDB", JSON.stringify([newUser]));
    }
}