import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSubmit);
refs.gallery.addEventListener('click', e => {
  e.preventDefault();
});

let page = 1;

function onSubmit(e) {
  e.preventDefault();
  const val = refs.form.elements.searchQuery.value;
  refs.gallery.innerHTML = '';
  getData(val).then(data => {
    page = 1;
    Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
    makeMarkUp(data.data.hits);
    lightbox.refresh();
    observer.observe(refs.gallery.lastElementChild);
  });
}

async function getData(data) {
  return (apiData = await axios.get(
    `https://pixabay.com/api/?key=30789438-6b548ae820f8dbd510a71ac78&q=${data}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  ));
}

function makeMarkUp(data) {
  const markUp = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a href = ${largeImageURL}>
  <img src=${webformatURL} alt=${tags} loading="lazy" />
  
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </a>
</div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markUp);
}

let lightbox = new SimpleLightbox('.gallery a');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      const val = refs.form.elements.searchQuery.value;
      getData(val).then(data => {
        makeMarkUp(data.data.hits);
        lightbox.refresh();
        observer.observe(refs.gallery.lastElementChild);
      });
    }
  });
});
