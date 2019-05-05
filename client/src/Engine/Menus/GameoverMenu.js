import React from 'react';
import PropTypes from 'prop-types';

const MENU_HEIGHT = 550;
const MENU_WIDTH = 700;
const BUTTON_HEIGHT = 50;
const BUTTON_WIDTH = 300;

export default function GameoverMenu(props) {
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

      <g onClick={() => props.exitToMenu()}>
        <rect
          rx={30}
          ry={30}
          x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 55}
          y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 320}
          height={BUTTON_HEIGHT}
          width={BUTTON_WIDTH}
          fill={'blue'}
          opacity={1}
        />
        <text
          x={(window.innerWidth - BUTTON_WIDTH / 2) / 2 + 100}
          y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 360}
          fontFamily="Verdana"
          fontSize="35"
          fill="#FFFF00"
        >
          Go To Menu
        </text>
      </g>

      <g>
        <text
          x={(window.innerWidth - MENU_WIDTH / 2) / 2 + 80}
          y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 80}
        >
          GAMEOVER
        </text>
        <text
          x={(window.innerWidth - MENU_WIDTH / 2) / 2 + 80}
          y={(window.innerHeight - MENU_HEIGHT / 2) / 4 + 140}
        >
          {`Current Highscore: ${props.score}`}
        </text>
      </g>
    </g>
  );
}

GameoverMenu.propTypes = {
  score: PropTypes.number.isRequired,
  restart: PropTypes.func.isRequired,
  exitToMenu: PropTypes.func.isRequired
};
