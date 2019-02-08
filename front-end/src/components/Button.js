import React, { Component } from 'react';
import styled from 'styled-components';

class Button extends Component {
  state = {};
  handleClick = () => {
    this.props.onclick();
  };
  render() {
    const { isExploring } = this.props;
    return (
      <StyledButton className="btn" onClick={this.handleClick}>
        {isExploring ? 'Exploring...' : 'Explore'}
      </StyledButton>
    );
  }
}

const StyledButton = styled.button`
  width: 200px;
  height: 100%;
  background: #525959;
  border: 1px solid transparent;
  ${'' /* border-radius: 10px; */}
  font-size: 2rem;
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
`;

export default Button;
