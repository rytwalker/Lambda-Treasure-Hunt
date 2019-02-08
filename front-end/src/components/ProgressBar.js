import React from 'react';
import styled from 'styled-components';

const ProgressBar = ({ progress, sidebar }) => {
  return (
    <StyledProgressBar sidebar={sidebar}>
      <div className="progress-bar">
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
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
  margin-top: ${props => (props.sidebar ? '0' : '2rem')};
  .progress-bar {
    height: 15px;
    width: 100%;
    border-radius: 10px;
    border: 2px solid #7dcdbe;
    background: #f5f5f5;
    overflow: hidden;

    .progress-bar-fill {
      background: ${props => (props.sidebar ? '#f3f3f3' : '#7dcdbe')};
    }
  }
  .progress-bar-text {
    margin-top: 0.5rem;
    display: flex;
    justify-content: space-between;
  }
`;

export default ProgressBar;
