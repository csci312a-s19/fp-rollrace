import React, { Component } from 'react';
import PropTypes from 'prop-types';
import request from 'request-promise-native';

const MENU_HEIGHT = 550;
const MENU_WIDTH = 700;
const BUTTON_HEIGHT = 50;
const BUTTON_WIDTH = 300;

class GameOverMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      score: null
    };
  }

  // TODO: THIS LOOKS UGLY SO WE NEED TO RETHINK WITH ASPECT RATIO
  render() {
    if (!this.props.guest) {
      const options = {
        url:
          (process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://rollrace.herokuapp.com') + `/api/users/stats`,
        json: true
      };
      request
        .get(options)
        .then(resp => {
          this.setState({ score: resp.map_1 });
        })
        .catch(err => {
          console.log('run');
          throw Error(err);
        });
    } else {
      this.setState({ score: this.props.guest.map_1 });
    }
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

        <g onClick={() => this.props.restart()}>
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

        <g onClick={() => this.props.exitToMenu()}>
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
            {`Current Highscore: ${this.state.score}`}
          </text>
        </g>
      </g>
    );
  }
}

GameOverMenu.propTypes = {
  guest: PropTypes.object,
  restart: PropTypes.func.isRequired,
  exitToMenu: PropTypes.func.isRequired
};

export default GameOverMenu;
