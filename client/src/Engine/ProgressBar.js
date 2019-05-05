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
  fill: #280b0b;
`;

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.state = {
      player_1_pos: this.props.x,
      player_2_pos: this.props.x
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  //This is just a placeholder for the purpose of demonstartion
  //the two ellipses go beyond the viewbox but this won't be an issue once
  //we incoroporate it to the game.
  componentDidMount() {
    this.interval = setInterval(() => {
      const player1Pos = this.state.player_1_pos;
      const player2Pos = this.state.player_2_pos;
      this.setState({
        player_1_pos: player1Pos + 5,
        player_2_pos: player2Pos + 10
      });
    }, 1000);
  }

  render() {
    return (
      <g>
        <Bar width={200} height={20} x={this.props.x} y={this.props.y + 35} />

        <SpriteOne
          cx={this.state.player_1_pos} /*update player one position*/
          cy={this.props.y + 45} /* offset */
          rx={2.0}
          ry={9.0}
        />

        <SpriteTwo
          cx={this.state.player_2_pos} /*update player two position*/
          cy={this.props.y + 45}
          rx={2.0}
          ry={9.0}
        />
      </g>
    );
  }
}

ProgressBar.propTypes = {
  y: PropTypes.number.isRequired
};

export default ProgressBar;
