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
    inverse: { n: 's', s: 'n', w: 'e', e: 'w' },
    message: '',
    path: [],
    progress: 0,
    room_id: 0
  };

  componentDidMount() {
    if (localStorage.hasOwnProperty('graph')) {
      let value = JSON.parse(localStorage.getItem('graph'));
      this.setState({ graph: value });
    }
    this.getLocation();
  }

  traverseMap = () => {
    let unknonwnDirections = this.getUnknownDirections();

    if (unknonwnDirections.length) {
      let move = unknonwnDirections[0];
      this.moveRooms(move);
    } else {
      // clearInterval(this.interval);
      let path = this.breadthFirstSearch();
      console.log('PATH:');
      console.log(path);
      //   let { graph, room_id } = this.state;
      //   let queue = [];
      //   let visited = new Set();
      //   console.log(graph[room_id][1]);
      //   for (let room in graph[room_id][1]) {
      //     queue = [...queue, [{ [room]: graph[room_id][1][room] }]];
      //   }

      //   while (queue.length) {
      //     let dequeued = queue.shift();

      //     let last_room = dequeued[dequeued.length - 1];

      //     for (let exit in last_room) {
      //       if (last_room[exit] === '?') {
      //         console.log('here');
      //         console.log(dequeued);
      //         for (let route of dequeued) {
      //           console.log(route);
      //           // for (let path in route) {
      //           //   setTimeout(() => this.moveRooms(path), 16000);
      //           // }
      //         }
      //       } else {
      //         visited.add(last_room[exit]);

      //         for (let path in graph[last_room[exit]][1]) {
      //           if (visited.has(graph[last_room[exit]][1][path]) === false) {
      //             let path_copy = Array.from(dequeued);
      //             path_copy.push({ [path]: graph[last_room[exit]][1][path] });

      //             queue.push(path_copy);
      //           }
      //         }
      //       }
      //     }
      //   }
      //   // this.interval = setInterval(this.traverseMap, 16000);
    }
  };

  breadthFirstSearch = () => {
    let { graph, room_id } = this.state;
    let queue = [];
    let visited = new Set();
    console.log(graph[room_id][1]);
    for (let room in graph[room_id][1]) {
      queue = [...queue, [{ [room]: graph[room_id][1][room] }]];
    }

    while (queue.length) {
      let dequeued = queue.shift();

      let last_room = dequeued[dequeued.length - 1];

      for (let exit in last_room) {
        if (last_room[exit] === '?') {
          console.log('here');
          console.log(dequeued);
          dequeued.pop();
          return dequeued;
        } else {
          visited.add(last_room[exit]);

          for (let path in graph[last_room[exit]][1]) {
            if (visited.has(graph[last_room[exit]][1][path]) === false) {
              let path_copy = Array.from(dequeued);
              path_copy.push({ [path]: graph[last_room[exit]][1][path] });

              queue.push(path_copy);
            }
          }
        }
      }
    }
  };

  getUnknownDirections = () => {
    let unknownDirections = [];
    let directions = this.state.graph[this.state.room_id][1];
    for (let direction in directions) {
      if (directions[direction] === '?') {
        unknownDirections.push(direction);
      }
    }
    return unknownDirections;
  };

  //   moveToRoom = (start, end) => {
  //     // Breadth First Search!
  //     const queue = [];

  //   }

  moveRooms = async (move, next_room_id = null) => {
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

      let previous_room_id = this.state.room_id;
      //   Update graph
      let graph = this.updateGraph(
        response.data.room_id,
        this.parseCoords(response.data.coordinates),
        response.data.exits,
        previous_room_id,
        move
      );

      this.setState({
        room_id: response.data.room_id,
        coords: this.parseCoords(response.data.coordinates),
        exits: [...response.data.exits],
        path: [...this.state.path, move],
        graph
      });
      console.log(response.data);
    } catch (error) {
      console.log('Something went wrong moving...');
    }
  };

  getLocation = () => {
    axios({
      method: 'get',
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/init/',
      headers: {
        Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
      }
    })
      .then(res => {
        let graph = this.updateGraph(
          res.data.room_id,
          this.parseCoords(res.data.coordinates),
          res.data.exits
        );
        this.setState(prevState => ({
          room_id: res.data.room_id,
          coords: this.parseCoords(res.data.coordinates),
          exits: [...res.data.exits],
          graph
        }));
      })
      .catch(err => console.log('There was an error.'));
  };

  updateGraph = (id, coords, exits, previous_room_id = null, move = null) => {
    const { inverse } = this.state;

    let graph = Object.assign({}, this.state.graph);
    if (!this.state.graph[id]) {
      let payload = [];
      payload.push(coords);
      const moves = {};
      exits.forEach(exit => {
        moves[exit] = '?';
      });
      payload.push(moves);
      graph = { ...graph, [id]: payload };
    }
    if (previous_room_id && move) {
      graph[previous_room_id][1][move] = id;
      graph[id][1][inverse[move]] = previous_room_id;
    }

    localStorage.setItem('graph', JSON.stringify(graph));
    return graph;
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
    this.setState({ generating: true });
    // this.interval = setInterval(this.traverseMap, 16000);
    this.traverseMap();
    // this.moveRooms('e');
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
