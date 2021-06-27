import { FC, useEffect, useState } from 'react';
import ImageModal from '../../../container/ImageModal/ImageModal';
import { createRequest } from '../../../util/util';
import { ReactComponent as ChevronLeft } from '../../../assets/chevron-left.svg';

export const AppInfo: FC<AppInfoProps> = (props) => {
  const [showImg, setShowImg] = useState(false);
  const [iconImg, setIconImg] = useState('');
  const [detailImg, setDetailImg] = useState<string>('');
  const [imgs, setImgs] = useState<string[]>([]);
  const [resp, setResp] = useState<any>({});

  const { id } = props;

  useEffect(() => {
    const fetchAppDetails = async () => {
      const req = createRequest(`appdetails/${id}`, 'GET');
      const resp = await fetch(req);
      const respObj = await resp.json();
      setImgs(respObj.images);
      setResp(respObj);
      console.log(respObj);
    };
    fetchAppDetails();

    import(`../../../assets/apps/${id}.png`)
      .then((image) => {
        setIconImg(image.default);
      })
      .catch((e) => {
        // use fallback icon if image for id doesn't exist
        import('../../../assets/cloud.svg').then((img) => setIconImg(img.default));
      });
  }, [id]);

  const openImgHandler = (img: string) => {
    // window.open(img, '_blank', 'noopener,noreferrer,resizable');
    setDetailImg(img);
    setShowImg(true);
  };

  const closeImgHandler = () => {
    setShowImg(false);
    setDetailImg('');
  };

  return (
    <>
      {showImg && <ImageModal img={detailImg} close={closeImgHandler} />}
      <div className='mobile-container md:content-container w-full'>
        <div className='w-full text-lg font-bold px-5 p-9 dark:text-gray-200'>
          <button onClick={props.onClose} className='flex items-center'>
            <ChevronLeft className='h-5 w-5 inline-block' /> Back
          </button>
        </div>

        <div className='w-full px-10 flex items-center'>
          <img className='max-h-16' src={iconImg} alt={`${props.id} Logo`} />
          <div className='text-2xl px-5'>{resp.name}</div>
        </div>

        <div className='container p-2 flex flex-nowrap overflow-x-auto'>
          {imgs.map((img, i) => (
            <img
              id={'img' + i}
              key={i}
              onClick={() => openImgHandler(img)}
              className='rounded-xl p-2 max-w-4/5'
              src={img}
              alt='img'
            />
          ))}
        </div>
        {/* App Description */}
        <div className='w-full p-5 flex items-center justify-center'>
          <div className='w-full bd-card'>
            <div className='text-lg'>
              {resp.name} v{resp.version}
            </div>
            <div className='my-2 text-gray-500'>About</div>
            <div>{resp.description}</div>
            <div className='my-2 text-gray-500'>Author</div>
            <div>{resp.author}</div>
            <div className='my-2 text-gray-500'>Source Code</div>
            <a href={resp.repository} className='text-blue-400 underline'>
              Link
            </a>
          </div>
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
