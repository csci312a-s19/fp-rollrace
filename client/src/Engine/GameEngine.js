import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import request from 'request-promise-native';
import io from 'socket.io-client';
import { findMapSpan, buildMapHashtable } from './Helpers/MapParser.js';
import {
  getX,
  getY,
  getMapTranslation,
  findNextChange
} from './Helpers/EngineFunctions.js';
import PauseMenu from './Menus/PauseMenu.js';
import PauseButton from './PauseButton.js';
import GameoverMenu from './Menus/GameoverMenu.js';
import ChangeKeyMenu from './Menus/ChangeKeyMenu.js';
import ProgressBar from './ProgressBar.js';
import Map from './Map.js';
import Timer from './Timer.js';
import CurrBestTime from './CurrBestTime.js';
// import Tutorial from './Tutorial.js';
import { CONSTANTS } from './Helpers/constants.js';

// so is still black past the SVG boundary
const Background = styled.div`
  background-color: #000000;
  margin: 0px;
  height: 100vh;
`;

const SVGLayer = styled.svg`
  position: absolute;
`;

const Text = styled.text`
  font-size: 4000%;
  font-family: 'Gugi', cursive;
`;

class GameEngine extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, CONSTANTS.INITIAL_STATE, {
      guest: this.props.guest,
      map: this.props.mapName,
      multi: this.props.multi,
      playercolor: this.props.playercolor,
      restart: false
    });

    this.restartMinutes = this.props.minutes;
    this.variables = Object.assign({}, CONSTANTS.INITIAL_VARIABLES);

    if (this.props.multi) {
      /*
       * connect the socket to the lobby of the users choice
       */
      this.socket = io.connect(this.props.lobby);
    }

    this.timeout = null;
    this.renderInterval = null;
    this.updateInterval = null;
    this.countdownInterval = null;

    this.mapLength = findMapSpan(this.props.mapProps.map);
    this.map = buildMapHashtable(
      this.mapLength,
      this.props.mapProps.strokeWidth,
      this.props.mapProps.map
    );

    this.debounce = this.debounce.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleJumpKey = this.handleJumpKey.bind(this);
    this.handleChangeJumpKey = this.handleChangeJumpKey.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.resumeGame = this.resumeGame.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.sendEndgameData = this.sendEndgameData.bind(this);
    this.getX = getX.bind(this);
    this.getMapTranslation = getMapTranslation.bind(this);
    this.getY = getY.bind(this);
    this.findNextChange = findNextChange.bind(this);
    this.startLoops = this.startLoops.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.timeOut = this.timeOut.bind(this);
    this.getScore = this.getScore.bind(this);
  }

  /*
   * Prevent functions from event handlers from being repeatedly called.
   * This is essential for on window resize, which could potentially be called
   * a ton.
   *
   * Params: func: function to debounce
   *         delay: how long to wait after the last call until we fire func
   *         ...args: func's arguements
   */
  debounce(func, delay, ...args) {
    return () => {
      const fireLater = () => {
        func(...args);
      };

      clearTimeout(this.timeout);
      this.timeout = setTimeout(fireLater, delay);
    };
  }

  // Initiates jump
  handleJumpKey() {
    this.variables.yStart = this.getY({
      currentTime: new Date().getTime(),
      descentStartTime: this.variables.descentStartTime,
      jumpStartTime: this.variables.jumpStartTime,
      jumpState: this.variables.jumpState,
      yStart: this.variables.yStart,
      y: this.state.y,
      paused: this.state.paused
    });
    this.variables.jumpState = CONSTANTS.jump.UP;
    this.variables.jumpStartTime = new Date().getTime();
    (async () => {
      this.variables.motionChange = this.findNextChange({
        variables: this.variables,
        state: this.state,
        strokeWidth: this.props.mapProps.strokeWidth,
        map: this.map,
        mapLength: this.mapLength
      });
    })();
  }

  // Changes our current jump key
  handleChangeJumpKey(event) {
    this.setState({ jumpKey: event.keyCode });
  }

  /*
   * Allows the character to jump when spacebar is pressed and prevents the
   * character from jumping mid-jump
   */
  handleKeyPress(event) {
    if (this.state.changingKey) {
      this.handleChangeJumpKey(event);
    } else if (
      event.keyCode === this.state.jumpKey &&
      this.variables.jumpState === CONSTANTS.jump.STOP &&
      !this.state.paused &&
      this.variables.gameStartTime
    ) {
      this.handleJumpKey();
    } else {
      void 0; // do nothing
    }
  }

  // startsgame after 3 seconds and shows countdown
  startCountdown() {
    if (!this.variables.gameStartTime) {
      this.countdownInterval = setInterval(() => {
        if (
          this.state.countdownIndex <
          CONSTANTS.COUNTDOWN_NUMBERS.length - 1
        ) {
          this.setState({ countdownIndex: this.state.countdownIndex + 1 });
        }
      }, 1000);

      /*
       * use the callback to ensure that we have set the countdown to the
       * empty string.
       */
      setTimeout(() => {
        clearInterval(this.countdownInterval);
        this.setState(
          { countdownIndex: CONSTANTS.COUNTDOWN_NUMBERS.length - 1 },
          this.startLoops()
        );
      }, 3000);
    }
  }

  // Resets our current window dimentions
  handleWindowResize() {
    this.setState({
      windowHeight: window.innerHeight
    });
  }

  // restarts the game
  restartGame() {
    // clear loops
    clearTimeout(this.timeout);
    clearInterval(this.updateInterval);
    clearInterval(this.renderInterval);

    /*
     * make sure window is correct size
     * (person may have changes window while playing so can't really make a default for it)
     */
    const restartState = Object.assign({}, CONSTANTS.INITIAL_STATE, {
      windowHeight: window.innerHeight,
      restart: true,
      score: this.state.score
    });
    this.variables = Object.assign({}, CONSTANTS.INITIAL_VARIABLES);
    this.setState(restartState);
    this.startCountdown();
  }

  // resumes the game after being paused
  resumeGame() {
    const timeElapsed = new Date().getTime() - this.variables.pauseOffsetStart;

    // add the time elapsed to every relevant time
    this.variables.timePaused = this.variables.timePaused + timeElapsed;
    this.variables.mapTranslationStartTime =
      this.variables.mapTranslationStartTime + timeElapsed;
    this.variables.jumpStartTime = this.variables.jumpStartTime + timeElapsed;
    this.variables.descentStartTime =
      this.variables.descentStartTime + timeElapsed;
    if (this.variables.motionChange) {
      this.variables.motionChange.time =
        this.variables.motionChange.time + timeElapsed;
    }
    this.setState({
      paused: false
    });
  }

  // pauses the game
  pauseGame() {
    if (this.variables.gameStartTime) {
      this.variables.pauseOffsetStart = new Date().getTime();
      this.setState({
        paused: true
      });
    } else {
      void 0; // don't pause if we haven't started
    }
  }

  // send gameover data
  sendEndgameData() {
    const finishTime = parseInt(
      (new Date().getTime() -
        this.variables.gameStartTime -
        this.variables.timePaused) /
        1000
    );

    if (
      !this.state.guest // exclusive to members
    ) {
      const options = {
        url: `${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://rollrace.herokuapp.com'
        }/api/users/`,
        body: {
          type: 'end',
          contents: {
            time: finishTime
          }
        },
        json: true
      };

      request
        .put(options)
        .then(() => {
          this.setState({ dataSent: true }, this.getScore);
        })
        .catch(err => {
          throw Error(err);
        });
    } else {
      if (finishTime < this.state.guest.map_1) {
        // TODOOOO MAKE THIS NOT HARDCODEEEEE
        this.setState(
          {
            dataSent: true,
            guest: Object.assign(this.state.guest, {
              map_1: finishTime,
              total_games: this.state.guest.total_games + 1
            })
          },
          this.getScore
        );
      } else {
        this.setState(
          {
            dataSent: true,
            guest: Object.assign(this.state.guest, {
              total_games: this.state.guest.total_games + 1
            })
          },
          this.getScore
        );
      }
    }
  }

  // sets gameStartTime and starts the necessary animation loops
  startLoops() {
    this.setState({ timerCanStart: true });
    this.setState({ restart: false });
    this.variables.gameStartTime = new Date().getTime();
    this.variables.mapTranslationStartTime = new Date().getTime();

    (async () => {
      this.variables.motionChange = this.findNextChange({
        variables: this.variables,
        state: this.state,
        strokeWidth: this.props.mapProps.strokeWidth,
        map: this.map,
        mapLength: this.mapLength
      });
    })();

    this.updateInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const adjustedTime = this.variables.motionChange.time;
      if (
        this.variables.motionChange &&
        this.variables.motionChange.event !== 'nothing' &&
        adjustedTime - currentTime < CONSTANTS.TIME_THRESH &&
        !this.state.paused
      ) {
        //console.log(this.variables.motionChange.event);

        const y = this.getY({
          currentTime: adjustedTime,
          descentStartTime: this.variables.descentStartTime,
          jumpStartTime: this.variables.jumpStartTime,
          jumpState: this.variables.jumpState,
          yStart: this.variables.yStart,
          y: this.state.y,
          paused: this.state.paused
        });
        const mapTranslation = this.getMapTranslation({
          currentTime: adjustedTime,
          mapTranslationStart: this.variables.mapTranslationStart,
          mapTranslationStartTime: this.variables.mapTranslationStartTime,
          mapTranslation: this.state.mapTranslation,
          atWall: this.variables.atWall,
          paused: this.state.paused
        });
        if (this.variables.motionChange.event === 'block') {
          this.setState({
            mapTranslation: mapTranslation
          });
          this.variables.atWall = true;
        } else if (this.variables.motionChange.event === 'go') {
          this.variables.mapTranslationStart = mapTranslation;
          this.variables.mapTranslationStartTime = currentTime;
          this.variables.atWall = false;
        } else if (this.variables.motionChange.event === 'land') {
          this.setState({
            y: y - this.props.mapProps.strokeWidth / 2
          });
          this.variables.jumpState = CONSTANTS.jump.STOP;
        } else if (this.variables.motionChange.event === 'fall') {
          this.variables.descentStartTime = currentTime;
          this.variables.yStart = y;
          this.variables.jumpState = CONSTANTS.jump.DOWN;
        }
        this.variables.motionChange = undefined;
        (async () => {
          this.variables.motionChange = this.findNextChange({
            variables: this.variables,
            state: this.state,
            strokeWidth: this.props.mapProps.strokeWidth,
            map: this.map,
            mapLength: this.mapLength
          });
        })();
      }
    }, CONSTANTS.UPDATE_TIMEOUT);

    this.renderInterval = setInterval(() => {
      if (this.variables.motionChange !== 'nothing' && !this.state.paused) {
        if (
          this.getX({
            currentTime: new Date().getTime(),
            mapTranslationStart: this.variables.mapTranslationStart,
            mapTranslationStartTime: this.variables.mapTranslationStartTime,
            mapTranslation: this.state.mapTranslation,
            atWall: this.variables.atWall,
            x: this.variables.x,
            paused: this.state.paused
          }) >=
          this.mapLength - CONSTANTS.GAMEOVER_X
        ) {
          clearInterval(this.renderInterval);
          clearInterval(this.updateInterval);
          this.setState({
            gameover: true,
            endScore: parseInt(
              (new Date().getTime() -
                this.variables.gameStartTime -
                this.variables.timePaused) /
                1000
            )
          });
        } else {
          this.setState({
            mapTranslation: this.getMapTranslation({
              currentTime: new Date().getTime(),
              mapTranslationStart: this.variables.mapTranslationStart,
              mapTranslationStartTime: this.variables.mapTranslationStartTime,
              mapTranslation: this.state.mapTranslation,
              atWall: this.variables.atWall,
              paused: this.state.paused
            }),
            y: this.getY({
              currentTime: new Date().getTime(),
              descentStartTime: this.variables.descentStartTime,
              jumpStartTime: this.variables.jumpStartTime,
              jumpState: this.variables.jumpState,
              yStart: this.variables.yStart,
              y: this.state.y,
              paused: this.state.paused
            })
          });
        }
      }
    }, CONSTANTS.RENDER_TIMEOUT);
  }

  getScore() {
    if (!this.props.guest) {
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
          this.setState({ score: resp.map_1 });
        })
        .catch(err => {
          //console.log('run');
          throw Error(err);
        });
    } else {
      this.setState({ score: this.props.guest.map_1 });
    }
  }

  componentDidUpdate() {
    if (this.state.gameover && !this.state.dataSent) {
      this.sendEndgameData();
    }
  }

  componentWillUnmount() {
    // prevent memory leak by clearing/stopping loops
    clearTimeout(this.timeout);
    clearInterval(this.updateInterval);
    clearInterval(this.renderInterval);
    if (this.props.multi) {
      this.socket.disconnect();
    }
    /* this will clear the lobby chosen after the game has ended */
    this.props.resetLobby();
  }

  componentDidMount() {
    this.startCountdown();

    this.getScore();

    if (this.state.multi) {
      this.socket.on('connect', () => {
        /*
          Pass the player and a call back that will give back
          the a list of players.

          Each player contains the (x, y) coordinates of THAT player
          the list will include THIS player

          The call back is used in order to make sure that the players
          are set after the emit call
        */

        /*
          this will occur when another player has joined
          the game (not when THIS player has joined)
        */
        this.socket.on('PLAYER', data => {
          this.setState({ players: data });
        });

        /*
          Update the server with location of the
          players map ever UPDATE_INTERVAL milliseconds.

          Also emit a CHANGE_POS event that allows
          server to update all other players on position of this player
         */

        setInterval(() => {
          // should probably be a assign to a variable so it can be cleared see componentWillUnmount()
          const updatePlayer = {
            mapTrans: this.state.mapTranslation,
            y: this.state.y,
            color: this.state.color,
            key: this.socket.id
          };
          // use a callback
          this.socket.emit('CHANGE_POS', updatePlayer, data => {
            this.setState({ players: data });
          });
        }, CONSTANTS.UPDATE_INTERVAL);

        /*
          Using the mapTranslation allows THIS player to keep track of where OTHER
          players are in the game.
        */
        const player = {
          mapTrans: this.state.mapTranslation,
          y: this.state.y,
          color: 'black',
          key: this.socket.id
        };

        /*
          When a new player connects send the player
          to the server. The call back will have data about other players.

          To avoid having empty `rect' elements only set the state of
          the players when there is data sent from the server
        */
        this.socket.emit('NEW_PLAYER', player, data => {
          if (data !== undefined && data.length > 0) {
            this.setState({ players: data });
          }
          console.log(this.state.players);
        });
      });
    }
    this.handleWindowResize();
  }

  //Ends game when timer reaches zero
  timeOut() {
    this.setState({
      gameover: true,
      endScore: parseInt(
        (new Date().getTime() -
          this.variables.gameStartTime -
          this.variables.timePaused) /
          1000
      )
    });
  }

  render() {
    // Find the length of the map
    const pathLength = this.mapLength - CONSTANTS.GAMEOVER_X;
    const docBody = document.querySelector('body');
    docBody.addEventListener('keypress', e => this.handleKeyPress(e));

    window.addEventListener(
      'resize',
      this.debounce(this.handleWindowResize, 500)
    );

    const boxes = [
      <circle
        key={this.socket ? this.socket.id : '1'}
        cx={this.variables.x + CONSTANTS.SPRITE_SIDE / 2}
        cy={this.state.y + CONSTANTS.SPRITE_SIDE / 2}
        r={CONSTANTS.SPRITE_SIDE / 2}
        stroke="white"
        strokeWidth="1"
        fill={this.state.playercolor}
      />
    ];

    if (this.state.multi) {
      // now we need to account for other players that should be rendered
      if (this.state.players !== undefined) {
        // TODO: need unique key for players
        boxes.unshift(
          this.state.players.map(player => {
            console.log(this.getMapTranslation() - player.mapTrans + 200);
            return (
              <circle
                key={player.id}
                // this difference allows for other players
                // to be rendered at different places in the map
                // based on their x coordinate
                cx={
                  this.getMapTranslation({
                    currentTime: new Date().getTime(),
                    mapTranslationStart: this.variables.mapTranslationStart,
                    mapTranslationStartTime: this.variables
                      .mapTranslationStartTime,
                    mapTranslation: this.state.mapTranslation,
                    atWall: this.variables.atWall,
                    paused: this.state.paused
                  }) -
                  player.mapTrans +
                  200 +
                  CONSTANTS.SPRITE_SIDE / 2
                }
                cy={player.y}
                r={CONSTANTS.SPRITE_SIDE / 2}
                stroke="white"
                strokeWidth="1"
                fill={player.color}
                fill-opacity="0.4"
              />
            );
          })
        );
      }
    }
    return (
      <Background>
        {/* conditional rendering when the pause button is toggled */}
        {this.state.paused && this.state.hideMenu && this.state.changingKey && (
          <ChangeKeyMenu
            jumpKey={this.state.jumpKey}
            showMenu={() =>
              this.setState({ changingKey: false, hideMenu: false })
            }
            showModal={this.state.changingKey}
          />
        )}
        {/*Pause menu renders if the pause button is toggled and the changekey menu is not being displayed*/}
        {this.state.paused && !this.state.hideMenu && (
          <PauseMenu
            resume={() => this.resumeGame()}
            restart={() => this.restartGame()}
            changeKey={() =>
              this.setState({ changingKey: true, hideMenu: true })
            }
            goToMenu={() => this.props.goToMenu()}
            showModal={this.state.paused}
          />
        )}

        <SVGLayer
          viewBox={'0 0 2000 5000'}
          preserveAspectRatio={'xMaxYMin slice'}
          height={this.state.windowHeight}
          width={this.state.windowHeight * 2}
        >
          {/* black background */}
          <rect x={0} y={0} height={100000} width={100000} fill={'black'} />
          {!this.state.gameover && (
            <>
              <Timer
                y={CONSTANTS.TOOLBAR_Y}
                x={CONSTANTS.TOOLBAR_X}
                pause={this.state.paused}
                multi={this.state.multi}
                timerCanStart={this.state.timerCanStart}
                boot={bool => this.setState({ gameover: bool }, this.timeOut)}
                restart={this.state.restart}
              />
              <CurrBestTime
                y={CONSTANTS.TOOLBAR_Y}
                x={CONSTANTS.TOOLBAR_X}
                score={this.state.score}
              />

              <ProgressBar
                y={CONSTANTS.TOOLBAR_Y}
                x={CONSTANTS.TOOLBAR_X}
                currX={this.getX({
                  currentTime: new Date().getTime(),
                  mapTranslationStart: this.variables.mapTranslationStart,
                  mapTranslationStartTime: this.variables
                    .mapTranslationStartTime,
                  mapTranslation: this.state.mapTranslation,
                  atWall: this.variables.atWall,
                  x: this.variables.x,
                  paused: this.state.paused
                })}
                pathLen={pathLength}
              />
            </>
          )}
          <Map
            translation={this.state.mapTranslation}
            map={this.props.mapProps.map}
            stroke={this.props.mapProps.strokeWidth}
            className="map"
          />
          {boxes}
          <PauseButton
            x={CONSTANTS.ICON_X}
            handleClick={() => this.pauseGame()}
            className="pauseButton"
          />
          <Text
            fill={'#C1BFBF'}
            x={CONSTANTS.COUNTDOWN_X}
            y={CONSTANTS.COUNTDOWN_Y}
          >
            {' '}
            {CONSTANTS.COUNTDOWN_NUMBERS[this.state.countdownIndex]}{' '}
          </Text>
          {/* tutorial used to be here */}
          <g>
            {/* player icon */}
            <circle
              cx={CONSTANTS.ICON_X}
              cy={CONSTANTS.TOOLBAR_Y + 100}
              r={CONSTANTS.SPRITE_SIDE / 4}
              stroke="white"
              strokeWidth="1"
              fill={this.state.playercolor}
              className="icon"
            />
          </g>
        </SVGLayer>

        {this.state.dataSent && (
          <GameoverMenu
            restart={() => this.restartGame()}
            exitToMenu={() => this.props.goToMenu()}
            highscore={this.state.score}
            score={this.state.endScore}
            showModal={this.state.gameover}
          />
        )}
      </Background>
    );
  }
}

/* tutorial:
 *<g onClick={() => this.pauseGame()}>
 *  <g onClick={() => this.setState({ tutorial: true })}>
 *    {' '}
 *    {/ pauses game because within pausing div/}
 *    <rect
 *      key={'help-me'}
 *      rx={15}
 *      ry={15}
 *      x={115}
 *      y={15}
 *      height={50}
 *      width={50}
 *      fill={'pink'}
 *    />
 *    <text x={135} y={45} height={50} width={50}>
 *      ?
 *    </text>
 *  </g>
 *</g>
 */

GameEngine.propTypes = {
  lobby: PropTypes.string.isRequired,
  guest: PropTypes.object,
  mapProps: PropTypes.object.isRequired,
  multi: PropTypes.bool.isRequired,
  goToMenu: PropTypes.func.isRequired
};

export default GameEngine;
