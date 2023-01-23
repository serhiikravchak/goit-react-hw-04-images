import { Overlay, ModalWindow, Img } from './Modal.styled';
import { useEffect } from 'react';

export function Modal({ onClose, link, tags }) {
  useEffect(() => {
    const onKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
      window.addEventListener('keydown', onKeyDown);
    };
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const onBackdropClick = evt => {
    if (evt.currentTarget === evt.target) {
      onClose();
    }
  };

  return (
    <Overlay onClick={onBackdropClick}>
      <ModalWindow>
        <Img src={link} alt={tags} />
      </ModalWindow>
    </Overlay>
  );
}
