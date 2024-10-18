const API_KEY = "api_key=7c1be07eb15d082f585c8c039f3ca132";
const BASE_URL = "https://api.themoviedb.org/3"; // Base URL for the TMDB API
const API_URL =
  BASE_URL +
  "/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc&" +
  API_KEY; //API endpoint for most popular movies
const IMG_URL = "https://image.tmdb.org/t/p/w500"; //URL for fetching images from TMDB
const searchURL = BASE_URL + "/search/movie?" + API_KEY; //API endpoint for searching movies
const RUNTIME = API_URL + "&with_runtime.lte=50";
const RELEASE2024 = API_URL + "&with_primary_release_date.gte=2024";
const RELEASE2023 = API_URL + "&with_primary_release_date.gte=2023";

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
]; // Array of genre objects from TMDB containing a genre id and a name

// Setting up DOM elements for main content area: main movie list, search and genre selection
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const shortfilmtagEl = document.getElementById("shorts");
const releaseYearTags = document.querySelectorAll(".release-tag");

var selectedGenre = []; // This will store the clicked genre id within an empty array

// Logic for the Short Film filter

document.addEventListener("DOMContentLoaded", () => {
  // An event listener to ensure the DOM is fully loaded first
  setGenre(); // Initiliases genre tags after the DOM is ready
  shortfilmtagEl.addEventListener("click", () => {
    // when the 'short films' button is clicked
    if (shortfilmtagEl.classList.contains("highlight")) {
      shortfilmtagEl.classList.remove("highlight"); // Remove highlight if already highlighted
      updateMoviesDisplay(); // Update movie display
    } else {
      shortfilmtagEl.classList.add("highlight"); // Or, if not selected, add the highlight class
      getMovies(RUNTIME); // and fetch short films with runtime <= 50 minutes
    }
    highlightSelectedGenres(); // Call the highlight function to ensure the short films button is highlighted
  });
});

// Logic for the Release Year filters
document.addEventListener("DOMContentLoaded", () => {
  //An event listener to ensure the DOM is fully loaded first
  releaseYearTags.forEach((yearTag) => {
    // Loop through each release year
    yearTag.addEventListener("click", () => {
      // once a year button is clicked
      if (yearTag.classList.contains("highlight")) {
        // Remove the highlight if already highlighted
        yearTag.classList.remove("highlight");
        updateMoviesDisplay(); // And update the movie display
      } else {
        // releaseYearTags.forEach( y => y.classList.remove("highlight"));
        yearTag.classList.add("highlight"); // Or, if not selected, add the highlight class
        const selectedYear = yearTag.getAttribute("data-year"); // fetch the "data-year" attribute to determine which year has been clicked

        if (selectedYear === "2023") {
          //if the selected year is 2023
          getMovies(RELEASE2023); // fetch movies marked '2023' from the RELEASE2023 API endpoint
        } else if (selectedYear === "2024") {
          // or if the selected year is 2024
          getMovies(RELEASE2024); // fetch movies marked '2024' from the RELEASE2024 API endpoint
        }
      }
      updateMoviesDisplay(); // and update the movie display

      highlightSelectedGenres(); // highglight the selected filter button
    });
  });
});

function setGenre() {
  // A function to set the genre tags
  tagsEl.innerHTML = "";

  genres.forEach((genre) => {
    //looping through the genres array

    var t = document.createElement("div");

    t.classList.add("tag"); // creating a tag class so I can style the genre tags
    t.id = genre.id; // assigning the genre id to the tag id
    t.innerText = genre.name; // display the genre name as the tag text

    t.addEventListener("click", () => {
      // A click event to handle selection/deselection of genre
      if (selectedGenre.includes(genre.id)) {
        selectedGenre = selectedGenre.filter((id) => id !== genre.id); // if the selected genre is  already selected, remove it from the list
      } else {
        selectedGenre.push(genre.id); // else add the genre to the selected list
      }

      updateMoviesDisplay(); //update the movie list with the selected genres
      highlightSelectedGenres(); //highlight the selected genre
    });

    tagsEl.append(t);
  });
}

function highlightSelectedGenres() {
  // A function to highlight the selected genre tags
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });

  if (selectedGenre.length != 0) {
    // if genres are selected, highlight them
    selectedGenre.forEach((id) => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add("highlight");
    });
  }
}

function updateMoviesDisplay() {
  // function to update the movie display based on the selected genres
  if (selectedGenre.length === 0) {
    // If no genres are selected, show the top-rated movies
    getMovies(API_URL);
  } else {
    // Otherwise, show movies based on selected genres
    const genreURL =
      API_URL + "&with_genres=" + encodeURI(selectedGenre.join(","));
    getMovies(genreURL);
  }
}

getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));

highlightSelectedGenres();
getMovies(API_URL); //calling the function that fetches the movie api data

function getMovies(url) {
  // a function to fetch movies from the API
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      main.innerHTML = ""; // Clear previous movie results
      showMovies(data.results); // display new movie results
    });
}

function showMovies(data) {
  // display movies on the page
  if (data.length === 0) {
    main.innerHTML = "<p>No movies found. Try looking for something else </p>"; // show this message if no movies are found
    return;
  }

  data.forEach((movie) => {
    // Creating and displaying each movie element
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `     

          <img src="${
            poster_path
              ? IMG_URL + poster_path // display movie poster if available
              : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5503fd01-2819-4ab8-9d25-4dfc9c9cfdfa/dgvfs5c-4c85279c-6a6a-4e64-acc9-4f178c81cb5f.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU1MDNmZDAxLTI4MTktNGFiOC05ZDI1LTRkZmM5YzljZmRmYVwvZGd2ZnM1Yy00Yzg1Mjc5Yy02YTZhLTRlNjQtYWNjOS00ZjE3OGM4MWNiNWYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Z8TxVZaFO2h-ZqpTfaVPIHi_EH9jA-qfu9TLs2Bjg7I" // or display placeholder image
          } "
          alt="${title || "No title available"}">
          <div class="movie-info">
            <h3>${title}</h3>
<span>${vote_average}</span> 
          </div>
 <div class="overview">
<h3>Overview</h3>
 ${overview}         
  </div>
        `;
    main.appendChild(movieEl);
  });
}

form.addEventListener("submit", (e) => {
  // Here's where the search form submission is handled
  e.preventDefault();

  const searchTerm = search.value; // assigns searchTerm to the search input value

  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm); // Fetch movies from the API based on search term
  } else {
    getMovies(API_URL); //display top-rated movies if there is no search term
  }
});
