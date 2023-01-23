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

// const fetchPixabay = new PixabayApi();
// const fullAnswer = fetchPixabay.numberOfResponses();
export function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

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

// export class App extends Component {
//   state = {
//     page: 1,
//     searchQuery: '',
//     images: [],
//     error: false,
//     isLoading: false,
//     showModal: false,
//     selectedImage: null,
//     showLoadMore: false,
//     buttonLoader: false
//   };

//   async componentDidUpdate(_, prevState) {
//     const prevQuery = prevState.searchQuery
//     const newQuery = this.state.searchQuery;

//     const prevPage = prevState.page;
//     const nextPage = this.state.page;

//     if (prevPage !== nextPage || prevQuery !== newQuery) {
//   try {
//     this.setState({ isLoading: true });

//     const images = await PixabayApi.axiosImages(newQuery);
//     if (images.totalHits > PixabayApi.perPage) {
//       this.setState({ showLoadMore: true });
//     }

//     if (nextPage + 1 > Math.ceil(images.totalHits / PixabayApi.perPage)) {
//       this.setState({isLoading: false, showLoadMore: false})
//     }

//      if (images.total === 0) {
//        repeatRequest();
//        this.setState({ isLoading: false });
//        return;
//      }

//     this.setState(prevState => ({
//       images: [...prevState.images, ...images.hits],
//       isLoading: false,
//     }));
//    catch (error) {
//     this.setState({ error: true, isLoading: false });
//   }
// }
//   };

// formSubmit = async ({ query: keyword }) => {
//   const { query, page } = this.state;
//   if (keyword === '') {
//     emptyRequest();
//     return;
//   }
//   this.setState({ page: 1, searchQuery: keyword, images: [] });

//   if (query === keyword && page === 1) {
//     try {
//       this.setState({ isLoading: true });

//       const images = await PixabayApi.axiosImages(query);
//       this.setState({
//         images: [...images.hits],
//         isLoading: false,
//       });
//     } catch (error) {
//       this.setState({ error: true, isLoading: false });
//     }
//   }
// };

//   toggleModal = () => {
//     this.setState(({ showModal }) => ({ showModal: !showModal }));
//   };

//   clickLoadMore = () => {

//     this.setState(prevState => ({isLoading: true, page: prevState.page + 1 }));
//   };

//   handlerLargeImage = (largeImageURL, tags) => {
//     this.toggleModal();
//     this.setState({ selectedImage: {largeImageURL,tags}});
//   };

//   render() {
//     const {
//       error,
//       searchQuery,
//       images,
//       isLoading,
//       // buttonLoader,
//       showModal,
//       selectedImage,
//       showLoadMore,
//     } = this.state;

//     return (
//       <>
//         <Wrapper>
//           <Searchbar onSubmit={this.formSubmit} />
//           {images.length === 0 ?
//           <Title>Make a request to display images</Title>
//             : <Title>The result of your request "{searchQuery}"</Title>
//           }
//           {isLoading && <Load>{GalleryLoader}</Load>}
//           <Title style={{ color: 'red' }}>{error}</Title>
//           <ImageGallery images={images} onSelect={this.handlerLargeImage} />
//           {showLoadMore &&
//             <LoadMore
//               onClick={this.clickLoadMore}
//               children={isLoading ? ButtonLoader : 'Load more'}
//             />
//           }
//           <Toaster />
//         </Wrapper>
//         {showModal && (
//           <Modal
//             onClose={this.toggleModal}
//             link={selectedImage.largeImageURL}
//             tags={selectedImage.tags}
//           />
//         )}
//       </>
//     );
//   }
// }
