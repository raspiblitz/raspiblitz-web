import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const Welcome: FC = () => {
  const { t } = useTranslation();

  return <div>Welcome!</div>;
};

export default Welcome;
