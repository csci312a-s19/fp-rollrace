import React, { Component } from 'react';
import Map from './Map.js';
import PauseMenu from './PauseMenu.js';

// Jump state enum for clarity
const jump = {
  STOP: 0,
  UP: 1,
  DOWN: 2
};
const JUMP_HEIGHT = 200;
const JUMP_SPEED = 0.3;
const UPDATE_TIMEOUT = 0.01;
const SCROLL_SPEED = 0.1;

const readMap = listPaths => {
  const data = [];
  listPaths.forEach((path, index) => {
    data[index] = {
      walls: [],
      flats: []
    };

    //console.log(path);
    const characters = path.split(' ');
    let currentAction;
    let xDistance = parseInt(characters[1]);
    let yDistance = parseInt(characters[2]);
    characters.splice(3).forEach(value => {
      //console.log(value);
      if (value === 'v') {
        currentAction = 'v';
      } else if (value === 'h') {
        currentAction = 'h';
      } else if (currentAction === 'v') {
        data[index].walls.push({
          xPosition: xDistance,
          top: Math.max(yDistance, yDistance + parseInt(value)),
          bottom: Math.min(yDistance, yDistance + parseInt(value))
        });
        yDistance = yDistance + parseInt(value);
      } else if (currentAction === 'h') {
        data[index].flats.push({
          height: yDistance,
          start: xDistance,
          end: xDistance + parseInt(value)
        });
        xDistance = xDistance + parseInt(value);
      }
    });
  });
  //console.log('here');

  return data;
};

