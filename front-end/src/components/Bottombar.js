import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const Bottombar = () => {
  return (
    <StyledBottombar>
      <Button />
      <div className="message">You have walked east.</div>
    </StyledBottombar>
  );
};

const StyledBottombar = styled.div`
  width: 75%;
  background: #ddd;
  height: 60px;
  display: flex;
  align-items: center;

  .message {
    ${'' /* margin-left: 5rem; */}
    margin: auto;
    font-size: 2rem;
    font-weight: 700;
  }
`;
export default Bottombar;
