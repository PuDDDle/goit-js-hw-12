import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function renderPhotos(data, gallery, options) {
  const markup = data.hits
    .map(data => {
      return `<li class="gallery-item"><a href="${data.largeImageURL}">
            <img class="gallery-image" src="${data.webformatURL}" alt="${data.tags}"></a>
            <p><b>Likes: </b>${data.likes}</p>
            <p><b>Views: </b>${data.views}</p>
            <p><b>Comments: </b>${data.comments}</p>
            <p><b>Downloads: </b>${data.downloads}</p>
            </li>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  new SimpleLightbox('.gallery a', options);
}
