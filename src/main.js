import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchPhotos } from './js/pixabay-api';
import { renderPhotos } from './js/render-functions';

const fetchPicturesForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const userInput = document.querySelector('input');
const containerDiv = document.querySelector('.container');
const loadMoreBtn = document.querySelector('.btn-load');

let page = 1;
let per_page = 15;
let userQuery;
const showLoader = () => {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  containerDiv.append(loader);
};

const hideLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
};

const showLoadMoreButton = () => {
  loadMoreBtn.style.display = 'block';
};

const hideLoadMoreButton = () => {
  loadMoreBtn.style.display = 'none';
};

function shouldHideLoadMoreButton(loadedImagesCount, totalImagesCount) {
  return loadedImagesCount >= totalImagesCount;
}

const options = {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
};

fetchPicturesForm.addEventListener('submit', async e => {
  showLoader();
  page = 1;
  e.preventDefault();
  gallery.innerHTML = '';
  userQuery = userInput.value;

  try {
    const photos = await fetchPhotos(userQuery, page, per_page);
    renderPhotos(photos, gallery, options);
    fetchPicturesForm.reset();
    hideLoader();
    showLoadMoreButton();

    if (photos.hits.length === 0) {
      iziToast.error({
        title: '',
        backgroundColor: '#EF4040',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });

      const galleryElement = document.querySelector('.gallery');
      if (galleryElement && galleryElement.firstElementChild) {
        const { height: cardHeight } =
          galleryElement.firstElementChild.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
    }
    if (shouldHideLoadMoreButton(gallery.children.length, photos.totalHits)) {
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
    hideLoadMoreButton();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  showLoader();
  try {
    page += 1;
    const photos = await fetchPhotos(userQuery, page, per_page);
    renderPhotos(photos, gallery);
    hideLoader();

    const galleryElement = document.querySelector('.gallery');
    if (galleryElement && galleryElement.firstElementChild) {
      const { height: cardHeight } =
        galleryElement.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (gallery.children.length >= photos.totalHits) {
      iziToast.warning({
        title: '',
        message:
          'We are sorry, but you have reached the end of search results.',
      });
      hideLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
    hideLoader();
    hideLoadMoreButton();
  }
});
