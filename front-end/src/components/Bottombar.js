import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandHolding,
  faStore,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import styled, { keyframes } from 'styled-components';
import Button from './Button';

/*
The Bottombar is the interactive part of the UI. Clicking on the explore button will automatically start a random traversal through out the map. There are also commands that control manual movement and API calls.
*/

class Bottombar extends Component {
  handleManualMove = move => this.props.manualMove(move);
  handleSellTreasure = () => this.props.sellTreasure();
  handleTakeTreasure = () => this.props.takeTreasure();
  handleTravelToShop = () => this.props.travelToShop();

  render() {
    const { isExploring, messages, onclick } = this.props;
    return (
      <StyledBottombar>
        <Button onclick={onclick} isExploring={isExploring} />
        <div
          className="message"
          style={messages.length >= 4 ? { fontSize: '1.8rem' } : null}
        >
          {!messages.length ? (
            <p>{'Click EXPLORE to start exploring.'}</p>
          ) : (
            messages.map(message => (
              <span
                style={messages.length >= 4 ? { fontSize: '1.8rem' } : null}
                key={message}
              >
                {message}{' '}
              </span>
            ))
          )}
        </div>
        <div className="buttons">
          <div
            className="manual-button"
            onClick={() => this.handleManualMove('n')}
          >
            N
          </div>
          <div
            className="manual-button"
            onClick={() => this.handleManualMove('s')}
          >
            S
          </div>
          <div
            className="manual-button"
            onClick={() => this.handleManualMove('w')}
          >
            W
          </div>
          <div
            className="manual-button"
            onClick={() => this.handleManualMove('e')}
          >
            E
          </div>
          <div className="manual-button" onClick={this.handleTravelToShop}>
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

// STYLES
const fadeIn = keyframes`
   from {
     opacity: 0
   }

   to {
     opacity: 1
   }
 `;

const StyledBottombar = styled.div`
  width: 100%;
  background: #ddd;
  height: 60px;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 1s ease-in-out;

  .message {
    margin: auto;
    font-size: 2rem;
    font-weight: 700;
    span {
      animation: ${fadeIn} 0.3s ease-in-out;
    }
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
