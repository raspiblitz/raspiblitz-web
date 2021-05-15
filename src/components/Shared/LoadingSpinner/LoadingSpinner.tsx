import { FC } from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: FC<{ color?: string }> = (props) => {
  const color = props.color || 'text-blue-500';

  return (
    <div className={`${color} lds-ring`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
