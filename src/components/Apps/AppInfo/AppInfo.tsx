import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ChevronLeft } from '../../../assets/chevron-left.svg';
import { instance } from '../../../util/interceptor';

export const AppInfo: FC<AppInfoProps> = (props) => {
  const { t } = useTranslation();
  const [iconImg, setIconImg] = useState('');
  const [imgs, setImgs] = useState<string[]>([]);
  const [resp, setResp] = useState<any>({});

  const { id } = props;

  useEffect(() => {
    const fetchAppDetails = async () => {
      const resp = await instance.get(`appdetails/${id}`);
      setImgs(resp.data.images);
      setResp(resp.data);
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
    instance.post('install', { id });
  };

  const uninstallHandler = () => {
    instance.post('uninstall', { id });
  };

  return (
    <main className='mobile-container md:content-container w-full'>
      {/* Back Button */}
      <section className='w-full px-5 py-9 dark:text-gray-200'>
        <button onClick={props.onClose} className='flex items-center outline-none text-xl font-bold'>
          <ChevronLeft className='h-5 w-5 inline-block' />
          {t('navigation.back')}
        </button>
      </section>

      {/* Image box with title */}
      <section className='w-full px-10 flex items-center'>
        <img className='max-h-16' src={iconImg} alt={`${props.id} Logo`} />
        <h1 className='text-2xl px-5 dark:text-white'>{resp.name}</h1>
        {!resp.installed && (
          <button className={`bg-green-400 rounded p-2`} onClick={installHandler}>
            {t('apps.install')}
          </button>
        )}
        {resp.installed && (
          <button className={`bg-red-500 text-white rounded p-2`} onClick={uninstallHandler}>
            {t('apps.uninstall')}
          </button>
        )}
      </section>

      {/* Slideshow */}
      <section className='container p-2 flex flex-nowrap overflow-x-auto'>
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
      </section>
      {/* App Description */}
      <section className='w-full p-5 flex items-center justify-center'>
        <article className='w-full bd-card'>
          <h3 className='text-lg'>
            {resp.name} v{resp.version}
          </h3>
          <h4 className='my-2 text-gray-500 dark:text-gray-300'> {t('apps.about')}</h4>
          <p>{resp.description}</p>
          <h4 className='my-2 text-gray-500 dark:text-gray-300'> {t('apps.author')}</h4>
          <p>{resp.author}</p>
          <h4 className='my-2 text-gray-500 dark:text-gray-300'> {t('apps.source')}</h4>
          <a href={resp.repository} className='text-blue-400 dark:text-blue-300 underline'>
            {resp.repository}
          </a>
        </article>
      </section>
    </main>
  );
};

export default AppInfo;

export interface AppInfoProps {
  id: string | null;
  onClose: () => void;
}
