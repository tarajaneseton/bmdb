const API_KEY = "api_key=7c1be07eb15d082f585c8c039f3ca132";
const BASE_URL = "https://api.themoviedb.org/3"; // Base URL for the TMDB API
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY; //API endpoint for most popular movies
const IMG_URL = "https://image.tmdb.org/t/p/w500"; //URL for fetching images from TMDB
const searchURL = BASE_URL + "/search/movie?" + API_KEY; //API endpoint for searching movies

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

var selectedGenre = []; // This will store the clicked genre id within an empty array

document.addEventListener("DOMContentLoaded", () => {
  // An event listener for when the DOM is fully loaded
  setGenre(); // Initiliases genre tags after the DOM is ready
});

function setGenre() {
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

// tagsEl.append(t); - presenting errors so ive commented it out for

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
              : "https://unsplash.com/photos/white-and-black-9-card-Qj-xTdGj9vk" // or display placeholder image
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
