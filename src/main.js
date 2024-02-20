import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const button = document.querySelector('.btn');

let search;

let page = 1;
let per_page = 15;
let totalPages;

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  search = e.target.elements.search.value;
  if (search === '') {
    return;
  }
  page = 1;
  gallery.innerHTML = '';
  loader.style.display = 'block';
  try {
    const data = await getSearchImg(search);
    renderImg(data.hits);
    totalPages = Math.ceil(data.totalHits / per_page);
    page += 1;
    loadMoreButtonShow();
    scroll();
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
  e.target.reset();
});

async function getSearchImg(search) {
  try {
    const searchParams = new URLSearchParams({
      key: '42475549-5790b83c0c5f71da4ba61553f',
      q: `${search}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: `${page}`,
      per_page: `${per_page}`,
    });
    axios.defaults.baseURL = 'https://pixabay.com';
    const response = await axios.get(`/api/?${searchParams}`);
    return response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
}
function templateImg(images) {
  return images
    .map(
      item =>
        `<li class="gallery-item">
      <a class="gallery-link" href="${item.largeImageURL}">
        <img
          class="gallery-image"
          src="${item.webformatURL}"
          alt="${item.tags}"
          width="360"
        />
      </a>
      <ul class="thumb-block">
        <li class="block">
          <h2 class="title">Likes</h2>
          <p class="amount">${item.likes}</p>
        </li>
        <li class="block">
          <h2 class="title">Views</h2>
          <p class="amount">${item.views}</p>
        </li>
        <li class="block">
          <h2 class="title">Comments</h2>
          <p class="amount">${item.comments}</p>
        </li>
        <li class="block">
          <h2 class="title">Downloads</h2>
          <p class="amount">${item.downloads}</p>
        </li>
      </ul>
    </li>`
    )
    .join('');
}

function renderImg(images) {
  if (images.length === 0) {
    return iziToast.error({
      title: 'Error',
      message:
        'Sorry, there are no images matching your search query. Please try again.',
      position: 'topCenter',
    });
  }
  const markup = templateImg(images);
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

button.addEventListener('click', async () => {
  if (page > totalPages) {
    button.style.display = 'none';
    return iziToast.error({
      position: 'topRight',
      message: "We're sorry, but you've reached the end of search results.",
    });
  }
  button.style.display = 'none';
  loader.style.display = 'block';
  try {
    const data = await getSearchImg(search);
    renderImg(data.hits);
    page += 1;
    loadMoreButtonShow();
  } catch (error) {
    console.error(error);
  }
});

function scroll() {
  if (page > 1) {
    const rect = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({
      top: rect.height * 2,
      left: 0,
      behavior: 'smooth',
    });
  }
}
function loadMoreButtonShow() {
  if (page > 1) {
    button.style.display = 'block';
  } else {
    button.style.display = 'none';
  }
}
