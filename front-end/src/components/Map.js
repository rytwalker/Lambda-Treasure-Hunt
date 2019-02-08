import React, { Component } from 'react';
import { FlexibleXYPlot, LineSeries, MarkSeries } from 'react-vis';

class Map extends Component {
  state = { value: null };
  render() {
    const { value } = this.state;
    const { coords, graph, links, travelToNode } = this.props;
    return (
      <div
        style={{
          margin: 'auto',
          width: '75%',
          height: '100%',
          flex: 1,
          padding: '2rem 4rem',
          position: 'relative'
        }}
      >
        {value ? (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              color: '#fff',
              fontWeight: '700',
              background: '#d3e5e5',
              padding: '.5rem 1rem',
              width: '55px',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #7dcdbe',
              transition: 'all .2s'
            }}
          >
            {value}
          </div>
        ) : null}
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
            strokeWidth={1}
            opacity="1"
            size="5"
            colorType="literal"
            data={coords}
            style={{ cursor: 'pointer', transition: 'all .2s' }}
            onValueClick={(datapoint, event) => {
              for (let key in graph) {
                if (
                  graph[key][0].x === datapoint.x &&
                  graph[key][0].y === datapoint.y
                ) {
                  travelToNode(parseInt(key));
                  console.log(key);
                  this.setState({ value: key });
                }
                // console.log(datapoint);
              }
            }}
            onValueMouseOver={(datapoint, event) => {
              for (let key in graph) {
                if (
                  graph[key][0].x === datapoint.x &&
                  graph[key][0].y === datapoint.y
                ) {
                  this.setState({ value: key });
                }
                // console.log(datapoint);
              }
            }}
            onValueMouseOut={() => {
              this.setState({ value: null });
            }}
          />
          {/* <Hint value={graph['10'][0]}>
            <div
              style={{
                background: 'rgba(0,0,0,.85)',
                color: '#f5f5f5',
                borderRadius: '5px',
                padding: '.5rem'
              }}
            >
              <h3>Room 0</h3>
            </div>
          </Hint> */}
        </FlexibleXYPlot>
      </div>
    );
  }
}

export default Map;
