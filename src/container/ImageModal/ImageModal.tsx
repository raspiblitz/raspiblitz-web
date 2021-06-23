import { FC, useEffect } from 'react';
import { ReactComponent as XIcon } from '../../assets/X.svg';
import ModalBackground from '../ModalBackground/ModalBackground';

const ImageModal: FC<ImageModalProps> = (props) => {
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      // close on Esc
      if (event.key === 'Escape') {
        props.close();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [props]);

  return (
    <ModalBackground>
      <button onClick={props.close} className='fixed top-0 right-0 h-10 w-10 text-white'>
        <XIcon className='w-full h-full' />
      </button>
      <div className='flex justify-center items-center'>
        <img src={props.img} alt='img' style={{ width: '95vw' }} className='h-auto' />
      </div>
    </ModalBackground>
  );
};

export default ImageModal;

export interface ImageModalProps {
  close: () => void;
  img: string;
}
