let page = 1;
let searchBy = "";
let totalPages = 0;
let actionInProgress = false;
let movies = [];

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

function handleMovieContainer() {
    showOrHideElementById("pagination", "show");
    setPages();
    const template = document.getElementsByTagName("template")[0];
    const templateItem = template.content.querySelector("div");
    const movieEl = showOrHideElementById("movie-list-container", "show");
    movieEl.innerHTML = "";
    for (let i = 0; i < movies.length; i++) {
        const movieData = movies[i];
        const newNodeEl = document.importNode(templateItem, true);
        newNodeEl.getElementsByClassName("movie-title")[0].innerHTML = `${movieData.title}<br />${movieData.year}`;
        newNodeEl.getElementsByClassName("movie-image")[0].src = movieData.poster;
        newNodeEl.id = `movie-container-${i}`;
        newNodeEl.onclick = () => openMovieModal(movieData);
        movieEl.appendChild(newNodeEl);
        setTimeout(() => {
            const createdElement = document.getElementById(`movie-container-${i}`);
            createdElement.style.transitionDelay = `${(i + 1) * 0.3}s`;
            createdElement.style.opacity = 1;
        });
    }
}

function openMovieModal(movie) {
    showOrHideElementById("movie-modal", "show");
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
    if (movie.rating || movie.votes || movie.link) {
        showOrHideElementById("modal-footer", "show");
        if (movie.rating) {
            showOrHideElementById("modal-rating-container", "show");
            document.getElementById("modal-rating").innerHTML = movie.rating;
        }
        if (movie.votes) {
            showOrHideElementById("modal-votes-container", "show");
            document.getElementById("modal-votes").innerHTML = movie.votes;
        }
        if (movie.link) {
            showOrHideElementById("modal-link-container", "show");
            document.getElementById("modal-link").href = `https://www.imdb.com/title/${movie.link}`;
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
    movies = [];
    showOrHideElementById("pagination", "hide");
    showOrHideElementById("movie-list-container", "hide");
    showOrHideElementById("error-container", "hide");
    showOrHideElementById("loading", "show");
    axios.get(`https://www.omdbapi.com/?apikey=2725aed3&type=movie&plot=short&s=${searchBy}&page=${page}`)
        .then(async (response) => {
            let responseData = response.data;
            if (responseData.Error) {
                handleErrorContainer(responseData.Error);
            } else {
                totalPages = Math.ceil(responseData.totalResults / 10);
                for (let i = 0; i < responseData.Search.length; i++) {
                    const { Title, Poster, Year, imdbID } = responseData.Search[i];
                    const movieData = {
                        title: Title,
                        poster: Poster,
                        year: Year,
                        link: imdbID
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
                handleMovieContainer(movies);
            }
            showOrHideElementById("loading", "hide");
            actionInProgress = false;
        });
    return false;
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

document.addEventListener("mouseover", (event) => {
    if (event.target && event.target.id && event.target.id.includes("movie-container")) {
        document.getElementById(event.target.id).style.transitionDelay = "unset";
    }
});

function setNotfoundImage(event) {
    event.target.src = "./notfound.jpg";
}