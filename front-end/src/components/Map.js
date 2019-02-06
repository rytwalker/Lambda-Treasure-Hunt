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
          width: '100%',
          height: '100%'
        }}
      >
        <FlexibleXYPlot>
          {links.map(link => (
            <LineSeries strokeWidth="3" color="#E5E5E5" data={link} />
          ))}
          <MarkSeries
            className="mark-series-example"
            strokeWidth={5}
            opacity="1"
            size="2"
            color="#525959"
            data={coords}
          />
        </FlexibleXYPlot>
      </div>
    );
  }
}

export default Map;
