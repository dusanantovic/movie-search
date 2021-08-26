const headerEl = document.getElementById("header");
if (window.location.href.endsWith("/index.html")) {
    headerEl.innerHTML = `
        <div id="header-welcome-container">
            <div id="header-welcome">Welcome to movie tracker! <br /> Please login or signup if you don't have account.</div>
        </div>
    `;
    headerEl.style.borderBottom = "unset";
} else {
    headerEl.innerHTML = `
        <div id="header-container">
            <div id="mobile-header-selected">Top News</div>
            <ul id="header-list">
                <li id="header-topNews" class="header-list-item header-selected-list-item" onclick="goTo('topNews')">
                    <span>Top News</span>
                </li>
                <li id="header-search" class="header-list-item" onclick="goTo('search')">
                    <span>Search</span>
                </li>
                <li id="header-profile" class="header-list-item" onclick="goTo('profile')">
                    <span>Profile</span>
                </li>
                <li id="header-about" class="header-list-item" onclick="goTo('about')">
                    <span>About</span>
                </li>
                <li id="header-logout" class="header-list-item" onclick="logout()">
                    <span>Logout</span>
                </li>
            </ul>
        </div>
    `;
}

if (!window.location.href.endsWith("/index.html")) {
    const headerListEl = document.getElementById("header-list");
    const url = window.location.href;
    const routes = ["/search.html", "/profile.html", "/about.html"];
    const mobileHeaderSelectEl = document.getElementById("mobile-header-selected");
    
    function changeSelected(selected) {
        for (let i = 0; i < headerListEl.children.length; i++) {
            const listEl = headerListEl.children[i];
            listEl.classList.remove("header-selected-list-item");
            if (listEl.id === `header-${selected}`) {
                listEl.classList.add("header-selected-list-item");
            }
        }
    }

    mobileHeaderSelectEl.addEventListener("click", () => {
        if (headerListEl.classList.contains("header-expand")) {
            headerListEl.classList.remove("header-expand");
        } else {
            headerListEl.classList.add("header-expand");
        }
    });

    document.addEventListener("click", (e) => {
        if (e.target.id !== "mobile-header-selected") {
            headerListEl.classList.remove("header-expand");
        }
    });

    for (let i = 0; i < routes.length; i++) {
        if (url.includes(routes[i])) {
            const route = routes[i].replace("/", "").replace(".html", "");
            changeSelected(route);
            mobileHeaderSelectEl.innerHTML = `${route.substr(0, 1).toUpperCase()}${route.substr(1, route.length)}`;
            break;
        }
    }
}