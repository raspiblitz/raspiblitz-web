import { FC } from 'react';
import ModalDialog from '../../../container/ModalDialog/ModalDialog';

export const AppInfo: FC<AppInfoProps> = (props) => {
  return (
    <ModalDialog close={props.onClose}>
      <div className=''>{props.id}</div>
    </ModalDialog>
  );
};

export default AppInfo;

export interface AppInfoProps {
  id: string | null;
  onClose: () => void;
}
