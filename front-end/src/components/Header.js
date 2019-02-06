import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import logo from '../images/logo.png';
import { NavLink } from 'react-router-dom';

const Header = props => {
  return (
    <StyledHeader>
      <div className="container">
        <div className="logo">
          <img src={logo} alt="Jolly Roger" />
        </div>
        <h1>Lambda Treasure Hunt</h1>
        <nav>
          <NavLink exact to="/">
            <FontAwesomeIcon icon={faMap} />
            <span>Map</span>
          </NavLink>
          <NavLink to="/about">
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>About</span>
          </NavLink>
        </nav>
      </div>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  height: 60px;
  background: #3b3f3f;
  .container {
    display: flex;
    align-items: center;
    color: #e5e5e5;
    width: 90%;
    height: 100%;
    margin: 0 auto;
  }

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
      font-size: 2rem;
      font-weight: 700;
      text-transform: uppercase;
      text-decoration: none;
      transition: all 0.2s;
      transform-origin: bottom;
      padding: 0 0.5rem;

      &:not(:last-child) {
        margin-right: 2rem;
      }
      &:hover {
        color: #7dcdbe;
      }
      span {
        margin-left: 1rem;
      }
    }
    .active {
      color: #7dcdbe !important;
    }
  }
`;

export default Header;
