import React, { Component } from 'react';
import { FlexibleXYPlot, LineSeries, MarkSeries } from 'react-vis';

class Map extends Component {
  state = {};
  render() {
    const { coords, links } = this.props;
    return (
      <div
        style={{
          margin: 'auto',
          width: '75%',
          height: '100%',
          flex: 1,
          padding: '2rem 4rem'
        }}
      >
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
            strokeWidth={5}
            opacity="1"
            size="3"
            colorType="literal"
            data={coords}
          />
        </FlexibleXYPlot>
      </div>
    );
  }
}

export default Map;
