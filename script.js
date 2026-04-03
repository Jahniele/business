function playMovie(name) {
  const movies = document.querySelectorAll('.movie');
  movies.forEach(movie => {
    movie.style.display = 'none';
  });
  const selectedMovie = Array.from(movies).find(movie => movie.textContent === name);
  if (selectedMovie) {
    selectedMovie.style.display = 'block';
  }
}