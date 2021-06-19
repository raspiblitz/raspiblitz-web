import { FC, useEffect, useState } from 'react';

export const AppInfo: FC<AppInfoProps> = (props) => {
  const [imgs, setImgs] = useState<string[]>([]);
  const [resp, setResp] = useState<any>({});

  const { id } = props;

  useEffect(() => {
    const bla = async () => {
      const resp = await fetch('http://localhost:8080/appdetails/' + id);
      const respObj = await resp.json();
      setImgs(respObj.images);
      setResp(respObj);
    };
    bla();
  }, [id]);

  const imgHandler = (img: string) => {
    window.open(img, '_blank');
  };

  return (
    <div className='mobile-container md:content-container w-full'>
      <div className='w-full text-xl font-bold px-5 pt-8 dark:text-gray-200'>
        <button onClick={props.onClose}>Back</button>
      </div>
      <div className='container p-5 flex flex-nowrap overflow-x-auto'>
        {imgs.map((img, i) => (
          <img id={'img' + i} key={i} onClick={() => imgHandler(img)} className='rounded-3xl p-2' src={img} alt='img' />
        ))}
      </div>
      <div className='text-center'>
        <div>{resp.description}</div>
        <div>{resp.author}</div>
      </div>
    </div>
  );
};

export default AppInfo;

export interface AppInfoProps {
  id: string | null;
  onClose: () => void;
}
