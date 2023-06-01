import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Backdrop, Content } from './Modal.styled.js';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, largeImage, alt }) => {
    useEffect(() => {
        const handleKeyDown = e => {
            if (e.code === 'Escape') { onClose() }
        }

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [onClose])
    
    const handleBackdropClick = e => {
        if (e.currentTarget === e.target) { onClose() };
    }
    
    return createPortal(<Backdrop className="overlay" onClick={handleBackdropClick}>
        <Content className="modal">
            <img src={largeImage} alt={alt} />
        </Content>
    </Backdrop>, modalRoot
    );
}

PropTypes.ImageGallery = {
    onClose: PropTypes.func.isRequired,
    largeImage: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

export default Modal;



// class Modal extends Component {
    
//     componentDidMount() {
//         window.addEventListener('keydown', this.handleKeyDown);
//     }
    
//     componentWillUnmount() {
//         window.removeEventListener('keydown', this.handleKeyDown);
//     }
    
//     handleKeyDown = (event) => {
//         if (event.code === 'Escape') {
//             this.props.onClose();
//         }
//     }

//     handleBackdropClick = e => {
//         if (e.currentTarget === e.target) {
//             this.props.onClose();
//         }
//     }

//     render() {
//         return createPortal(
//             <Backdrop className="overlay" onClick={this.handleBackdropClick}>
//                 <Content className="modal">
//                     <img src={this.props.largeImage} alt={this.props.alt} />
//                 </Content>
//         </Backdrop>, modalRoot
//         );
//     };
// };

// PropTypes.ImageGallery = {
//     onClose: PropTypes.func.isRequired,
//     largeImage: PropTypes.string.isRequired,
//     alt: PropTypes.string.isRequired,
// }

// export default Modal;