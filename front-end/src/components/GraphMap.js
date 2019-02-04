import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import logo from '../images/logo.png';

class GraphMap extends Component {
  state = {
    generating: false,
    progress: 0,
    room_id: 0,
    message: '',
    error: '',
    coords: { x: 60, y: 60 },
    graph: {},
    path: []
  };

  traverseMap = () => {
    const { graph, path } = this.state;

    //   GET CURRENT LOCATION
    this.getLocation();
  };

  getLocation = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/init/',
        headers: {
          Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
        }
      });
      this.setState({
        generating: true,
        room_id: response.data.room_id,
        coords: this.parseCoords(response.data.coordinates)
      });
      console.log(response.data);
    } catch (error) {
      console.log('There was an error.');
    }
  };

  parseCoords = coords => {
    const coordsObject = {};
    const coordsArr = coords.replace(/[{()}]/g, '').split(',');
    console.log(coordsArr);
    coordsArr.forEach(coord => {
      coordsObject['x'] = parseInt(coordsArr[0]);
      coordsObject['y'] = parseInt(coordsArr[1]);
    });
    console.log(coordsObject);
    return coordsObject;
  };

  handleClick = () => {
    this.getLocation();
  };
  render() {
    const {
      progress,
      message,
      error,
      coords,
      room_id,
      generating
    } = this.state;
    let parsed = [];
    if (coords) {
      for (let coord in coords) {
        parsed.push(`${coord}: ${coords[coord]} `);
      }
    }
    return (
      <StyledGraphMap>
        <button className="btn" onClick={this.handleClick}>
          <img src={logo} alt="Jolly Roger" />
          {generating ? 'Generating...' : 'Generate Map'}
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
            {generating && (
              <>
                <span>GENERATING...</span> <span>{progress}%</span>
              </>
            )}
          </div>
        </div>
        {generating && (
          <code className="log-container">
            <div className="log">
              <p>
                <span className="log-label">Room:</span>
                {room_id}
              </p>
              {message && (
                <p>
                  <span className="log-label">Message:</span>
                  {message}
                </p>
              )}
              {coords && (
                <p>
                  <span className="log-label">Coordinates:</span>
                  {parsed}
                </p>
              )}
              {error && (
                <p>
                  <span className="log-label">Errors:</span>
                  {error}
                </p>
              )}
            </div>
          </code>
        )}
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

  .log-container {
    width: 289px;
    margin-top: 2rem;
    background: #f5f5f5;
    border: 2px solid #7dcdbe;
    border-radius: 10px;
    padding: 1rem;
    .log-label {
      margin-right: 1rem;
    }
  }
`;

export default GraphMap;
