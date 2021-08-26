"use strict";

function createNews(items) {
    const newsEl = document.getElementById("news-list-container");
    const template = document.getElementsByTagName("template")[0];
    const templateItem = template.content.querySelector("div");
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const newNodeEl = document.importNode(templateItem, true);
        newNodeEl.getElementsByClassName("news-title")[0].innerHTML = item.head;
        newNodeEl.getElementsByClassName("news-image")[0].src = item.image.url;
        newNodeEl.getElementsByClassName("news-published")[0].innerHTML = moment(item.publishDateTime).format("YYYY/MM/DD h:mm A");
        newNodeEl.getElementsByClassName("news-description")[0].innerHTML = item.body;
        newNodeEl.getElementsByClassName("news-link")[0].href = item.link;
        newNodeEl.getElementsByClassName("news-link")[0].innerHTML = "Read more...";
        newNodeEl.id = `news-container-${i}`;
        newsEl.appendChild(newNodeEl);
        setTimeout(() => {
            const createdElement = document.getElementById(`news-container-${i}`);
            createdElement.style.transitionDelay = `${(i + 1) * 0.3}s`;
            createdElement.style.opacity = 1;
        });
    }
}

showOrHideElementById("loading", "show");

const jsonTopNews = localStorage.getItem("temporaryTopNews");
const topNews = jsonTopNews ? JSON.parse(jsonTopNews) : {};

if (Object.keys(topNews).length === 0 || topNews.items.length === 0 || topNews.created !== moment(new Date()).format("YYYY/MM/DD h A")) {
    localStorage.removeItem("temporaryTopNews");
    axios.request({
        method: "GET",
        url: "https://imdb8.p.rapidapi.com/title/get-news",
        params: { tconst: "tt0944947", limit: "25" },
        headers: {
            "x-rapidapi-key": "87f933e2damshd03194bda2c8fe3p12fe4ajsnc6631901e826",
            "x-rapidapi-host": "imdb8.p.rapidapi.com"
        }
    }).then(function (response) {
        showOrHideElementById("loading", "hide");
        const items = response.data && response.data.items || [];
        if (items.length > 0) {
            const topNews = {
                created: moment(new Date()).format("YYYY/MM/DD h A"),
                items
            };
            localStorage.setItem("temporaryTopNews", JSON.stringify(topNews));
            createNews(items);
        }
    }).catch(function (error) {
        showOrHideElementById("loading", "hide");
        console.error(error);
    });
} else {
    showOrHideElementById("loading", "hide");
    createNews(topNews.items);
}