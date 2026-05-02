import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home.jsx';
import Subscribe from './pages/Subscribe.jsx';
import Header from './components/Header/Header.jsx';
import CartSidebar from './components/CartSideBar/CartSidebar.jsx';
import { posts as initialPosts } from './data/posts';
import Toast from './components/Toast/Toast.jsx';
import Preloader from './components/Preloader/Preloader.jsx';
import BackToTop from './components/BackToTop/BackToTop.jsx';
import Footer from './components/Footer/Footer.jsx';

const App = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [preloader, setPreloader] = useState(true);
  const [backToTop, setBackToTop] = useState(false);

  useEffect( () => {
    //Back to top function
    const handleScroll = () => {
      if(window.scrollY > 100) {
        setBackToTop(true);
      }
      else {
        setBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // preload
    const handleLoad = () => {
      setPreloader(false);
    }
    const onPreloader = () => {
      if(document.readyState === 'complete') {
        handleLoad();
      }
      else {
        window.addEventListener('load', handleLoad);
      }
    } 

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('scroll', handleScroll);
    };
  },[]);
  

  //Toast function
  const showToast = (message) => {
    setIsToastVisible(true);
    setToastMessage(message);

    setTimeout(() => {
      setIsToastVisible(false);
      setToastMessage(null);
    }, 2500);
  }

  // cart functions
  const findBookById = (bookId) => posts.find(post => post.id === bookId);
  const findCartItem = (bookId) => cart.find(item => item.book.id === bookId);

  const addToCart = (bookId) => {
    const findBook = findBookById(bookId);
    if(!findBook || !findBook.inStock) return;
    const existingBook = findCartItem(bookId);
    if (existingBook) {
      setCart(cart.map(item => item.book.id === bookId ? {...item, quantity: item.quantity + 1} : item));
    }
    else {
      setCart([...cart, {book: findBook, quantity: 1}]);
    }
    showToast(`${findBook.title} added to cart 🛒`)
  };

  const removeFromCart = (bookId) => {
    setCart(cart.filter(item => item.book.id !== bookId));
  }

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(cart.map(item => item.book.id === bookId ? {...item, quantity: newQuantity} : item));
  }
  
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);  

  return (
  <>
    {preloader && <Preloader />}

    <Header 
      cartCount={cartCount}
      onCartToggle={() => setIsCartOpen(!isCartOpen)}
    />
    
    <CartSidebar 
      cart={cart}
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(!isCartOpen)}
      onRemove={removeFromCart}
      onUpdateQuantity={updateQuantity}
    />

    <Toast
      message={toastMessage}
      isVisble={isToastVisible}
    />

    <BackToTop
      backToTop={backToTop}
    />

    <Routes>
      <Route path="/" element={<Home 
      onAddToCart={addToCart} 
      posts={posts}
      showToast={showToast}
      />} 
      />
      <Route path="/subscribe" element={<Subscribe />} />
    </Routes>

    <Footer />
  </>
  )    
}

export default App;
