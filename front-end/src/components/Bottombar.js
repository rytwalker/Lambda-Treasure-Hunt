import React, { Component } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandHolding,
  faStore,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';

class Bottombar extends Component {
  handleClick = move => {
    const { manualMove, sellTreasure } = this.props;
    if (move) {
      manualMove(move);
    }
  };
  handleSellTreasure = () => this.props.sellTreasure(this.props.inventory[0]);
  handleTakeTreasure = () => this.props.takeTreasure(this.props.items[0]);

  render() {
    const { onclick, messages } = this.props;
    return (
      <StyledBottombar>
        <Button onclick={onclick} />
        <div className="message">
          {!messages.length ? (
            <p>{'Click EXPLORE to start exploring.'}</p>
          ) : (
            messages.map(message => <span key={message}>{message} </span>)
          )}
        </div>
        <div className="buttons">
          <div className="manual-button" onClick={() => this.handleClick('n')}>
            N
          </div>
          <div className="manual-button" onClick={() => this.handleClick('s')}>
            S
          </div>
          <div className="manual-button" onClick={() => this.handleClick('w')}>
            W
          </div>
          <div className="manual-button" onClick={() => this.handleClick('e')}>
            E
          </div>
          <div className="manual-button">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div className="manual-button" onClick={this.handleSellTreasure}>
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <div className="manual-button" onClick={this.handleTakeTreasure}>
            <FontAwesomeIcon icon={faHandHolding} />
          </div>
        </div>
      </StyledBottombar>
    );
  }
}

const StyledBottombar = styled.div`
  width: 100%;
  background: #ddd;
  height: 60px;
  display: flex;
  align-items: center;

  .message {
    ${'' /* margin-left: 5rem; */}
    margin: auto;
    font-size: 2rem;
    font-weight: 700;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 25%;
    ${'' /* padding: 0 1rem; */}
    background: #525959;
    height: 100%;
    .manual-button {
      ${'' /* border: 1px solid #000; */}
      font-size: 2.4rem;
      color: #f5f5f5;
      font-weight: 700;
      transition: all 0.2s;
      cursor: pointer;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #7dcdbe;
        background: #3b3f3f;
      }
    }
  }
`;
export default Bottombar;
