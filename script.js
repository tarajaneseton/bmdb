const API_KEY = "api_key=7c1be07eb15d082f585c8c039f3ca132";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" +API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500"; //url for images
const searchURL = BASE_URL + 'search/movie?' + API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

const main = document.getElementById('main');
const form = document.getElementById('form')
const search = document.getElementById('search')
const tagsEl = document.getElementById('tags')

var selectedGenre = [] // store clicked genre within array
// set on page load
setGenre();
// takes the elements in the array, converts into
function setGenre() {
    tagsEl.innerhtml='';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
                }          
                console.log(selectedGenre)  
                // getMovies(API_KEY + '&with_genres='+(selectedGenre.join(',')))
                getMovies(API_URL + '&with_genres=' +encodeURI(selectedGenre.join(','))) //takes all the elemsents in the array, separates by comma and converts to string
                highlightSelection() 
        })
        tagsEl.append(t);
    })
    }

    function highlightSelection() {
      const tags = document.querySelectorAll('.tag')
      tags.forEach(tag => {
        tag.classList.remove('highlight')
      })
      if(selectedGenre.length !=0){
      selectedGenre.forEach(id => {
          const highlightedTag = document.getElementById(id);
          highlightedTag.classList.add('highlight');
      })
    }
  }

getMovies(API_URL); //calling the function that fetches the movie api data



function getMovies(url) {
  fetch(url).then(res => res.json()).then(data => {
      //fetch the data from the api
      showMovies(data.results);
    });
}

function showMovies(data) {
    //before looping, set the innerhtml as an ampty string, every time the function is called there is a blank state, and then each element is updated

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie; //desired extracted data
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `     
          <img src="${poster_path? IMG_URL+poster_path: "https://unsplash.com/photos/white-and-black-9-card-Qj-xTdGj9vk" } "
          alt="${title}">

          <div class="movie-info">
            <h3>${title}</h3>
<span>${vote_average}</span> 
            
            
       
          </div>

          <div class="overview">
            <h3>Overview</h3>
            ${overview}         
             </div>
        `

        main.appendChild(movieEl);
  });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm) {
        getMovies(searchURL + '&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

    })