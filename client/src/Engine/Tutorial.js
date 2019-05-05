import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SVGLayer = styled.svg`
  position: absolute;
`;

const Tut = styled.div`
  margin: 0 auto;
  text-align: center;
  width: 800px;
`;

const JUMP_HEIGHT = 150;
const JUMP_TIME = 500;
const UPDATE_TIMEOUT = 0.01;

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      y: 200,
      yStart: 400,
      jumpState: 'STOP',
      jumpStartTime: null
    };
    this.timeout = null;
  }

  handleKeyPress(event) {
    if (event.keyCode === 32 && this.state.jumpState === 'STOP') {
      this.handleJumpKey();
    }
  }

  handleJumpKey() {
    this.setState({
      jumpStartTime: new Date().getTime(),
      yStart: this.state.y,
      jumpState: 'UP'
    });
  }
  componentDidMount() {
    const docBody = document.querySelector('body');
    docBody.addEventListener('keypress', e => this.handleKeyPress(e));
  }

  componentDidUpdate() {
    const currentTime = new Date().getTime();
    if (this.state.jumpState !== 'STOP') {
      // mid jump case
      if (currentTime - this.state.jumpStartTime < JUMP_TIME) {
        /*
         * Need to clear timeout or the calls start to stack up and too many
         * fire one after another, changing the scroll speed and causing
         * extra computation.
         */
        this.mapTimeout = setTimeout(() => {
          this.setState({
            y:
              this.state.yStart -
              Math.abs(
                Math.abs(
                  ((currentTime - this.state.jumpStartTime) / JUMP_TIME) *
                    2 *
                    JUMP_HEIGHT -
                    JUMP_HEIGHT
                ) - JUMP_HEIGHT
              )
          });
        }, UPDATE_TIMEOUT); // prevent max depth calls
      } else {
        /*
         * stop jump when jump should be over and return the sprite to the
         * original prejump location
         */
        this.setState({
          jumpState: 'STOP',
          y: this.state.yStart
        });
      }
    }
  }

  render() {
    return (
      <Tut>
        <h1> Welcome to Rollrace! Press spacebar to jump </h1>
        <SVGLayer
          viewBox={'0 0 1000 2000'}
          preserveAspectRatio={'xMaxYMin slice'}
          height={window.innerHeight}
          width={window.innerWidth}
        >
          <g onClick={() => this.props.handlePlay()}>
            <rect
              key={'help-me'}
              rx={15}
              ry={15}
              x={15}
              y={15}
              height={50}
              width={50}
              fill={'green'}
            />

            <text x={25} y={45} height={50} width={50}>
              Play!
            </text>
          </g>

          <rect
            rx={15}
            ry={15}
            x={0}
            y={this.state.y}
            height={80}
            width={80}
            fill={'red'}
          />
        </SVGLayer>
      </Tut>
    );
  }
}

Tutorial.propTypes = {
  handlePlay: PropTypes.func.isRequired
};

export default Tutorial;
