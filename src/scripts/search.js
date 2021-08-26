"use strict";

// from recently-viewed.js

// createRecentlyViewed

const template = document.getElementsByTagName("template")[0];
const templateItem = template.content.querySelector("div");

let page = 1;
let searchBy = "";
let totalPages = 0;
let actionInProgress = false;

function handleSearchBy() {
    const searchEl = document.getElementById("search-by-input");
    searchBy = searchEl.value || "";
    page = 1;
}

function handlePages(isIncrease) {
    if (!actionInProgress && page <= totalPages) {
        if (isIncrease) {
            page += 1;
        } else {
            if (page < 1) {
                page = 1;
            } else {
                page -= 1;
            }
        }
        window.scrollTo({ top: 0 });
        setPages();
        getPopularMovieList();
    }
}

function setPages() {
    const currentPageEl = document.getElementById("pages");
    currentPageEl.innerHTML = `${page} of ${totalPages}`;
    if (page === 1) {
        showOrHideElementById("decrease", "hide");
    } else {
        showOrHideElementById("decrease", "show", "inline-block");
    }
    if (page === totalPages) {
        showOrHideElementById("increase", "hide");
    } else {
        showOrHideElementById("increase", "show", "inline-block");
    }
}

function handleErrorContainer(errorMessage) {
    showOrHideElementById("pagination", "hide");
    showOrHideElementById("movie-list-container", "hide");
    const errorEl = showOrHideElementById("error-container", "show");
    if (errorMessage === "Too many results.") {
        errorEl.innerHTML = "Refine your search";
    } else {
        errorEl.innerHTML = errorMessage;
    }
}

function getMovieCardElement(movieData) {
    const card = document.importNode(templateItem, true);
    card.getElementsByClassName("movie-title")[0].innerHTML = `${movieData.title}<br />${movieData.year}`;
    card.getElementsByClassName("movie-image")[0].src = movieData.poster;
    card.onclick = () => openMovieModal(movieData);
    return card;
}

function cardSetOpacity(cardEl, i) {
    setTimeout(() => {
        cardEl.style.opacity = 1;
        setTimeout(() => {
            cardEl.style.transitionDelay = "unset";
        }, (i + 1) * 0.3);
    });
}

function handleMovieContainer(movies) {
    showOrHideElementById("pagination", "show");
    setPages();
    const movieEl = showOrHideElementById("movie-list-container", "show");
    movieEl.innerHTML = "";
    for (let i = 0; i < movies.length; i++) {
        const cardEl = getMovieCardElement(movies[i]);
        cardEl.style.transitionDelay = `${(i + 1) * 0.3}s`;
        movieEl.appendChild(cardEl);
        cardSetOpacity(cardEl, i);
    }
}

function openMovieModal(movie) {
    const currentUser = getCurrentUser();
    if (!currentUser.recentlyViewed || !currentUser.recentlyViewed.find(viewedMovie => viewedMovie.id === movie.id)) {
        if (currentUser.recentlyViewed && currentUser.recentlyViewed.length === 10) {
            currentUser.recentlyViewed.pop();
        }
        const recentlyViewed = currentUser.recentlyViewed ? [movie, ...currentUser.recentlyViewed] : [movie];
        updateUser({ recentlyViewed });
        fulfillRecentlyViewed();
    }
    showOrHideElementById("movie-modal", "show", "flex");
    document.getElementById("modal-title").innerHTML = movie.title;
    if (movie.released) {
        showOrHideElementById("modal-released-container", "show");
        document.getElementById("modal-released").innerHTML = movie.released;
    }
    if (movie.runtime) {
        showOrHideElementById("modal-runtime-container", "show");
        document.getElementById("modal-runtime").innerHTML = movie.runtime;
    }
    if (movie.writer) {
        showOrHideElementById("modal-writer-container", "show");
        document.getElementById("modal-writer").innerHTML = movie.writer;
    }
    if (movie.actors) {
        showOrHideElementById("modal-actors-container", "show");
        document.getElementById("modal-actors").innerHTML = movie.actors;
    }
    if (movie.country) {
        showOrHideElementById("modal-country-container", "show");
        document.getElementById("modal-country").innerHTML = movie.country;
    }
    if (movie.awards) {
        showOrHideElementById("modal-awards-container", "show");
        document.getElementById("modal-awards").innerHTML = movie.awards;
    }
    if (movie.boxOffice) {
        showOrHideElementById("modal-boxoffice-container", "show");
        document.getElementById("modal-boxoffice").innerHTML = movie.boxOffice;
    }
    if (movie.production) {
        showOrHideElementById("modal-production-container", "show");
        document.getElementById("modal-production").innerHTML = movie.production;
    }
    if (movie.plot) {
        showOrHideElementById("modal-plot-container", "show");
        document.getElementById("modal-plot").innerHTML = movie.plot;
    }
    showOrHideElementById("modal-footer", "show");
    showOrHideElementById("modal-link-container", "show");
    document.getElementById("modal-link").href = `https://www.imdb.com/title/${movie.id}`;
    if (movie.rating || movie.votes) {
        if (movie.rating) {
            showOrHideElementById("modal-rating-container", "show");
            document.getElementById("modal-rating").innerHTML = movie.rating;
        }
        if (movie.votes) {
            showOrHideElementById("modal-votes-container", "show");
            document.getElementById("modal-votes").innerHTML = movie.votes;
        }
    }
}

