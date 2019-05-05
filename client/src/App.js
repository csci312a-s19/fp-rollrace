import React, { Component } from 'react';
// import { Button, ButtonGroup } from 'reactstrap';
import styled from 'styled-components';
import request from 'request-promise-native';
import GameEngine from './Engine/GameEngine.js';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Settings from './MainMenu/Settings.js';
import Statistics from './MainMenu/Statistics.js';
// import MapChoice from './MainMenu/MapChoice.js';

const GOOGLE_CLIENT_ID =
  '106374852521-g72q4hfca8bc1u3hvjhjial2e1moadri.apps.googleusercontent.com';

const GUEST_ACCOUNT = {
  email: 'Guest',
  total_games: 0,
  total_multi_games: 0,
  total_multi_wins: 0,
  map_1: Infinity
};

const CenteredDiv = styled.div`
  text-align: center;
  padding: 0px;
`;

const StyledButton = styled.button`
  background-color: #008cba;
  font-size: 24px;
  border-radius: 12px;
  border: 2px solid #555555;
  font-family: monospace;
`;

const Background = styled.div`
  background-color: black;
  margin: 0px;
  height: 100vh;
`;

const Title = styled.h1`
  background: linear-gradient(
    52deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(255, 255, 255, 1) 59%,
    rgba(254, 253, 252, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-top: 10%;
  padding-bottom: 10%;
  font-family: 'Gugi', cursive;
  font-size: 1200%;
`;

const CurrentUser = styled.h3`
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 100%;
`;

/* eslint-disable react/prefer-stateless-function */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: [
        'm 0, 650 h 359 v -180 h 159 v 100 h 95 v 100 h 143 v -100 h 381 v -100 h 159 v 100 h 238 v -95 h 365 v -95 h 286 v -95 h 143 v 413 h 333 v -95 h 603 v 95 h 238 v -79 h 143 v 175 h 127 v -79 h 143 v -95 h 111 v 16 h 429 v -143 h 111 v 143 h 333 v -111 h 127 v 111 h 270 v 143 h 143 v -79 h 79 v -79 h 238 v -127 h 175 v 127 h 143 v -95 h 127 v 238 h 159 v -111 h 270 v -127 h 159 v 175 h 238 v -111 h 190 v 95 h 127 v -127 h 397 v -127 h 190 v 190 h 206 v -95 h 111 v 79 h 127 v -111 h 111 v 143 h 95 v -127 h 127 v 143 h 127 v -127 h 127 v 318 h 460 v -175 h 127 v 143 h 111 v -222 h 333 v -127 h 412 v -1000 h 500'
      ],
      strokeWidth: 6, // must be an even number for the parsing algorithm
      guest: GUEST_ACCOUNT,
      user: GUEST_ACCOUNT,
      mode: 'menu',
      multi: false,
      loggedIn: false,
      playercolor: `rgb(${Math.random() * 255},${Math.random() *
        255},${Math.random() * 255})`
    };

    this.handleGoToMenu = this.handleGoToMenu.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleGoogleFailure = this.handleGoogleFailure.bind(this);
    this.handleGoogleLogout = this.handleGoogleLogout.bind(this);
    this.handleStats = this.handleStats.bind(this);
    this.selectColor = this.selectColor.bind(this);
  }

  selectColor(selectedColor) {
    this.setState({ playercolor: selectedColor });
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
          <Background>
            <CenteredDiv>
              <Title>
                Rollrace
                <p className="lead">Press space to jump!</p>
              </Title>
            </CenteredDiv>
            <CenteredDiv>
              <div>
                <StyledButton
                  onClick={() => this.setState({ mode: 'game', multi: false })}
                >
                  Play
                </StyledButton>
                &nbsp;&nbsp;&nbsp;
                <StyledButton
                  onClick={() => this.setState({ mode: 'game', multi: true })}
                >
                  Play Multi
                </StyledButton>
                &nbsp;&nbsp;&nbsp;
                <StyledButton
                  onClick={() => this.setState({ mode: 'settings' })}
                >
                  Settings
                </StyledButton>{' '}
                &nbsp;&nbsp;&nbsp;
                <StyledButton
                  onClick={() =>
                    this.setState({ mode: 'stats' }, this.handleStats)
                  }
                >
                  Statistics
                </StyledButton>
                {'  '}
              </div>
            </CenteredDiv>

            <div>
              <CurrentUser>
                Current User:{' '}
                {this.state.user ? this.state.user.email : 'Guest'}
              </CurrentUser>
              {!this.state.loggedIn && loginButton}
              {this.state.loggedIn && logoutButton}
            </div>
          </Background>
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
          />
        );

      case 'settings':
        return (
          <div>
            <Settings
              goToMenu={this.handleGoToMenu}
              selectedColor={this.selectColor}
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

// <MapChoice
//   key={'mapchoice'}
//   func={() => console.log('func called')}
// />
export default App;
