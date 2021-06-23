import { FC, useEffect, useState } from 'react';
import ImageModal from '../../../container/ImageModal/ImageModal';
import { createRequest } from '../../../util/util';

export const AppInfo: FC<AppInfoProps> = (props) => {
  const [showImg, setShowImg] = useState(false);
  const [img, setImg] = useState<string>('');
  const [imgs, setImgs] = useState<string[]>([]);
  const [resp, setResp] = useState<any>({});

  const { id } = props;

  useEffect(() => {
    const bla = async () => {
      const req = createRequest(`appdetails/${id}`, 'GET');
      const resp = await fetch(req);
      const respObj = await resp.json();
      setImgs(respObj.images);
      setResp(respObj);
    };
    bla();
  }, [id]);

  const openImgHandler = (img: string) => {
    // window.open(img, '_blank', 'noopener,noreferrer,resizable');
    setImg(img);
    setShowImg(true);
  };

  const closeImgHandler = () => {
    setShowImg(false);
  };

  return (
    <>
      {showImg && <ImageModal img={img} close={closeImgHandler} />}
      <div className='mobile-container md:content-container w-full'>
        <div className='w-full text-xl font-bold px-5 pt-8 dark:text-gray-200'>
          <button onClick={props.onClose}>Back</button>
        </div>
        <div className='container p-2 flex flex-nowrap overflow-x-auto'>
          {imgs.map((img, i) => (
            <img
              id={'img' + i}
              key={i}
              onClick={() => openImgHandler(img)}
              className='rounded-xl p-2'
              src={img}
              alt='img'
            />
          ))}
        </div>
        <div className='w-10/12 bg-gray-500 flex items-center justify-center'>
          <div>{resp.description}</div>
          <div>{resp.author}</div>
        </div>
      </div>
    </>
  );
};

export default AppInfo;

export interface AppInfoProps {
  id: string | null;
  onClose: () => void;
}