function closeModal() {
    document.getElementById("modal-title").innerHTML = "";
    document.getElementById("modal-released").innerHTML = "";
    document.getElementById("modal-runtime").innerHTML = "";
    document.getElementById("modal-writer").innerHTML = "";
    document.getElementById("modal-actors").innerHTML = "";
    document.getElementById("modal-country").innerHTML = "";
    document.getElementById("modal-awards").innerHTML = "";
    document.getElementById("modal-boxoffice").innerHTML = "";
    document.getElementById("modal-production").innerHTML = "";
    document.getElementById("modal-plot").innerHTML = "";
    document.getElementById("modal-rating").innerHTML = "";
    document.getElementById("modal-votes").innerHTML = "";
    document.getElementById("modal-link").href = "";
    showOrHideElementById("modal-released-container", "hide");
    showOrHideElementById("modal-runtime-container", "hide");
    showOrHideElementById("modal-writer-container", "hide");
    showOrHideElementById("modal-actors-container", "hide");
    showOrHideElementById("modal-country-container", "hide");
    showOrHideElementById("modal-awards-container", "hide");
    showOrHideElementById("modal-boxoffice-container", "hide");
    showOrHideElementById("modal-production-container", "hide");
    showOrHideElementById("modal-plot-container", "hide");
    showOrHideElementById("modal-rating-container", "hide");
    showOrHideElementById("modal-votes-container", "hide");
    showOrHideElementById("modal-link-container", "hide");
    showOrHideElementById("modal-footer", "hide");
    showOrHideElementById("movie-modal", "hide");
}

function getPopularMovieList() {
    if (!searchBy) {
        handleErrorContainer("Search field is required");
        return false;
    }
    if (actionInProgress) {
        return false;
    }
    actionInProgress = true;
    showOrHideElementById("pagination", "hide");
    showOrHideElementById("movie-list-container", "hide");
    showOrHideElementById("error-container", "hide");
    showOrHideElementById("loading", "show");
    axios.get(`https://www.omdbapi.com/?apikey=2725aed3&type=movie&plot=short&s=${searchBy}&page=${page}`)
        .then(async (response) => {
            let responseData = response.data;
            if (responseData.Error) {
                showOrHideElementById("loading", "hide");
                handleErrorContainer(responseData.Error);
            } else {
                const movies = [];
                totalPages = Math.ceil(responseData.totalResults / 10);
                for (let i = 0; i < responseData.Search.length; i++) {
                    const { Title, Poster, Year, imdbID } = responseData.Search[i];
                    const movieData = {
                        title: Title,
                        poster: Poster,
                        year: Year,
                        id: imdbID
                    };
                    const movieReponse = await axios.get(`https://www.omdbapi.com/?apikey=2725aed3&type=movie&plot=full&t=${encodeURIComponent(Title)}`)
                    if (!movieReponse.Error) {
                        const { Actors, Awards, BoxOffice, Country, Plot, Production, Released, Runtime, Writer, imdbRating, imdbVotes } = movieReponse.data;
                        movieData.actors = Actors !== "N/A" ? Actors : "";
                        movieData.awards = Awards !== "N/A" ? Awards : "";
                        movieData.boxOffice = BoxOffice !== "N/A" ? BoxOffice : "";
                        movieData.country = Country !== "N/A" ? Country : "";
                        movieData.plot = Plot !== "N/A" ? Plot : "";
                        movieData.production = Production !== "N/A" ? Production : "";
                        movieData.released = Released !== "N/A" ? Released : "";
                        movieData.runtime = Runtime !== "N/A" ? Runtime : "";
                        movieData.writer = Writer !== "N/A" ? Writer : "";
                        movieData.rating = imdbRating !== "N/A" ? imdbRating : "";
                        movieData.votes = imdbVotes !== "N/A" ? imdbVotes : "";
                    }
                    movies.push(movieData);
                }
                showOrHideElementById("loading", "hide");
                handleMovieContainer(movies);
            }
            actionInProgress = false;
        }).catch(e => {
            showOrHideElementById("loading", "hide");
            handleErrorContainer(e.message);
        });
    return false;
}

function setNotfoundImage(event) {
    event.target.src = `${getSrcPath()}/images/notfound.jpg`;
}