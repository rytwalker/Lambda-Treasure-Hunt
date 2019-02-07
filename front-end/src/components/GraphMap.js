import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import data from '../data.json';
import Map from './Map';
import Loading from './Loading';
import Sidebar from './Sidebar';
import Bottombar from './Bottombar.js';

class GraphMap extends Component {
  state = {
    allCoords: [],
    allLinks: [],
    coords: { x: 50, y: 60 },
    cooldown: 2,
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
    loaded: false,
    messages: [],
    name: 'Ryan',
    players: [],
    progress: 0,
    room_id: 0,
    speed: null,
    strength: null,
    title: '',
    visited: new Set()
  };

  // LIFE CYCLE METHODS

  componentDidMount() {
    if (localStorage.hasOwnProperty('graph')) {
      let value = JSON.parse(localStorage.getItem('graph'));
      this.setState({ graph: value, graphLoaded: true });
    } else {
      localStorage.setItem('graph', JSON.stringify(data));
      let value = JSON.parse(localStorage.getItem('graph'));
      this.setState({ graph: value, graphLoaded: true });
    }
    this.init();
  }

  componentDidUpdate(prevState) {
    if (!this.state.allCoords.length && this.state.graph) {
      this.mapLinks();
      this.mapCoords();
      setTimeout(() => this.setState({ loaded: true }), 10);
    }
  }

  init = async () => {
    await this.getLocation();
    await this.wait(1000 * this.state.cooldown);
    await this.getStatus();
  };

  // API METHODS
  changeName = () => {
    axios({
      method: 'post',
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/change_name/',
      headers: {
        Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
      },
      data: {
        name: 'Pirate Ry'
      }
    })
      .then(res => {
        console.log(res.data);
        this.setState({ messages: [...res.data.messages] }, () =>
          this.getStatus()
        );
      })
      .catch(err => {
        console.log('There was an error.');
        console.dir(err);
      });
  };

  FlyToRooms = async (move, next_room_id = null) => {
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
        url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/fly/`,
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
      this.setState({
        cooldown: error.response.data.cooldown,
        messages: [...error.response.data.errors]
      });
      throw error;
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
          cooldown: res.status.cooldown,
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
          errors: [...res.data.errors]
        }));
      })
      .catch(err => {
        console.log('There was an error.');
        console.dir(err);
      });
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

  prayToShrine = () => {
    axios({
      method: 'post',
      url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/pray/',
      headers: {
        Authorization: 'Token 895925acf149cba29f6a4c23d85ec0e47d614cdb'
      }
    })
      .then(res => {
        console.log(res.data);
        this.setState({ messages: [...res.data.messages] }, () =>
          this.getStatus()
        );
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
        this.setState({
          messages: [...res.data.messages],
          cooldown: res.data.cooldown
        });
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
        this.setState(
          {
            messages: res.data.messages,
            items: res.data.items,
            players: res.data.players,
            cooldown: res.data.cooldown
          },
          () => this.wait(1000 * res.data.cooldown)
        );
        console.log(res.data);
      })
      .then(() => this.getStatus())
      .catch(err => {
        console.log('There was an error.');
        console.dir(err);
      });
  };

  // AUTOMATED METHODS
  exploreMap = () => {
    const { graph, room_id, items } = this.state;
    let exits = [...this.state.exits];
    let random = Math.floor(Math.random() * exits.length);
    let nextRoom = graph[room_id][1][exits[random]];

    if (this.state.encumbrance >= 9) {
      this.travelToShop()
        .then(() => this.sellAllTreasure())
        .then(() => this.exploreMap());
    } else {
      // Move
      this.FlyToRooms(exits[random], nextRoom).then(() => {
        // Check for items
        console.log(items.length);
        if (items.length) {
          console.log('here');
          this.takeAllTreasures();
        }
      });
      // .then(() => {
      //   setTimeout(this.exploreMap, 1000 * this.state.cooldown);
      // });
    }
  };

  sellAllTreasure = async () => {
    const { inventory, cooldown } = this.state;
    for (let treasure of inventory) {
      await this.wait(1000 * cooldown);
      await this.sellTreasure(treasure);
      await this.wait(1000 * cooldown);
      await this.getStatus();
    }
  };

  takeAllTreasures = async () => {
    const { items } = this.state;
    for (let item of items) {
      await this.wait(1000 * this.state.cooldown);
      await this.takeTreasure(item);
    }
  };

  travelToShop = async () => {
    const path = this.findShortestPath(this.state.room_id, 1);
    console.log(path);
    if (typeof path === 'string') {
      console.log(path);
    } else {
      for (let direction of path) {
        console.log(direction);
        for (let d in direction) {
          await this.wait(1000 * this.state.cooldown);
          await this.FlyToRooms(d, direction[d]);
        }
      }
    }
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

  // HELPER MATHODS
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
          dequeued.forEach(item => {
            for (let key in item) {
              graph[item[key]][0].color = '#9A4F53';
            }
          });
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

  mapCoords = () => {
    const { graph, room_id } = this.state;
    const setCoords = [];
    for (let room in graph) {
      let data = graph[room][0];
      // eslint-disable-next-line
      if (room != room_id) {
        data.color = '#525959';
      }
      setCoords.push(data);
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

  parseCoords = coords => {
    const coordsObject = {};
    const coordsArr = coords.replace(/[{()}]/g, '').split(',');

    coordsArr.forEach(coord => {
      coordsObject['x'] = parseInt(coordsArr[0]);
      coordsObject['y'] = parseInt(coordsArr[1]);
    });

    return coordsObject;
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
    if (previous_room_id !== null) {
      graph[previous_room_id][0].color = '#525959';
      graph[id][0].color = '#7dcdbe';
    } else {
      graph[0][0].color = '#525959';
      graph[id][0].color = '#7dcdbe';
    }

    localStorage.setItem('graph', JSON.stringify(graph));
    return graph;
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

  wait = async ms => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };

  // EVENT METHODS
  manualMove = move => {
    const { graph, room_id } = this.state;

    if (graph[room_id][1][move] || graph[room_id][1][move] === 0) {
      this.FlyToRooms(move, graph[room_id][1][move]);
    } else {
      this.setState({ messages: ["You can't go that way."] });
    }
  };

  handleClick = () => {
    // let path = this.findShortestPath(10, 22);
    // console.log(path);
    // this.prayToShrine();
    // this.FlyToRooms('n', 10);
    this.exploreMap();
  };

  render() {
    const {
      coords,
      description,
      encumbrance,
      gold,
      inventory,
      items,
      loaded,
      messages,
      name,
      players,
      room_id,
      speed,
      strength,
      title
    } = this.state;
    return (
      <StyledGraphMap onKeyPress={this.handleKeyPress}>
        {loaded ? (
          <>
            <Map coords={this.state.allCoords} links={this.state.allLinks} />
            <Sidebar
              coords={coords}
              description={description}
              encumbrance={encumbrance}
              gold={gold}
              inventory={inventory}
              items={items}
              name={name}
              players={players}
              room_id={room_id}
              speed={speed}
              strength={strength}
              title={title}
            />
            <Bottombar
              inventory={inventory}
              items={items}
              manualMove={this.manualMove}
              messages={messages}
              onclick={this.handleClick}
              sellTreasure={this.sellAllTreasure}
              takeTreasure={this.takeAllTreasures}
              travelToShop={this.travelToShop}
            />
          </>
        ) : (
          <Loading />
        )}

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
