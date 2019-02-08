import React from 'react';
import styled, { keyframes } from 'styled-components';
import ProgressBar from './ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

/*
This component displays most of the information retrieved from the API.
*/

const Sidebar = ({
  clickedDescription,
  clickedTitle,
  coords,
  encumbrance,
  description,
  examine,
  gold,
  handleClickable,
  inventory,
  isClicked,
  items,
  players,
  name,
  room_id,
  speed,
  strength,
  title
}) => {
  return (
    <StyledSidebar>
      <div className="room">
        <h2 className="room-id">
          Room {room_id}{' '}
          <span className="coords">{`(${coords.x}, ${coords.y})`}</span>
        </h2>

        <div className="room-info info">
          <h3>{isClicked ? clickedTitle : title}</h3>
          <p>{isClicked ? clickedDescription : description}</p>
          <p onClick={() => handleClickable()} className="back-button">
            {isClicked ? 'back' : null}
          </p>
        </div>
        <div className="info">
          <h3>Items</h3>
          {!items.length ? (
            <p>There are no items in this room.</p>
          ) : (
            items.map(item => (
              <span
                className="room-clickable"
                onClick={() => examine(item)}
                key={item + Math.random()}
              >
                {item}{' '}
              </span>
            ))
          )}
        </div>
        <div className="info">
          <h3>Players</h3>
          {!players.length ? (
            <p>There are no players in this room.</p>
          ) : (
            players.map(player => (
              <span
                className="room-clickable"
                onClick={() => examine(player)}
                key={player}
              >
                {player}{' '}
              </span>
            ))
          )}
        </div>
      </div>
      <div className="player">
        <div className="player-id">
          <h2>{name}</h2>
          <div className="gold-info">
            <FontAwesomeIcon icon={faDollarSign} /> <span>{gold}</span>
          </div>
        </div>
        <ProgressBar sidebar />
        <div className="player-stats">
          <ul>
            <li>
              Encumbrance: <span>{encumbrance}</span>
            </li>
            <li>
              Strength: <span>{strength}</span>
            </li>
            <li>
              Speed: <span>{speed}</span>
            </li>
            <li>
              <input type="text" className="secret-input" />
              <button>+</button>
            </li>
          </ul>
          <ul>
            <li className="inventory">
              Inventory:{' '}
              <span>
                {!inventory.length ? (
                  <p>Empty.</p>
                ) : (
                  inventory.map(item => (
                    <span
                      className="inventory-item"
                      onClick={() => examine(item)}
                      key={item + Math.random()}
                    >
                      {item}{' '}
                    </span>
                  ))
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </StyledSidebar>
  );
};

// STYLES

const fadeIn = keyframes`
   from {
     opacity: 0
   }

   to {
     opacity: 1
   }
 `;

const StyledSidebar = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #d3e5e5;
  animation: ${fadeIn} 1s ease-in-out;

  .room {
    padding: 2rem;
    ${'' /* flex: 1; */}
    height: 55%;
    overflow: auto;

    .room-id {
      font-size: 2.4rem;
      font-weight: 700;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      span {
        color: #7dcdbe;
      }
    }
    .info {
      h3 {
        font-size: 1.8rem;
        font-weight: 700;
      }
      p {
        margin-bottom: 1rem;
        font-size: 1.4rem;
      }

      .back-button {
        ${'' /* width: 50px; */}
        display: inline;
      }

      .room-clickable,
      .back-button {
        border-bottom: 3px solid #7dcdbe;
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
          background: #7dcdbe;
          color: #f5f5f5;
        }
      }
    }
    .room-info {
      h3 {
        font-size: 2rem;
      }
    }
  }
  .player {
    background: #7dcdbe;
    height: 45%;
    width: 100%;
    padding: 2rem;
    .player-id {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      ${'' /* margin-bottom: 1rem; */}
      h2 {
        font-size: 2.4rem;
        font-weight: 700;
        text-transform: uppercase;
      }
      .gold-info {
        font-size: 2rem;
        span {
          font-weight: 700;
          color: #d3e5e5;
        }
      }
    }
    .player-stats {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 2rem;
      ul {
        width: 45%;
        li {
          display: flex;
          justify-content: space-between;
          font-size: 1.8rem;
          .secret-input {
            background: #7dcdbe;
            border: none;
            width: 50px;
            padding: 0 0.5rem;
            color: #f5f5f5;
            font-weight: 700;
            &:focus {
              border: 3px solid #d3e5e5;
              outline: none;
            }
          }
          button {
            border: none;
            background: #7dcdbe;
            cursor: pointer;
            color: #f5f5f5;
            font-weight: 700;
          }
          span {
            font-weight: 700;
            color: #d3e5e5;
          }
        }
        .inventory {
          flex-direction: column;
          .inventory-item {
            display: block;
            font-size: 1.2rem;
            background: #3b3f3f;
            padding: 0.5rem;
            border-radius: 5px;
            text-align: center;
            transition: all 0.2s;
            cursor: pointer;
            &:hover {
              background: #d3e5e5;
              color: #3b3f3f;
            }
            &:not(:last-child) {
              margin-bottom: 0.75rem;
            }
          }
        }
      }
    }
  }
`;

export default Sidebar;
