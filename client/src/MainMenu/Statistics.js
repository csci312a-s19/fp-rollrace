import React from 'react';
import PropTypes from 'prop-types';
import statistics from './buttonSVGs/statistics.svg';
import return2menu from './buttonSVGs/return2menu.svg';

export default function Statistics(props) {
  return (
    <div>
      <img src={statistics} className="statslogo" alt="stats" />
      <div>
        <h3>Total Games: {props.user ? props.user.total_games : ''}</h3>
      </div>
      <div>
        <h3>Best Map 1 time: {props.user ? props.user.map_1 : ''}</h3>
      </div>
      <div>
        <img
          src={return2menu}
          height="50"
          className="2menubutton"
          alt="2menu"
          onClick={props.goToMenu}
        />
      </div>
    </div>
  );
}

Statistics.propTypes = {
  goToMenu: PropTypes.func.isRequired
};
