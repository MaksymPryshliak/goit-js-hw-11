export const fetchImages = async(query, pageNumber) => {
    return await fetch(
      `https://pixabay.com/api/?key=33396642-88ffcce956eb96348099fcd2e&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=27&page=${pageNumber}`
    )
      .then(async response => {
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new Error(response.status);
        }
        return await response.json();
      })
      .catch(error => {
        console.error(error);
      });
  };