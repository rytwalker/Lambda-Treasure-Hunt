import React, { Component } from 'react';
import styled from 'styled-components';

class InfoBar extends Component {
  state = {};
  render() {
    return (
      <StyledInfoBar>
        <div>You have walked north.</div>
        <div className="room">
          Room 10<span>(60,61)</span>
        </div>
      </StyledInfoBar>
    );
  }
}

const StyledInfoBar = styled.nav`
  background: #d3e5e5;
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  .room {
    span {
      color: #7dcdbe;
    }
  }
`;

export default InfoBar;
