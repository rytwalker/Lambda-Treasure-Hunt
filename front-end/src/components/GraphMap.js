import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import logo from '../images/logo.png';

class GraphMap extends Component {
  state = { progress: 0 };

  getLocation = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/init/',
        headers: {
          Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.log('There was an error.');
    }
  };

  handleClick = () => {
    this.getLocation();
  };
  render() {
    const { progress } = this.state;
    return (
      <StyledGraphMap>
        <button className="btn" onClick={this.handleClick}>
          <img src={logo} alt="Jolly Roger" />
          Generate Map
        </button>
        <div className="progress-bar-container">
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
          <div className="progress-bar-text">
            <span>GENERATING...</span> <span>{progress}%</span>
          </div>
        </div>
      </StyledGraphMap>
    );
  }
}

const StyledGraphMap = styled.div`
  display: flex;
  height: calc(100vh - 86px);
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .btn {
    width: 289px;
    background: #525959;
    border: 1px solid transparent;
    border-radius: 10px;
    font-size: 2.4rem;
    color: #f2f2f2;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Rubik';
    padding: 1rem;
    transition: all 0.2s;
    img {
      height: 46.63px;
      width: 33px;
      margin-right: 2rem;
    }
    &:hover,
    &:focus {
      color: #7dcdbe;
      background: #3b3f3f;
      outline: none;
    }
  }

  .progress-bar-container {
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
  }
`;

export default GraphMap;
