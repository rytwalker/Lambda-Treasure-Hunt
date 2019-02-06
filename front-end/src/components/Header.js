import React from 'react';
import styled from 'styled-components';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';

const Header = props => {
  return (
    <StyledHeader>
      <div className="logo">
        <img src={logo} alt="Jolly Roger" />
      </div>
      <h1>Lambda Treasure Hunt</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/generate-graph">Map</Link>
        <Link to="/about">About</Link>
      </nav>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  height: 60px;
  display: flex;
  align-items: center;
  color: #e5e5e5;
  background: #3b3f3f;
  padding: 0 5rem;

  .logo {
    img {
      width: 32px;
      height: 44px;
    }
  }

  h1 {
    margin-right: auto;
    margin-left: auto;
    font-size: 3.6rem;
    text-transform: uppercase;
    font-weight: 700;
  }

  nav {
    a,
    a:visited {
      color: #e5e5e5;
      font-size: 1.6rem;
      border-bottom: 1px solid #7dcdbe;
      text-decoration: none;
      transition: all 0.2s;
      transform-origin: bottom;
      padding: 0 0.5rem;
      &:not(:last-child) {
        margin-right: 2rem;
      }
      &:hover {
        background: #7dcdbe;
      }
    }
  }
`;

export default Header;