class GameEngine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: false,
      stuck: false,
      x: 60,
      y: 360,
      mapTranslation: 0,
      mapTranslationStart: 0,
      yStart: 400,
      jumpState: jump.STOP,
      jumpInitiated: false,
      windowWidth: window.outerWidth,
      windowHeight: window.outerHeight
    };
    this.paths = [
      'm 0, 442 h 159 v -79 h 159 v 79 h 95 v 95 h 143 v -95 h 381 v -95 h 159 v 95 h 238 v -95 h 365 v -95 h 286 v -95 h 143 v 413 h 333 v -95 h 603 v 95 h 238 v -79 h 143 v 175 h 127 v -79 h 143 v -95 h 111 v 16 h 429 v -143 h 111 v 143 h 79 254 v -111 h 127 v 111 h 270 v 143 h 143 v -79 h 79 v -79 h 238 v -127 h 175 v 127 h 143 v -95 h 127 v 238 h 159 v -111 h 270 v -127 h 159 v 175 h 238 v -111 h 190 v 95 h 127 v -127 h 238 h 159 v -127 h 190 v 190 h 206 v -95 h 111 v 79 h 127 v -111 h 111 v 143 h 95 v -127 h 127 v 143 h 127 v -127 h 127 v 175 0 143 h 127 v 0 h 333 v -175 h 127 v 143 h 111 v -222 h 333 v -127 h 222 v 0 h 190',
      'm 2340, 100 h 511 v -111 h 159 v 175 h 206 v -127 h 127 v -111 h 143 v 238 h 127 v -95 h 111 v 95 h 111 v -95 h 143 v 95 h 159 v -190 h 127 v 159 h 175 v -111 h 159 v 111 h 143 v -95 h 127 v 95 h 476'
    ];
    this.data = readMap(this.paths);
    console.log(this.data);

    this.mapRef = React.createRef();

    this.translationStartTime = null;
    this.jumpStartTime = null;
    this.descendStartTime = null;

    /*
     * I don't know why, but the event gets messed up after rerendering if
     * timeout is not in the constructor...
     */
    this.timeout = null;
    this.mapTimeout = null;

    this.debounce = this.debounce.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
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

  /*
   * Allows the character to jump when spacebar is pressed and prevents the
   * character from jumping mid-jump
   */
  handleKeyPress(event) {
    if (event.keyCode === 32 && this.state.jumpState === jump.STOP) {
      if (!this.translationStartTime) {
        this.translationStartTime = new Date().getTime();
      }
      this.jumpStartTime = new Date().getTime();
      this.setState({
        yStart: this.state.y + 1,
        y: this.state.y + 1,
        jumpState: jump.UP
      });
    } else {
      void 0; // do nothing
    }
  }

  // Resets our current window dimentions
  handleWindowResize() {
    this.setState({
      windowWidth: window.outerWidth,
      windowHeight: window.outerHeight
    });
  }

  // Handle animation
  componentDidUpdate() {
    let {
      y,
      yStart,
      jumpState,
      mapTranslation,
      mapTranslationStart,
      stuck
    } = this.state;

    //console.log(this.data);
    // don't update if game has not started
    if (this.translationStartTime) {
      let stillStuck = false;
      let notFalling = false;
      for (let i = 0; i < this.data.length; i++) {
        //console.log(this.data[i]);
        //console.log(i);
        for (let j = 0; j < this.data[i].walls.length; j++) {
          //console.log(this.data[i].walls[j]);
          //console.log(j);
          //console.log(this.data[i].walls.length);
          //console.log(this.data[i].walls[j].xPosition + this.state.mapTranslation);
          if (
            Math.abs(
              this.state.x +
                80 -
                (this.data[i].walls[j].xPosition + this.state.mapTranslation)
            ) < 1 &&
            ((this.state.y < this.data[i].walls[j].top &&
              this.state.y > this.data[i].walls[j].bottom) ||
              (this.state.y + 80 < this.data[i].walls[j].top &&
                this.state.y + 80 > this.data[i].walls[j].bottom))
          ) {
            //80 comes from width of sprite

            //console.log('stopped');
            stillStuck = true;
          }
        }
        for (let j = 0; j < this.data[i].flats.length; j++) {
          if (
            Math.abs(this.state.y + 80 - this.data[i].flats[j].height) < 2 &&
            ((this.state.x < this.data[i].flats[j].end + mapTranslation &&
              this.state.x > this.data[i].flats[j].start + mapTranslation) ||
              (this.state.x + 80 < this.data[i].flats[j].end + mapTranslation &&
                this.state.x + 80 >
                  this.data[i].flats[j].start + mapTranslation))
          ) {
            //80 comes from width of sprite
            //console.log('thats it');
            //console.log(this.data[i].flats[j]);
            //console.log(mapTranslation);
            notFalling = true;
          }
        }
      }
      if (!stillStuck && stuck) {
        //console.log('reset')
        stuck = false;
        this.translationStartTime = new Date().getTime();
      }
      if (stillStuck && !stuck) {
        stuck = true;
        mapTranslationStart = mapTranslation;
      }
      if (!notFalling && jumpState === jump.STOP) {
        //console.log('reset')
        yStart = y;
        jumpState = jump.DOWN;
        this.descendStartTime = new Date().getTime();
      }
      if (notFalling && jumpState === jump.DOWN) {
        yStart = y;
        jumpState = jump.STOP;
      }

      // don't begin a jump if no jump was initialized

      if (jumpState === jump.DOWN) {
        const currentTime = new Date().getTime();
        /*
         * Need to clear timeout or the calls start to stack up and too many
         * fire one after another, changing the scroll speed and causing
         * extra computation.
         */
        //console.log(this.state.yStart);
        //console.log(this.state.y);

        y = yStart + (currentTime - this.descendStartTime) * JUMP_SPEED;
      } else if (jumpState === jump.UP) {
        const currentTime = new Date().getTime();
        // mid jump case
        if ((currentTime - this.jumpStartTime) * JUMP_SPEED <= JUMP_HEIGHT) {
          /*
           * Need to clear timeout or the calls start to stack up and too many
           * fire one after another, changing the scroll speed and causing
           * extra computation.
           */

          y =
            this.state.yStart - (currentTime - this.jumpStartTime) * JUMP_SPEED;
        } else {
          /*
           * stop jump when jump should be over and return the sprite to the
           * original prejump location
           */
          //console.log("going down")
          //console.log(y);
          //console.log(yStart);
          yStart = y;
          jumpState = jump.DOWN;
          this.descendStartTime = new Date().getTime();
          //console.log(yStart);
        }
      }
      if (!stuck) {
        clearTimeout(this.mapTimeout);
        this.mapTimeout = setTimeout(() => {
          this.setState({
            mapTranslation:
              mapTranslationStart -
              (new Date().getTime() - this.translationStartTime) * SCROLL_SPEED,
            y: y,
            jumpState: jumpState,
            yStart: yStart,
            mapTranslationStart: mapTranslationStart,
            stuck: stuck
          });
        }, UPDATE_TIMEOUT);
      } else {
        clearTimeout(this.mapTimeout);
        this.mapTimeout = setTimeout(() => {
          this.setState({
            y: y,
            jumpState: jumpState,
            yStart: yStart,
            mapTranslationStart: mapTranslationStart,
            stuck: stuck
          });
        }, UPDATE_TIMEOUT);
      }
    }
  }

  render() {
    const docBody = document.querySelector('body');
    docBody.addEventListener('keypress', e => this.handleKeyPress(e));

    window.addEventListener(
      'resize',
      this.debounce(this.handleWindowResize, 500)
    );

    return (
      <svg
        viewBox={'0 0 500 1000'}
        preserveAspectRatio={'xMinYMin meet'}
        height={this.state.windowHeight}
        width={this.state.windowWidth}
      >
        <Map paths={this.paths} translation={this.state.mapTranslation} />
        <rect
          rx={15}
          ry={15}
          x={this.state.x}
          y={this.state.y}
          height={80}
          width={80}
          fill={'orange'}
        />
        <g
          onClick={() => {
            if (this.translationStartTime) this.setState({ paused: true });
          }}
        >
          <rect
            rx={15}
            ry={15}
            x={15}
            y={15}
            height={50}
            width={50}
            fill={'pink'}
          />
          <rect
            rx={5}
            ry={5}
            x={28}
            y={28}
            height={25}
            width={10}
            fill={'black'}
          />
          <rect
            rx={5}
            ry={5}
            x={43}
            y={28}
            height={25}
            width={10}
            fill={'black'}
          />
        </g>
        {this.state.paused ? (
          <PauseMenu
            windowWidth={this.state.windowWidth}
            windowHeight={this.state.windowHeight}
          />
        ) : (
          <></>
        )}
      </svg>
    );
  }
}

export default GameEngine;
