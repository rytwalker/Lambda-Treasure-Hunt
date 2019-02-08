import React, { Component } from 'react';
import { FlexibleXYPlot, LineSeries, MarkSeries } from 'react-vis';
import styled, { keyframes } from 'styled-components';

/*
This component renders the map. It uses the react-vis library by Uber to print out the nodes and edges of the graph.
*/

class Map extends Component {
  state = { value: null };
  render() {
    const { value } = this.state;
    const { coords, graph, links, travelToNode } = this.props;
    return (
      <StyledMap>
        {value ? <StyledIdPopup>{value}</StyledIdPopup> : null}
        <FlexibleXYPlot>
          {links.map(link => (
            <LineSeries
              strokeWidth="3"
              color="#DDDDDD"
              data={link}
              key={Math.random() * 100}
            />
          ))}
          <MarkSeries
            className="mark-series-example"
            strokeWidth={2}
            opacity="1"
            size="4"
            colorType="literal"
            data={coords}
            style={{ cursor: 'pointer', transition: 'all .2s' }}
            // Get the id and travels to that node onClick
            onValueClick={datapoint => {
              for (let key in graph) {
                if (
                  graph[key][0].x === datapoint.x &&
                  graph[key][0].y === datapoint.y
                ) {
                  travelToNode(parseInt(key));
                  this.setState({ value: key });
                }
              }
            }}
            // Show the id of the moused over node in the UI
            onValueMouseOver={datapoint => {
              for (let key in graph) {
                if (
                  graph[key][0].x === datapoint.x &&
                  graph[key][0].y === datapoint.y
                ) {
                  this.setState({ value: key });
                }
              }
            }}
            onValueMouseOut={() => {
              this.setState({ value: null });
            }}
          />
        </FlexibleXYPlot>
      </StyledMap>
    );
  }
}

const fadeIn = keyframes`
   from {
     opacity: 0
   }

   to {
     opacity: 1
   }
 `;

const StyledMap = styled.div`
  margin: auto;
  width: 75%;
  height: 100%;
  flex: 1;
  padding: 3rem 4rem 2rem 3rem;
  position: relative;
  animation: ${fadeIn} 2s ease-in-out 0.6;
`;

const StyledIdPopup = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  font-weight: 700;
  background: #d3e5e5;
  padding: 0.5rem 1rem;
  width: 55px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #7dcdbe;
  transition: all 0.2s;
`;

export default Map;
