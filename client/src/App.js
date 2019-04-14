import React, { Component } from 'react';
import GameEngine from './GameEngine.js';
import realbutton from './buttonSVGs/realPlaybutton.svg';
import settingsbutton from './buttonSVGs/settingsbutton.svg';
import statsbutton from './buttonSVGs/statsbutton.svg';
import title from './buttonSVGs/title.svg';
import './App.css';
import Settings from './settings';
import Statistics from './Statistics';
/* eslint-disable react/prefer-stateless-function */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: [
        'm 0, 442 h 159 v -79 h 159 v 79 h 95 v 95 h 143 v -95 h 381 v -95 h 159 v 95 h 238 v -95 h 365 v -95 h 286 v -95 h 143 v 413 h 333 v -95 h 603 v 95 h 238 v -79 h 143 v 175 h 127 v -79 h 143 v -95 h 111 v 16 h 429 v -143 h 111 v 143 h 333 v -111 h 127 v 111 h 270 v 143 h 143 v -79 h 79 v -79 h 238 v -127 h 175 v 127 h 143 v -95 h 127 v 238 h 159 v -111 h 270 v -127 h 159 v 175 h 238 v -111 h 190 v 95 h 127 v -127 h 397 v -127 h 190 v 190 h 206 v -95 h 111 v 79 h 127 v -111 h 111 v 143 h 95 v -127 h 127 v 143 h 127 v -127 h 127 v 318 h 460 v -175 h 127 v 143 h 111 v -222 h 333 v -127 h 412 v 3'
      ],
      strokeWidth: 6,
      mode: 'menu'
    };
    this.handleGoToMenu = this.handleGoToMenu.bind(this);
  }
  handleGoToMenu() {
    this.setState({ mode: 'menu' });
  }
  render() {
    const { mode } = this.state;
    if (mode === 'game') {
      return <GameEngine mapProps={Object.assign({}, this.state)} />;
    }
    if (mode === 'menu') {
      return (
        <div>
          <header>
            <img src={title} className="titlelogo" alt="title" />
          </header>
          <div class="play-button">
            <img
              src={realbutton}
              height="50"
              className="playlogo"
              alt="play"
              onClick={() => this.setState({ mode: 'game' })}
            />
            <div class="settings-button">
              <img
                src={settingsbutton}
                height="50"
                className="settinsglogo"
                alt="settings"
                onClick={() => this.setState({ mode: 'settings' })}
              />
              <div class="stats-button">
                <img
                  src={statsbutton}
                  height="50"
                  className="statslogo"
                  alt="stats"
                  onClick={() => this.setState({ mode: 'stats' })}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (mode === 'settings') {
      return (
        <div>
          <Settings GoToMenu={this.handleGoToMenu} />
        </div>
      );
    }
    if (mode === 'stats') {
      return (
        <div>
          <Statistics GoToMenu={this.handleGoToMenu} />
        </div>
      );
    }
  }
}

export default App;
