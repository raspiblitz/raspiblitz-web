import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Welcome from '../../components/SetupComponents/Welcome/Welcome';

const Setup: FC = () => {
  const { t } = useTranslation();

  return <Welcome />;
};

export default Setup;
