import { FC } from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: FC<{ color?: string }> = (props) => {
  const color = props.color || 'text-yellow-500';

  return (
    <div id='loading-spinner' className={`${color} lds-ring`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
