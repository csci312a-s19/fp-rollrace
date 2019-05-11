import React from 'react';
import PropTypes from 'prop-types';

const WIDTH = 300; // Set maximum width of progressbar
const HEIGHT = 30; // bar height
const POS_OFFSET = 35;
const SPRITE_OFFSET = 50;

const ProgressBar = props => {
  const { currX, pathLen, spriteColor, x, y } = props;
  /*
    Finds how far the player is as perecntage of the entire path
    Translate that value to the distance from the start the sprite's icon will be on
    the progress bar.
    Currently it only supports single player mode.

  */
  const percentage = currX / pathLen;
  let currentPos = x + WIDTH * percentage;
  if (!currentPos) {
    currentPos = x;
  }

  return (
    <g>
      <rect
        fill={'#ffffff'}
        width={WIDTH}
        height={HEIGHT}
        x={x}
        y={y + POS_OFFSET}
      />

      {/* sprite 1 */}
      <ellipse
        fill={spriteColor}
        cx={currentPos} /*update player one position*/
        cy={y + SPRITE_OFFSET} /* offset */
        rx={5.0}
        ry={15.0}
      />
    </g>
  );
};

ProgressBar.propTypes = {
  y: PropTypes.number.isRequired,
  currX: PropTypes.number,
  x: PropTypes.number.isRequired,
  spriteColor: PropTypes.string
};

export default ProgressBar;
