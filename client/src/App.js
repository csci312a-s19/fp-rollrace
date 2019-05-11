import React, { Component } from 'react';
import styled from 'styled-components';
import request from 'request-promise-native';
import GameEngine from './Engine/GameEngine.js';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Settings from './MainMenu/Settings.js';
import Statistics from './MainMenu/Statistics.js';
import MapChooser from './MainMenu/MapChooser.js';
import { MenuBackground, MainButton } from './Style/MenuStyle.js';
import Lobbies from './MainMenu/Lobbies.js';

const GOOGLE_CLIENT_ID =
  '106374852521-g72q4hfca8bc1u3hvjhjial2e1moadri.apps.googleusercontent.com';

const GUEST_ACCOUNT = {
  email: 'Guest',
  total_games: 0,
  total_multi_games: 0,
  total_multi_wins: 0,
  map_0: -1,
  map_1: -1,
  map_2: -1
};

const CenteredDiv = styled.div`
  text-align: center;
  padding: 0px;
`;

// CSS for title changes whther or not user is on chrome.  Condition checks for chrome
const Title =
  !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
    ? styled.h1`
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
      `
    : styled.h1`
        padding-top: 10%;
        padding-bottom: 10%;
        font-family: 'Gugi', cursive;
        font-size: 1200%;
        color: white;
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
      /*
       * This is the default for multiplayer for the time being because we do
       * not go to the map chooser menu
       */
      mapProps: {
        map: [
          'm 0, 650 h 359 v -180 h 159 v 100 h 95 v 100 h 143 v -100 h 381 v -100 h 159 v 100 h 238 v -95 h 365 v -95 h 286 v -95 h 143 v 413 h 333 v -95 h 603 v 95 h 238 v -79 h 143 v 175 h 127 v -79 h 143 v -95 h 111 v 16 h 429 v -143 h 111 v 143 h 333 v -111 h 127 v 111 h 270 v 143 h 143 v -79 h 79 v -79 h 238 v -127 h 175 v 127 h 143 v -95 h 127 v 238 h 159 v -111 h 270 v -127 h 159 v 175 h 238 v -111 h 190 v 95 h 127 v -127 h 397 v -127 h 190 v 190 h 206 v -95 h 111 v 79 h 127 v -111 h 111 v 143 h 95 v -127 h 127 v 143 h 127 v -127 h 127 v 318 h 460 v -175 h 127 v 143 h 111 v -222 h 333 v -127 h 412 v -1000 h 500'
        ],
        strokeWidth: 6, // must be an even number for the parsing algorithm
        mapId: 1,
        end: 667,
        startTime: {
          minutes: '00',
          seconds: '30'
        }
      },
      guest: GUEST_ACCOUNT,
      user: GUEST_ACCOUNT,
      mode: 'menu',
      multi: false,
      lobby: undefined,
      loggedIn: false,
      playercolor: `rgb(${Math.random() * 255},${Math.random() *
        255},${Math.random() * 255})`,
      nickName: 'Player'
    };

    this.handleGoToMenu = this.handleGoToMenu.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleGoogleFailure = this.handleGoogleFailure.bind(this);
    this.handleGoogleLogout = this.handleGoogleLogout.bind(this);
    this.handleStats = this.handleStats.bind(this);
    this.handleChooseMap = this.handleChooseMap.bind(this);
    this.updateGuestStats = this.updateGuestStats.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.selectName = this.selectName.bind(this);
  }
  selectName(selectedName) {
    if (selectedName === null) {
      this.setState({ nickName: ' ' });
    } else {
      this.setState({ nickName: selectedName });
    }
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

  handleChooseMap(mapId) {
    const options = {
      url: `${
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://rollrace.herokuapp.com'
      }/api/maps/${mapId}`,
      json: true
    };
    request
      .get(options)
      .then(resp => {
        this.setState({ mapProps: resp, mode: 'game' });
      })
      .catch(err => {
        throw Error(err);
      });
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

  /*
   * Updates the guest account's score to the finish time if better than current
   * otherwise, we just increment the gamecount.
   *  Params: finishTime: int
   *          callback: function to be called once the guest is updated
   */
  updateGuestStats(finishTime, wasBooted, callback) {
    const mapParam = `map_${this.state.mapProps.mapId}`;
    if (
      !wasBooted &&
      (finishTime < this.state.guest[mapParam] ||
        this.state.guest[mapParam] === -1)
    ) {
      this.setState(
        {
          guest: Object.assign(this.state.guest, {
            [mapParam]: finishTime,
            total_games: this.state.guest.total_games + 1
          })
        },
        callback
      );
    } else {
      this.setState(
        {
          guest: Object.assign(this.state.guest, {
            total_games: this.state.guest.total_games + 1
          })
        },
        callback
      );
    }
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
          <MenuBackground>
            <CenteredDiv>
              <Title>
                Rollrace
                <p className="lead">Press space to jump!</p>
              </Title>
            </CenteredDiv>
            <CenteredDiv>
              <MainButton
                className="single"
                onClick={() => this.setState({ mode: 'choose', multi: false })}
              >
                Play Solo
              </MainButton>
              &nbsp;&nbsp;&nbsp;
              <MainButton
                className="multi"
                onClick={() => this.setState({ mode: 'game', multi: true })}
              >
                Play Multi
              </MainButton>
              &nbsp;&nbsp;&nbsp;
              <MainButton
                className="stats"
                onClick={() =>
                  this.setState({ mode: 'stats' }, this.handleStats)
                }
              >
                Stats
              </MainButton>
              &nbsp;&nbsp;&nbsp;
              <MainButton
                className="settings"
                onClick={() => this.setState({ mode: 'settings' })}
              >
                Settings
              </MainButton>{' '}
            </CenteredDiv>

            <div>
              <CurrentUser>
                Current User:{' '}
                {this.state.user ? this.state.user.email : 'Guest'}
              </CurrentUser>
              {!this.state.loggedIn && loginButton}
              {this.state.loggedIn && logoutButton}
            </div>
          </MenuBackground>
        );

      case 'choose':
        return (
          <MapChooser
            goToMenu={this.handleGoToMenu}
            handleChooseMap={this.handleChooseMap}
          />
        );

      case 'game':
        if (this.state.multi) {
          //render the lobbies
          if (this.state.lobby) {
            /*
             * make a request here for those players in that lobby and pass to the game
             * engine as a prop.
             **/
            return (
              <GameEngine
                resetLobby={() => {
                  this.setState({ lobby: '' });
                }}
                lobby={this.state.lobby}
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
          } else {
            return (
              <Lobbies chosen={lName => this.setState({ lobby: lName })} />
            );
          }
        } else {
          return (
            <GameEngine
              lobby={''}
              mapProps={Object.assign(
                {},
                { map: this.state.map, strokeWidth: this.state.strokeWidth }
              )}
              goToMenu={this.handleGoToMenu}
              guest={this.state.guest}
              multi={this.state.multi}
              playercolor={this.state.playercolor}
              updateGuestStats={this.updateGuestStats}
              playerName={this.state.nickName}
            />
          );
        } 
      case 'settings':
        return (
          <div>
            <Settings
              goToMenu={this.handleGoToMenu}
              selectedColor={this.selectColor}
              selectedName={this.selectName}
              playerName={this.state.nickName}
              playerColor={this.state.playercolor}
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
