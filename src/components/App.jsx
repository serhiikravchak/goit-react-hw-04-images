import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { LoadMore } from './LoadMore/LoadMore';
import { Toaster } from 'react-hot-toast';
import { repeatRequest, emptyRequest } from 'services/Toasts';
import { GalleryLoader, ButtonLoader } from 'services/Loader';
import * as PixabayApi from 'services/PixabayApi';
import { Wrapper, Title, Load } from './App.styled';


export function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    async function fetchImages() {
      try {
        setIsLoading(true);

        const images = await PixabayApi.axiosImages(searchQuery);
        if (images.totalHits > PixabayApi.perPage) {
          setShowLoadMore(true);
        }

        if (page + 1 > Math.ceil(images.totalHits / PixabayApi.perPage)) {
          setIsLoading(false);
          setShowLoadMore(false);
        }

        if (images.total === 0) {
          repeatRequest();
          setIsLoading(false);
          return;
        }

        setImages(prevState => [...prevState, ...images.hits]);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    }
    fetchImages();
  }, [page, searchQuery]);

  const formSubmit = async keyword => {
    if (keyword === '') {
      emptyRequest();
      return;
    }
    setPage(1);
    setSearchQuery(keyword);
    setImages([]);

    if (searchQuery === keyword && page === 1) {
      try {
        setIsLoading(true);

        const images = await PixabayApi.axiosImages(searchQuery);
        setImages([...images.hits]);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        isLoading(false);
      }
    }
  };

  const toggleModal = () => {
    setShowModal(showModal => !showModal);
  };

  const clickLoadMore = () => {
    setIsLoading(true);
    setPage(page => page + 1);
    console.log(page)
  };


  const handlerLargeImage = (largeImageURL, tags) => {
    toggleModal();
    setSelectedImage({ largeImageURL, tags });
  };

  return (
      <>
        <Wrapper>
          <Searchbar onSubmit={formSubmit} />
          {images.length === 0 ?
          <Title>Make a request to display images</Title>
            : <Title>The result of your request "{searchQuery}"</Title>
          }
          {isLoading && <Load>{GalleryLoader}</Load>}
          <Title style={{ color: 'red' }}>{error}</Title>
          <ImageGallery images={images} onSelect={handlerLargeImage} />
          {showLoadMore &&
            <LoadMore
              onClick={clickLoadMore}
              children={isLoading ? ButtonLoader : 'Load more'}
            />
          }
          <Toaster />
        </Wrapper>
        {showModal && (
          <Modal
            onClose={toggleModal}
            link={selectedImage.largeImageURL}
            tags={selectedImage.tags}
          />
        )}
      </>
    );


}

