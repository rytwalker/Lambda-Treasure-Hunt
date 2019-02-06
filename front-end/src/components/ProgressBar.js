import React from 'react';
import styled from 'styled-components';

const ProgressBar = ({ progress }) => {
  return (
    <StyledProgressBar>
      <div className="progress-bar">
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#7dcdbe',
            transition: 'width .2s ease-in-out'
          }}
          className="progress-bar-fill"
        />
      </div>
      {/* <div className="progress-bar-text">
      {generating && (
        <>
          <span>GENERATING...</span> <span>{progress}%</span>
        </>
      )}
    </div> */}
    </StyledProgressBar>
  );
};

const StyledProgressBar = styled.div`
  margin-top: 2rem;
  .progress-bar {
    height: 20px;
    width: 289px;
    border-radius: 10px;
    border: 2px solid #7dcdbe;
    background: #f5f5f5;
    overflow: hidden;
  }
  .progress-bar-text {
    margin-top: 0.5rem;
    display: flex;
    justify-content: space-between;
  }
`;

export default ProgressBar;
