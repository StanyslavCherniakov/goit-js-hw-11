import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.gallery.addEventListener('click', e => {
  e.preventDefault();
});

let page = 1;

function onSubmit(e) {
  e.preventDefault();
  const val = refs.form.elements.searchQuery.value;
  refs.loadMoreBtn.hidden = false;
  refs.gallery.innerHTML = '';
  getData(val).then(data => {
    page = 1;
    Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
    makeMurkUp(data.data.hits);
    lightbox.refresh();
  });
}

function onLoadMoreClick() {
  page += 1;
  const val = refs.form.elements.searchQuery.value;
  getData(val).then(data => {
    return makeMurkUp(data.data.hits);
  });
}

async function getData(data) {
  const apiData = await axios.get(
    `https://pixabay.com/api/?key=30789438-6b548ae820f8dbd510a71ac78&q=${data}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  return apiData;
}

function makeMurkUp(data) {
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
