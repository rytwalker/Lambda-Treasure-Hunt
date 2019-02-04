import React, { Component } from 'react';
import styled from 'styled-components';

class About extends Component {
  render() {
    return (
      <StyledAbout>
        <div className="container">
          <h2>About</h2>
          <p>Welcome to the first annual Lambda Treasure Hunt!</p>
          <p>
            After the war between the humans and machines, we were left in a
            world straddling the line between physical and digital. You, the
            elite chosen of Lambda School, have been selected to participate in
            an hunt for digital riches. Great glory and rewards await the most
            efficient treasure hunters. Will you divine the many secrets of the
            ever-evolving island and prove yourself worthy of our algorithmic
            overlords?
          </p>
          <p>Happy hunting!</p>
        </div>
      </StyledAbout>
    );
  }
}

const StyledAbout = styled.div`
  display: flex;
  height: calc(100vh - 86px);
  ${'' /* align-items: center;
  justify-content: center; */}
  flex-direction: column;
  .container {
    max-width: 850px;
    width: 100%;
    margin: 0 auto;
    h2 {
      font-weight: 700;
      font-size: 2.4rem;
      margin: 3rem 0;
      text-transform: uppercase;
    }
    p {
      margin-bottom: 2rem;
    }
  }
`;

export default About;
