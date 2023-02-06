import { fetchImages } from '../js/fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const input = document.querySelector('.search-form__input');
const searchFormBtn = document.querySelector('.search-form__button');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

loadMoreBtn.style.display = 'none';
let pageNumber = 1;

searchFormBtn.addEventListener('click', evt => {
  evt.preventDefault();
  clearImgsList();
  const trimValue = input.value.trim();
  if (trimValue !== '') {
    fetchImages(trimValue, pageNumber).then(findedData => {
      if (findedData.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtn.style.display = 'none';
      }
      else {
        imagesListMaker(findedData.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${findedData.totalHits} images.`
        );
        if (findedData.hits.length > 27) {
          loadMoreBtn.style.display = 'block';
        }
        lightbox.refresh();
      }
    });
  }
});

loadMoreBtn.addEventListener('click', (evt) => {
  pageNumber += 1;
  evt.preventDefault();
  const trimValue = input.value.trim();
  fetchImages(trimValue, pageNumber).then(findedData => {
    if (findedData.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      imagesListMaker(findedData.hits);
      loadMoreBtn.style.display = 'block';
      lightbox.refresh();
    }
  });
});

function imagesListMaker(imgs) {
  const imgsMarkup = imgs
    .map(img => {
      return `<a class="gallery__link" href="${img.largeImageURL}">
            <div class="photo-card">
    <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" /> </div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${img.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${img.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${img.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${img.downloads}
    </p>
</div></a>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', imgsMarkup);
}

function clearImgsList() {
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMoreBtn.style.display = 'none';
}

