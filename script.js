const API_KEY = "api_key=7c1be07eb15d082f585c8c039f3ca132";
const BASE_URL = "https://api.themoviedb.org/3/";
const API_URL = BASE_URL + "trending/movie/day?language=en-US&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500"; //url for images

const main = document.getElementById('main');

getMovies(API_URL); //calling the function that fetches the movie api data

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //fetch the data from the api
      console.log(data.results);
      showMovies(data.results);
    });
}

function showMovies(data) {
    //before looping, set the text to blank
    main.innerHTML = '';

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie; //desired extracted data
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `     
          <img src="${IMG_URL+poster_path}"
          alt="${title}">
          <div class="movie-info">
            <h3>${title}</h3>
            <h4>${vote_average}</h4>
          </div>

          <div class="overview">
            <h3>Overview</h3>
            ${overview}         
             </div>
        `

        main.appendChild(movieEl);
  });
}
