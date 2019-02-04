import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import logo from '../images/logo.png';

class GraphMap extends Component {
  state = {
    coords: { x: 50, y: 60 },
    error: '',
    exits: [],
    generating: false,
    graph: {},
    message: '',
    path: [],
    progress: 0,
    room_id: 0
  };

  componentDidMount() {
    // GET CURRENT LOCATION
    this.getLocation();
  }

  traverseMap = () => {
    let { coords, exits, graph, path, room_id } = this.state;
    const inverse = { n: 's', s: 'n', w: 'e', e: 'w' };
    // START
    this.setState({ generating: true });
    // INIT GRAPH
    const traveralGraph = {};
    const traveralPath = [];
    // INIT THE FIRST ROOM
    if (!graph[room_id]) {
      traveralGraph[room_id] = [];
      traveralGraph[room_id].push(coords);
      const moves = {};
      exits.forEach(exit => {
        moves[exit] = '?';
      });
      traveralGraph[room_id].push(moves);
    }
    // STARTING HERE LOOP
    const interval = setInterval(() => {
      const unknownRooms = [];
      const directions = traveralGraph[room_id][1];
      for (let direction in directions) {
        if (directions[direction] === '?') {
          unknownRooms.push(direction);
        }
      }
      if (unknownRooms) {
        const move = unknownRooms[0];
        traveralPath.push(move);
        let previous_room_id = room_id;
        // MAKE POST REQUEST
        this.moveRooms(move).then(() => {
          room_id = this.state.room_id;
          coords = this.state.coords;
          if (!graph[room_id]) {
            traveralGraph[room_id] = [];
            traveralGraph[room_id].push(coords);
            const moves = {};
            exits.forEach(exit => {
              moves[exit] = '?';
            });
            traveralGraph[room_id].push(moves);
          }
          traveralGraph[previous_room_id][1][move] = room_id;
          traveralGraph[room_id][1][inverse[move]] = previous_room_id;
          console.log(traveralGraph);
        });
      } else {
        // do something here
        console.log('We made it here!');
      }
    }, 1000 * 25);

    console.log(traveralGraph);
  };

  moveRooms = async move => {
    try {
      const response = await axios({
        method: 'post',
        url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`,
        headers: {
          Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
        },
        data: {
          direction: move
        }
      });
      this.setState({
        room_id: response.data.room_id,
        coords: this.parseCoords(response.data.coordinates),
        exits: [...response.data.exits]
      });
      console.log(response.data);
    } catch (error) {
      console.log('Something went wrong moving...');
    }
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
        room_id: response.data.room_id,
        coords: this.parseCoords(response.data.coordinates),
        exits: [...response.data.exits]
      });
      //   console.log(response.data);
    } catch (error) {
      console.log('There was an error.');
    }
  };

  parseCoords = coords => {
    const coordsObject = {};
    const coordsArr = coords.replace(/[{()}]/g, '').split(',');

    coordsArr.forEach(coord => {
      coordsObject['x'] = parseInt(coordsArr[0]);
      coordsObject['y'] = parseInt(coordsArr[1]);
    });

    return coordsObject;
  };

  handleClick = () => {
    // this.traverseMap();
    this.moveRooms('s');
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
