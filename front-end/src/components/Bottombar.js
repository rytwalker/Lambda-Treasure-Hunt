import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const Bottombar = ({ onclick, messages }) => {
  return (
    <StyledBottombar>
      <Button onclick={onclick} />
      <div className="message">
        {!messages.length ? (
          <p>{'Click EXPLORE to start exploring.'}</p>
        ) : (
          messages.map(message => <span key={message}>{message} </span>)
        )}
      </div>
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
