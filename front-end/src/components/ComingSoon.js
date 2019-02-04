import React from 'react';
import styled from 'styled-components';
import logo from '../images/logo.png';

const ComingSoon = props => {
  return (
    <StyledComingSoon>
      <h2>Coming Soon...</h2>
      <div className="cs-logo">
        <img src={logo} alt="Jolly Roger" />
      </div>
      <p>A pirate's life for me!</p>
    </StyledComingSoon>
  );
};

const StyledComingSoon = styled.main`
  display: flex;
  height: calc(100vh - 86px);
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h2 {
    font-size: 3.6rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .cs-logo {
    margin: 3rem 0;
  }

  p {
    color: #7dcdbe;
    font-size: 2.4rem;
    font-weight: 700;
  }
`;

export default ComingSoon;
