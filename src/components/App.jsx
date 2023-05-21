import React, { useState, useEffect } from 'react';
import { getImages } from './services/api';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { ButtonLoadMore } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [images, setImages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getImages(inputValue, page);
        const imagesData = response.data.hits;
        setImages(prevImages => [
          ...prevImages,
          ...imagesData.map(({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })),
        ]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (inputValue.trim() !== '' || page !== 1) {
      fetchData();
    }
  }, [inputValue, page]);

  const handleSearchSubmit = query => {
    setInputValue(query);
    setImages([]);
    setPage(1);
  };

  const handleClickLoadMore = event => {
    setPage(prevPage => prevPage + 1);
  };

  const onClickCard = id => {
    const item = images.find(img => img.id === id);
    setSelectedItem(item);

    toggle();
  };

  const toggle = () => {
    setSelectedImage(prevSelectedImage => !prevSelectedImage);
  };

  const { largeImageURL, tags } = selectedItem;
  const showButton = images.length > 0;

  useEffect(() => {
    if (images.length === 0 && inputValue.length > 0) {
      setMessage('No results. Enter something else in the search.');
    } else if (images.length === 0 && inputValue.length === 0) {
      setMessage('There are no pictures yet. Enter something in the search.');
    } else {
      setMessage(null);
    }
  }, [images.length, inputValue.length]);

  return (
    <>
      {loading && <Loader />}
      {selectedImage && (
        <Modal url={largeImageURL} tags={tags} toggle={toggle} />
      )}
      <Searchbar onSubmit={handleSearchSubmit} />
      {message && <div className="container-message">{message}</div>}
      <ImageGallery images={images} onImagClick={onClickCard} />
      <ButtonLoadMore
        onClickBtn={handleClickLoadMore}
        showButton={showButton}
      />
    </>
  );
};
