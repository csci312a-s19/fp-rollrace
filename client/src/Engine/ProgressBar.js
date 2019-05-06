import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SpriteOne = styled.ellipse`
  fill: #ff0000;
`;

const SpriteTwo = styled.ellipse`
  fill: #00ff00;
`;

const Bar = styled.rect`
  fill: #ffffff;
`;
const WIDTH = 200;
const HEIGHT = 20;
const POS_OFFSET = 35;
const SPRITE_OFFSET = 45;

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentX: this.props.currX
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currX !== state.currentX) {
      return {
        currentX: props.currX
      };
    }
    return null;
  }

  render() {
    /*
    Finds how far the player is as perecntage of the entire path
    Translate that value to the distance from the start the sprite's icon will be on 
    the progress bar.
     Currently it only supports single player mode but once I figure out how to 
     find the x-coordinate of the other players I will fix that. 

    */
    const percentage = this.state.currentX / this.props.pathLen;
    let currentPos = this.props.x + WIDTH * percentage;
    if (!currentPos) {
      currentPos = this.props.x;
    }

    return (
      <g>
        <Bar
          width={WIDTH}
          height={HEIGHT}
          x={this.props.x}
          y={this.props.y + POS_OFFSET}
        />

        <SpriteOne
          cx={currentPos} /*update player one position*/
          cy={this.props.y + SPRITE_OFFSET} /* offset */
          rx={2.0}
          ry={9.0}
        />

        <SpriteTwo
          cx={currentPos} /*update player two position*/
          cy={this.props.y + SPRITE_OFFSET}
          rx={2.0}
          ry={9.0}
        />
      </g>
    );
  }
}

ProgressBar.propTypes = {
  y: PropTypes.number.isRequired,
  currX: PropTypes.number,
  x: PropTypes.number.isRequired
};

export default ProgressBar;
