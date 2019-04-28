import React from 'react';
import PropTypes from 'prop-types';

const MENU_HEIGHT = 700;
const MENU_WIDTH = 550;
const BUTTON_HEIGHT = 50;
const BUTTON_WIDTH = 300;

export default function PauseMenu(props) {
  const restart = (
    <g onClick={() => props.restart()}>
      <rect
        rx={30}
        ry={30}
        x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 55}
        y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 160}
        height={BUTTON_HEIGHT}
        width={BUTTON_WIDTH}
        fill={'red'}
        opacity={1}
      />
      <text
        x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 140}
        y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 200}
        fontFamily="Verdana"
        fontSize="35"
        fill="#FFFF00"
      >
        Restart
      </text>
    </g>
  );
  // TODO: THIS LOOKS UGLY SO WE NEED TO RETHINK WITH ASPECT RATIO

  return (
    <g>
      <rect
        x={0}
        y={0}
        height={4000}
        width={4000}
        fill={'black'}
        opacity={0.5}
      />
      <rect
        rx={30}
        ry={30}
        x={(window.innerWidth - MENU_WIDTH / 2) / 2}
        y={(window.innerHeight - MENU_HEIGHT / 2) / 4}
        height={MENU_HEIGHT}
        width={MENU_WIDTH}
        fill={'white'}
        opacity={1}
      />

      <rect
        rx={30}
        ry={30}
        x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 55}
        y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 80}
        height={BUTTON_HEIGHT}
        width={BUTTON_WIDTH}
        fill={'black'}
        opacity={1}
        onClick={() => props.resume()}
        className="resume"
      />
      <text
        x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 140}
        y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 120}
        fontFamily="Verdana"
        fontSize="35"
        fill="#FFFF00"
        onClick={() => props.resume()}
        className="resume"
      >
        Resume
      </text>

      {!props.multi && restart}

      <rect
        rx={30}
        ry={30}
        x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 55}
        y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 240}
        height={BUTTON_HEIGHT}
        width={BUTTON_WIDTH}
        fill={'green'}
        opacity={1}
        onClick={() => props.changeKey()}
      />
      <text
        x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 100}
        y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 275}
        fontFamily="Verdana"
        fontSize="35"
        fill="#FFFF00"
        onClick={() => props.changeKey()}
      >
        Change Key
      </text>

      <rect
        rx={30}
        ry={30}
        x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 55}
        y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 320}
        height={BUTTON_HEIGHT}
        width={BUTTON_WIDTH}
        fill={'blue'}
        opacity={1}
        onClick={() => props.exitToMenu()}
      />
      <text
        x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 100}
        y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 360}
        fontFamily="Verdana"
        fontSize="35"
        fill="#FFFF00"
        onClick={() => props.exitToMenu()}
      >
        Go To Menu
      </text>
    </g>
  );
}

PauseMenu.propTypes = {
  multi: PropTypes.bool.isRequired,
  resume: PropTypes.func.isRequired,
  restart: PropTypes.func.isRequired,
  changeKey: PropTypes.func.isRequired,
  exitToMenu: PropTypes.func.isRequired
};
