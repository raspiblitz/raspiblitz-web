import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ChevronLeft } from '../../../assets/chevron-left.svg';
import { createRequest } from '../../../util/util';

export const AppInfo: FC<AppInfoProps> = (props) => {
  const { t } = useTranslation();
  const [iconImg, setIconImg] = useState('');
  const [imgs, setImgs] = useState<string[]>([]);
  const [resp, setResp] = useState<any>({});
  const buttonClasses = 'rounded p-2';

  const { id } = props;

  useEffect(() => {
    const fetchAppDetails = async () => {
      const req = createRequest(`appdetails/${id}`, 'GET');
      const resp = await fetch(req);
      const respObj = await resp.json();
      setImgs(respObj.images);
      setResp(respObj);
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
    window.open(img, '_blank', 'noopener,noreferrer');
  };

  const installHandler = () => {
    const req = createRequest('install', 'POST', JSON.stringify({ id }));
    fetch(req);
  };

  const uninstallHandler = () => {
    const req = createRequest('uninstall', 'POST', JSON.stringify({ id }));
    fetch(req);
  };

  return (
    <div className='mobile-container md:content-container w-full'>
      <div className='w-full text-lg font-bold px-5 p-9 dark:text-gray-200'>
        <button onClick={props.onClose} className='flex items-center outline-none'>
          <ChevronLeft className='h-5 w-5 inline-block' />
          {t('navigation.back')}
        </button>
      </div>

      {/* Image box with title */}
      <div className='w-full px-10 flex items-center'>
        <img className='max-h-16' src={iconImg} alt={`${props.id} Logo`} />
        <div className='text-2xl px-5 dark:text-white'>{resp.name}</div>
        {!resp.installed && (
          <button className={`bg-green-400 ${buttonClasses}`} onClick={installHandler}>
            {t('apps.install')}
          </button>
        )}
        {resp.installed && (
          <button className={`bg-red-500 text-white ${buttonClasses}`} onClick={uninstallHandler}>
            {t('apps.uninstall')}
          </button>
        )}
      </div>

      {/* Slideshow */}
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
          <div className='my-2 text-gray-500 dark:text-gray-300'> {t('apps.about')}</div>
          <div>{resp.description}</div>
          <div className='my-2 text-gray-500 dark:text-gray-300'> {t('apps.author')}</div>
          <div>{resp.author}</div>
          <div className='my-2 text-gray-500 dark:text-gray-300'> {t('apps.source')}</div>
          <a href={resp.repository} className='text-blue-400 dark:text-blue-300 underline'>
            {resp.repository}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppInfo;

export interface AppInfoProps {
  id: string | null;
  onClose: () => void;
}
