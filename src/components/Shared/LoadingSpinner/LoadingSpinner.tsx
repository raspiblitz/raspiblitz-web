import { FC } from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: FC<{ color: string }> = (props) => (
  <div className={`${props.color} lds-ring`}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default LoadingSpinner;
