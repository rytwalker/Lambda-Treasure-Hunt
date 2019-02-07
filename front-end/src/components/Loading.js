import React from 'react';
import logo from '../images/logo.png';
import ProgressBar from './ProgressBar';

const Loading = () => {
  return (
    <div
      style={{
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <img
        src={logo}
        alt="Jolly Roger"
        style={{ width: '176px', height: 'auto' }}
      />
      <ProgressBar />
    </div>
  );
};

export default Loading;
