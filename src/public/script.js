function graphql(query, variables = {}) {
    return fetch('/admin/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            variables,
            query,
        }),
    }).then(function (result) {
        return result.json();
    }).catch(console.error)
}

const GET_MOVIES = `
    query GetMovies {
      allMovies {
        title
        rating
        id
      }
    }
  `;

const ADD_MOVIE = `
    mutation AddMovie($title: String!, $rating: Int!) {
      createMovie(data: { title: $title, rating: $rating }) {
        title
        rating
        id
      }
    }
  `;

const REMOVE_MOVIE = `
    mutation RemoveMovie($id: ID!) {
      deleteMovie(id: $id) {
        title
        rating
        id
      }
    }
  `;

const DELETE_ICON = `<svg viewBox="0 0 14 16" class="delete-icon">
    <title>Delete this item</title>
    <path
      fillRule="evenodd"
      d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"
    />
  </svg>`;

function addMovie(event) {
    event.preventDefault();
    const form = event.target;
    // Find inputted data via 'add-item-movie' and 'add-item-rating' input elements
    const movie = form.elements['add-item-movie'];
    const rating = form.elements['add-item-rating'];

    if (movie && rating) {
        graphql(ADD_MOVIE, { title: movie.value, rating: Number(rating.value) }).then(fetchData);
    }

    // Clear the form
    form.reset();
}

function removeMovie(movie) {
    graphql(REMOVE_MOVIE, { id: movie.id }).then(fetchData);
}

function createMovieItem(movie) {
    // Create the remove button
    const removeItemButton = document.createElement('button');
    removeItemButton.classList.add('remove-item', 'js-remove-movie-button');
    removeItemButton.innerHTML = DELETE_ICON;
    // Attach an event to remove the movie
    removeItemButton.addEventListener('click', function () {
        removeMovie(movie);
    });

    // Create the list item
    const listItem = document.createElement('li');
    listItem.classList.add('list-item');
    // Add text to the listItem
    listItem.innerHTML = `Title: ${movie.title} -> Rating: ${movie.rating}/10`;
    // append the remove item button
    listItem.appendChild(removeItemButton);

    return listItem;
}

function createList(data) {
    // Create the list
    const list = document.createElement('ul');
    list.classList.add('list');
    data.allMovies.forEach(function (movie) {
        list.appendChild(createMovieItem(movie));
    });
    return list;
}

function fetchData() {
    graphql(GET_MOVIES)
        .then(function (result) {
            // Clear any existing elements from the list
            document.querySelector('.results').innerHTML = '';

            // Recreate the list and append it to the .results div
            const list = createList(result.data);
            document.querySelector('.results').appendChild(list);
        })
        .catch(function (error) {
            console.log(error);
            document.querySelector('.results').innerHTML = '<p>Error</p>';
        });
}

// Replace the script tag with the app
document.getElementById('movie-app').parentNode.innerHTML = `
  <div class="app">
    <h1 class="main-heading">Welcome to Keystone&nbsp;5!</h1>
    <p class="intro-text">
      Here's a simple demo app that lets you add/remove movie ratings. Create a few entries, then go
      check them out from your <a href="/admin">Keystone 5 Admin UI</a>!
    </p>
    <hr class="divider" />
    <div class="form-wrapper">
      <h2 class="app-heading">Add Movie</h2>
      <div>
        <form class="js-add-movie-form">
          <input required name="add-item-movie" placeholder="Add new movie" class="form-input add-item" />
          <input required name="add-item-rating" placeholder="Add rating" class="form-input add-item" />
          <input type="submit" value="Submit">
        </form>
      </div>
      <h2 class="app-heading">Movie List</h2>
      <div class="results">
        <p>Loading...</p>
      </div>
    </div>
  </div>`;

// Add event listener to the form
document.querySelector('.js-add-movie-form').addEventListener('submit', addMovie);
// Fetch the initial data
fetchData();
