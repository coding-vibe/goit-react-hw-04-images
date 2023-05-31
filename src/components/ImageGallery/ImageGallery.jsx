import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageGalleryItem from '../ImageGalleryItem';
import imagesApi from '../../services';
import ImageGalleryErrorView from '../ImageGalleryErrorView';
import Loader from '../Loader';
import LoadMore from '../Button';
import Modal from '../Modal';
import { ToastContainer } from 'react-toastify';
import { ImageGalleryList, LoaderWrap, MessageIdle } from './ImageGallery.styled.js';

const ImageGallery = ({ imageName }) => {
    const [images, setImages] = useState(null);
    const [totalImages, setTotalImages] = useState(0);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        if (!imageName) {
            return;
        }

        setImages(null);
        setQuery(imageName);
        setPage(1);
        loadImages(imageName, 1);
    }, [imageName]);

    useEffect(() => {
        loadImages(imageName, page);
    }, [imageName, page]);

    const loadImages = (imageName, page) => {
        setStatus('pending');

        imagesApi
            .fetchImages(imageName, page)
            .then(images => {
                if (images.hits.length === 0) {
                    return Promise.reject(new Error(`No images found for '${imageName}'`));
                }
                setImages(prevState => (prevState ? [...prevState, ...images.hits] : images.hits))
                setTotalImages(images.total)
                setIsLoadingMore(false)
                setStatus('resolved')
            })
            .catch(error => {
                setError(error)
                setIsLoadingMore(false)
                setStatus('rejected')
            })
    };

    const loadMore = () => {
        setPage(prevState => prevState + 1);
    };

    const toggleModal = (largeImageURL, tags) => {
        setShowModal(prevState => !prevState)
        setSelectedImage(prevState => prevState ? null : { largeImageURL, tags }
        );
    };
    
    if (status === 'idle') {
        return <MessageIdle> Please, enter the name of the image </MessageIdle>;
    }
    
    if (status === 'pending') {
        return (
            <LoaderWrap>
                <Loader />
            </LoaderWrap>
        );
    }
    
    if (status === 'rejected') {
        return <ImageGalleryErrorView message={error.message} />;
    }
    
    if (status === 'resolved') {
        return (
            <div>
                <ImageGalleryList className="gallery">
                    {images.map((hit, index) => (
                        <li key={index}>
                            <ImageGalleryItem
                                src={hit.webformatURL}
                                alt={hit.tags}
                                onClick={() => toggleModal(hit.largeImageURL, hit.tags)} />
                        </li>
                    ))}
                </ImageGalleryList>
                
                {!isLoadingMore && images.length < totalImages && (
                    <LoadMore onClick={loadMore} />
                )}
                
                {isLoadingMore && (
                    <LoaderWrap>
                        <Loader />
                    </LoaderWrap>
                )}
                
                {showModal && selectedImage && (<Modal
                    largeImage={selectedImage.largeImageURL}
                    alt={selectedImage.tags}
                    onClose={toggleModal}
                />
                )}
                <ToastContainer autoClose={3000} />
            </div>
        );
    }
};

PropTypes.ImageGallery = {
    imageName: PropTypes.string.isRequired,
};

export default ImageGallery;



// class ImageGallery extends Component {
//     state = {
//         images: null,
//         totalImages: 0,
//         error: null,
//         status: 'idle',
//         page: 1,
//         query: '',
//         showModal: false,
//         selectedImage: null,
//         isLoadingMore: false,
//     };
    
//     componentDidUpdate(prevProps, prevState) {
//         const prevName = prevProps.imageName;
//         const currentName = this.props.imageName;
//         const prevPage = prevState.page;
//         const { page } = this.state;
        
//         if (prevName !== currentName) {
//             this.setState({ query: currentName, images: null, page: 1 });
//             this.loadImages(currentName, 1);
//         }
        
//         if (prevName !== currentName || prevPage !== page) {
//             this.loadImages(currentName, page);
//         }
//     };
    
//     loadMore = () => {
//         this.setState((prevState) => ({
//             page: prevState.page + 1
//         }));
//     }
    
//     loadImages = (imageName, page) => {
//         this.setState({ status: 'pending' });
        
//         imagesApi
//             .fetchImages(imageName, page)
//             .then(images => {
//                 if (images.hits.length === 0) {
//                     return Promise.reject(new Error(`No images found for '${imageName}'`));
//                 }
//                 this.setState(prevState => ({
//                     images: prevState.images ? [...prevState.images, ...images.hits] : images.hits,
//                     totalImages: images.total,
//                     status: 'resolved',
//                     // page,
//                     isLoadingMore: false,
//                 }));
//             })
//             .catch(error => this.setState({ error, status: 'rejected', isLoadingMore: false }));
//     };
    
//     toggleModal = (largeImageURL, tags) => {
//         this.setState(prevState => ({
//             showModal: !prevState.showModal,
//             selectedImage: prevState.showModal ? null : { largeImageURL, tags },
//         }));
//     };
    
//     render() {
//         const { images, totalImages, error, status, showModal, selectedImage, isLoadingMore } = this.state;
        
//         if (status === 'idle') {
//             return <MessageIdle> Please, enter the name of the image </MessageIdle>;
//         }
        
//         if (status === 'pending') {
//             return (
//                 <LoaderWrap>
//                     <Loader />
//                 </LoaderWrap>
//             );
//         }
        
//         if (status === 'rejected') {
//             return <ImageGalleryErrorView message={error.message} />;
//         }
        
//         if (status === 'resolved') {
//             return (
//                 <div>
//                     <ImageGalleryList className="gallery">
//                         {images.map((hit, index) => (
//                             <li key={index}>
//                                 <ImageGalleryItem
//                                     src={hit.webformatURL}
//                                     alt={hit.tags}
//                                     onClick={() =>
//                                         this.toggleModal(hit.largeImageURL, hit.tags)} />
//                             </li>
//                         ))}
//                     </ImageGalleryList>
                    
//                     {!isLoadingMore && images.length < totalImages && (
//                         <LoadMore onClick={this.loadMore} />
//                     )}
                    
//                     {isLoadingMore && (
//                         <LoaderWrap>
//                             <Loader />
//                         </LoaderWrap>
//                     )}
                    
//                     {showModal && selectedImage && (
//                         <Modal
//                             onClose={this.toggleModal}
//                             largeImage={selectedImage.largeImageURL}
//                             alt={selectedImage.tags}
//                         />
//                     )}
//                     <ToastContainer autoClose={3000} />
//                 </div>
//             );
//         }
//     }
// }

// PropTypes.ImageGallery = {
//     imageName: PropTypes.string.isRequired,
// }

// export default ImageGallery;


