import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
// import logo from '../images/logo.png';
// import ProgressBar from './ProgressBar';
import data from '../data.json';
import Map from './Map';
import Sidebar from './Sidebar';
import Bottombar from './Bottombar.js';

class GraphMap extends Component {
  state = {
    allCoords: [],
    allLinks: [],
    coords: { x: 50, y: 60 },
    cooldown: 15,
    description: '',
    encumbrance: null,
    error: '',
    exits: [],
    items: [],
    generating: false,
    gold: null,
    graph: {},
    graphLoaded: false,
    inventory: [],
    inverse: { n: 's', s: 'n', w: 'e', e: 'w' },
    messages: [],
    name: 'Ryan',
    path: [],
    players: [],
    progress: 0,
    room_id: 0,
    speed: null,
    strength: null,
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
    this.getStatus();
  }

  componentDidUpdate(prevState) {
    if (!this.state.allCoords.length && this.state.graph) {
      this.mapLinks();
      this.mapCoords();
    }
  }

  travelToShop = () => {
    let count = 1;
    const path = this.findShortestPath(this.state.room_id, 1);
    console.log(path);
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
  };

  getStatus = () => {
    axios({
      method: 'post',
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/status/',
      headers: {
        Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
      }
    })
      .then(res => {
        console.log(res.data);

        this.setState(prevState => ({
          name: res.data.name,
          cooldown: res.data.cooldown,
          encumbrance: res.data.encumbrance,
          strength: res.data.strength,
          speed: res.data.speed,
          gold: res.data.gold,
          inventory: [...res.data.inventory],
          status: [...res.data.status],
          errors: [...res.data.errors],
          messages: [...res.data.messages]
        }));
      })
      .catch(err => {
        console.log('There was an error.');
        console.dir(err);
      });
  };

  sellTreasure = name => {
    axios({
      method: 'post',
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/',
      headers: {
        Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
      },
      data: {
        name,
        confirm: 'yes'
      }
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log('There was an error.');
        console.dir(err);
      });
  };

  takeTreasure = name => {
    axios({
      method: 'post',
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/take/',
      headers: {
        Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
      },
      data: {
        name
      }
    })
      .then(res => {
        this.setState({
          messages: res.data.messages,
          items: res.data.items,
          players: res.data.players
        });
        console.log(res.data);
      })
      .catch(err => {
        console.log('There was an error.');
        console.dir(err);
      });
  };

  mapCoords = () => {
    const { graph } = this.state;
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

  exploreMap = () => {
    const { graph, room_id } = this.state;

    let exits = [...this.state.exits];
    // Pick one at random
    let random = Math.floor(Math.random() * exits.length);
    // Move
    this.moveRooms(exits[random], graph[room_id][exits[random]])
      .then(() => {
        // Check for items
        if (this.state.items.length) {
          console.log(this.state.items[0]);
          setTimeout(() => {
            this.takeTreasure(this.state.items[0]);
          }, 1000 * this.state.cooldown);
        }
      })
      .then(() => {
        setTimeout(this.getStatus, 1000 * this.state.cooldown);
      })
      // .then(() => {
      //   if (this.state.encumbrance > 5) {
      //     this.travelToShop();

      //     this.state.items.forEach((item, i) => {
      //       setTimeout(
      //         () => this.sellTreasure(item),
      //         1000 * this.state.cooldown * i + 1
      //       );
      //     });
      //   }
      // })
      // .then(() => {
      //   setTimeout(this.getStatus, 1000 * this.state.cooldown);
      // })
      .then(() => {
        setTimeout(this.exploreMap, 1000 * this.state.cooldown);
      });
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
          if (target === '?') {
            dequeued.pop();
          }
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
        messages: response.data.messages,
        description: response.data.description,
        title: response.data.title,
        players: response.data.players,
        items: response.data.items,
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
          players: res.data.players,
          items: res.data.items,
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
    // Make node if none
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

    if (
      previous_room_id !== null &&
      move &&
      previous_room_id !== id &&
      graph[previous_room_id][1][move] === '?'
    ) {
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
    // this.setState({ generating: true });
    // this.traverseMap();
    // this.moveRooms('w', 1);
    // this.takeTreasure('tiny treasure');
    // this.travelToShop();
    this.sellTreasure('treasure');
    // this.exploreMap();
  };
  render() {
    const {
      players,
      items,
      graph,
      coords,
      room_id,
      title,
      description,
      messages,
      name,
      encumbrance,
      strength,
      speed,
      gold,
      inventory
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
          name={name}
          encumbrance={encumbrance}
          strength={strength}
          speed={speed}
          gold={gold}
          inventory={inventory}
        />
        <Bottombar onclick={this.handleClick} messages={messages} />
        {/*
        <ProgressBar progress={progress} /> */}
      </StyledGraphMap>
    );
  }
}

const StyledGraphMap = styled.div`
  display: flex;
  height: calc(100vh - 120px);
  align-items: center;
  ${'' /* justify-content: center; */}
  flex-wrap: wrap;
  ${'' /* flex-direction: column; */}

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
