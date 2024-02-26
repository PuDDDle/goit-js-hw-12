import axios from 'axios';

export async function fetchPhotos(userQuery, page, perPage) {
  const params = new URLSearchParams({
    page: page,
    per_page: perPage,
  });
  const apiKey = '10232217-e697c3d56777d20dc0cbe8fb5';
  const query = userQuery;
  const response = await axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}
