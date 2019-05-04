import styled from 'styled-components';
import request from 'request-promise-native';
import React, { Component } from 'react';
import { ReactComponent as title } from './buttonSVGs/title.svg';
import GameEngine from './GameEngine.js';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import realbutton from './buttonSVGs/realPlaybutton.svg';
import settingsbutton from './buttonSVGs/settingsbutton.svg';
import statsbutton from './buttonSVGs/statsbutton.svg';
import Settings from './menus/settings.js';
import Statistics from './menus/Statistics.js';
import MapChoice from './MapChoice.js';
import './App.css';

const GOOGLE_CLIENT_ID =
  '106374852521-g72q4hfca8bc1u3hvjhjial2e1moadri.apps.googleusercontent.com';

const GUEST_ACCOUNT = {
  email: 'Guest',
  total_games: 0,
  total_multi_games: 0,
  total_multi_wins: 0,
  map_1: Infinity
};

const StyledTitle = styled(title)`
  height: 100;
`;

const StyledButton = styled.img`
  display: block;
  margin: auto;
`;

/* eslint-disable react/prefer-stateless-function */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: [
        'm 0, 450 h 359 v -180 h 159 v 100 h 95 v 100 h 143 v -100 h 381 v -100 h 159 v 100 h 238 v -95 h 365 v -95 h 286 v -95 h 143 v 413 h 333 v -95 h 603 v 95 h 238 v -79 h 143 v 175 h 127 v -79 h 143 v -95 h 111 v 16 h 429 v -143 h 111 v 143 h 333 v -111 h 127 v 111 h 270 v 143 h 143 v -79 h 79 v -79 h 238 v -127 h 175 v 127 h 143 v -95 h 127 v 238 h 159 v -111 h 270 v -127 h 159 v 175 h 238 v -111 h 190 v 95 h 127 v -127 h 397 v -127 h 190 v 190 h 206 v -95 h 111 v 79 h 127 v -111 h 111 v 143 h 95 v -127 h 127 v 143 h 127 v -127 h 127 v 318 h 460 v -175 h 127 v 143 h 111 v -222 h 333 v -127 h 412 v -1000 h 500'
      ],
      strokeWidth: 6, // must be an even number for the parsing algorithm
      guest: GUEST_ACCOUNT,
      user: GUEST_ACCOUNT,
      mode: 'menu',
      multi: false,
      loggedIn: false,
      nickName: 'guest',
      playercolor: `rgb(${Math.random() * 255},${Math.random() *
        255},${Math.random() * 255})`
    };

    this.handleGoToMenu = this.handleGoToMenu.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleGoogleFailure = this.handleGoogleFailure.bind(this);
    this.handleGoogleLogout = this.handleGoogleLogout.bind(this);
    this.handleStats = this.handleStats.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.playerName = this.playerName.bind(this);
  }

  selectColor(selectedColor) {
    this.setState({ playercolor: selectedColor });
  }

  playerName(chosenName) {
    this.setState({ nickName: chosenName });
  }
  // username and password both strings
  handleStats() {
    if (!this.state.guest) {
      const options = {
        url: `${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://rollrace.herokuapp.com'
        }/api/users/stats`,
        json: true
      };
      request
        .get(options)
        .then(resp => {
          this.setState({ user: resp });
        })
        .catch(err => {
          throw Error(err);
        });
    } else {
      this.setState({ user: this.state.guest });
    }
  }

  handleGoogleLogin(response) {
    fetch('/login', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${response.tokenId}`
      }
    }).then(fetchResponse => {
      if (!fetchResponse.ok) {
        alert('Unable to authenticate', fetchResponse.statusText);
        this.setState({ loggedIn: false }, this.handleStats);
      } else {
        this.setState({ loggedIn: true, guest: null }, this.handleStats);
      }
    });
  }

  handleGoogleFailure(err) {
    console.log(err);
  }
  handleGoogleLogout() {
    this.setState({
      loggedIn: false,
      guest: GUEST_ACCOUNT,
      user: GUEST_ACCOUNT
    });
  }

  handleGoToMenu() {
    this.setState({ mode: 'menu' });
  }

  render() {
    const loginButton = (
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        isSignedIn
        onSuccess={this.handleGoogleLogin}
        onFailure={this.handleGoogleFailure}
      />
    );

    const logoutButton = (
      <GoogleLogout
        clientId={GOOGLE_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={this.handleGoogleLogout}
      />
    );

    switch (this.state.mode) {
      case 'menu':
        return (
          <div>
            <StyledTitle height="120" width="100%" />
            <div className="play-button">
              <StyledButton
                src={realbutton}
                height="50"
                alt="play"
                onClick={() => this.setState({ mode: 'game', multi: false })}
              />
              <StyledButton
                src={realbutton}
                height="50"
                alt="playmulti"
                onClick={() => this.setState({ mode: 'game', multi: true })}
              />
              <StyledButton
                src={settingsbutton}
                height="50"
                alt="settings"
                onClick={() => this.setState({ mode: 'settings' })}
              />
              <StyledButton
                src={statsbutton}
                height="50"
                alt="stats"
                onClick={() =>
                  this.setState({ mode: 'stats' }, this.handleStats)
                }
              />
            </div>
            <MapChoice
              key={'mapchoice'}
              func={() => console.log('func called')}
            />
            <div>
              <h3>
                Current User:{' '}
                {this.state.user ? this.state.user.email : 'Guest'}
              </h3>
              {!this.state.loggedIn && loginButton}
              {this.state.loggedIn && logoutButton}
            </div>
          </div>
        );

      case 'game':
        return (
          <GameEngine
            mapProps={Object.assign(
              {},
              { map: this.state.map, strokeWidth: this.state.strokeWidth }
            )}
            goToMenu={this.handleGoToMenu}
            guest={this.state.guest}
            multi={this.state.multi}
            playercolor={this.state.playercolor}
            playername={this.state.nickName}
          />
        );

      case 'settings':
        return (
          <div>
            <Settings
              goToMenu={this.handleGoToMenu}
              selectedColor={this.selectColor}
              pickName={this.playerName}
            />
          </div>
        );

      case 'stats':
        return (
          <div>
            <Statistics goToMenu={this.handleGoToMenu} user={this.state.user} />
          </div>
        );

      // error
      default:
        break;
    }
  }
}

export default App;
