import { useEffect } from 'react';
import PropTypes from 'prop-types';

export const Modal = ({ toggle, tags, url }) => {
  useEffect(() => {
    const handeleKeyDown = event => {
      if (event.code === 'Escape') {
        toggle();
      }
    };

    window.addEventListener('keydown', handeleKeyDown);

    window.removeEventListener('keydown', handeleKeyDown);
  });

  const onClickOverlay = event => {
    if (event.target === event.currentTarget) {
      toggle();
    }
  };

  return (
    <div className="Overlay" onClick={onClickOverlay}>
      <div className="Modal">
        <img src={url} alt={tags} />
      </div>
    </div>
  );
};

Modal.propTypes = {
  toggle: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};
