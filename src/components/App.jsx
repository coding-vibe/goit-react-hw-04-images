import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { AppWrap } from './App.styled.js';

const App = () => {
  const [imageName, setImageName] = useState('');
  
  const handleSearchBarSubmit = imageName => {
    setImageName(imageName);
  }
  
  return (
    <AppWrap>
      <SearchBar onSubmit={handleSearchBarSubmit} />
      <ImageGallery imageName={imageName} />
    </AppWrap>
  );
}

export default App;



// class App extends Component {
//   state = {
//     imageName: '',
//   };
  
//   handleSearchBarSubmit = imageName => {
//     this.setState({ imageName });
//   }
  
//   render() {
//     return (
//       <AppWrap>
//         <SearchBar onSubmit={this.handleSearchBarSubmit} />
//         <ImageGallery imageName={this.state.imageName} />
//       </AppWrap>
//     );
//   }
// }

// export default App;