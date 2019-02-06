import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
// import logo from '../images/logo.png';
// import ProgressBar from './ProgressBar';
import data from '../data.json';
import Map from './Map';
import Sidebar from './Sidebar';

class GraphMap extends Component {
  state = {
    allCoords: [],
    allLinks: [],
    coords: { x: 50, y: 60 },
    cooldown: 15,
    description: '',
    error: '',
    exits: [],
    items: [],
    generating: false,
    graph: {},
    graphLoaded: false,
    inverse: { n: 's', s: 'n', w: 'e', e: 'w' },
    message: '',
    path: [],
    players: [],
    progress: 0,
    room_id: 0,
    title: '',
    visited: new Set()
  };

  componentDidMount() {
    if (localStorage.hasOwnProperty('graph')) {
      let value = JSON.parse(localStorage.getItem('graph'));
      this.setState({ graph: value, graphLoaded: true });
    } else {
      localStorage.setItem('graph', JSON.stringify(data));
      let value = JSON.parse(localStorage.getItem('graph'));
      this.setState({ graph: value, graphLoaded: true });
    }
    this.getLocation();
  }

  componentDidUpdate(prevState) {
    if (!this.state.allCoords.length && this.state.graph) {
      this.mapLinks();
      this.mapCoords();
    }
  }

  mapCoords = () => {
    const { graph } = this.state;
    console.log(this.state.graph);
    const setCoords = [];
    for (let room in graph) {
      setCoords.push(graph[room][0]);
    }
    this.setState({ allCoords: setCoords });
  };

  mapLinks = () => {
    const { graph } = this.state;
    const setLinks = [];
    for (let room in graph) {
      for (let linkedRoom in graph[room][1]) {
        setLinks.push([graph[room][0], graph[graph[room][1][linkedRoom]][0]]);
      }
    }
    this.setState({ allLinks: setLinks });
  };

  traverseMap = () => {
    let count = 1;
    let unknownDirections = this.getUnknownDirections();
    console.log(`UNKNOWN DIRECTIONS: ${unknownDirections}`);
    if (unknownDirections.length) {
      let move = unknownDirections[0];
      this.moveRooms(move);
    } else {
      let path = this.findShortestPath();
      if (typeof path === 'string') {
        console.log(path);
      } else {
        for (let direction of path) {
          console.log(direction);
          for (let d in direction) {
            setTimeout(() => {
              this.moveRooms(d, direction[d]);
            }, this.state.cooldown * 1000 * count);
            count++;
          }
        }
      }
    }

    if (this.state.visited.size < 499) {
      setTimeout(this.traverseMap, this.state.cooldown * 1000 * count + 1000);
      this.updateVisited();
      count = 1;
    } else {
      console.log('Traversal Complete');
      this.setState({ generating: false });
    }
  };

  updateVisited = () => {
    // UPDATE PROGRESS
    let visited = new Set(this.state.set);
    for (let key in this.state.graph) {
      if (!visited.has(key)) {
        let qms = [];
        for (let direction in key) {
          if (key[direction] === '?') {
            qms.push(direction);
          }
        }
        if (!qms.length) {
          visited.add(key);
        }
      }
    }
    let progress = Math.round((visited.size / 500) * 100);
    this.setState({ visited, progress });
  };

  findShortestPath = (start = this.state.room_id, target = '?') => {
    let { graph } = this.state;
    let queue = [];
    let visited = new Set();
    for (let room in graph[start][1]) {
      queue = [...queue, [{ [room]: graph[start][1][room] }]];
    }

    while (queue.length) {
      let dequeued = queue.shift();

      let last_room = dequeued[dequeued.length - 1];

      for (let exit in last_room) {
        if (last_room[exit] === target) {
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
    return 'That target does not exisit.';
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

  moveRooms = async (move, next_room_id = null) => {
    let data;
    if (next_room_id !== null) {
      data = {
        direction: move,
        next_room_id: next_room_id.toString()
      };
    } else {
      data = {
        direction: move
      };
    }
    try {
      const response = await axios({
        method: 'post',
        url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`,
        headers: {
          Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
        },
        data
      });

      let previous_room_id = this.state.room_id;
      console.log(`PREVIOUS ROOM: ${previous_room_id}`);
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
        cooldown: response.data.cooldown,
        message: response.data.messages[0],
        description: response.data.description,
        title: response.data.title,
        graph
      });
      console.log(response.data);
    } catch (error) {
      console.log('Something went wrong moving...');
      console.dir(error);
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
        console.log(res.data);
        let graph = this.updateGraph(
          res.data.room_id,
          this.parseCoords(res.data.coordinates),
          res.data.exits
        );
        this.setState(prevState => ({
          room_id: res.data.room_id,
          coords: this.parseCoords(res.data.coordinates),
          exits: [...res.data.exits],
          description: res.data.description,
          title: res.data.title,
          graph
        }));
        this.updateVisited();
      })
      .catch(err => {
        console.log('There was an error.');
        console.dir(err);
      });
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
    if (previous_room_id !== null && move && previous_room_id !== id) {
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
    this.traverseMap();
  };
  render() {
    const {
      progress,
      players,
      items,
      graph,
      message,
      error,
      coords,
      room_id,
      title,
      description,
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
        {graph ? (
          <Map coords={this.state.allCoords} links={this.state.allLinks} />
        ) : (
          <div>Loading</div>
        )}
        <Sidebar
          room_id={room_id}
          coords={coords}
          title={title}
          description={description}
          items={items}
          players={players}
        />
        {/* <button className="btn" onClick={this.handleClick}>
          <img src={logo} alt="Jolly Roger" />
          {generating ? 'Generating...' : 'Generate Map'}
        </button>
        <ProgressBar progress={progress} /> */}
        {generating && (
          <code className="log-container">
            <div className="log">
              <p>
                <span className="log-label">Room:</span>
                {room_id}
              </p>
              <p>
                <span className="log-label">Title:</span>
                {title}
              </p>
              <p>
                <span className="log-label">Description:</span>
                {description}
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
  height: calc(100vh - 60px);
  align-items: center;
  justify-content: center;
  ${'' /* flex-direction: column; */}

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
