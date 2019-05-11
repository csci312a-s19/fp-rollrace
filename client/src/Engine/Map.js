import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MapPath = styled.path`
  fill: none;
  stroke: #ffffff;
  stroke-width: ${props => props.stroke || '20'};
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-opacity: 1;
`;

export default function Map(props) {
  return (
    <g transform={`translate(${props.translation} 0)`}>
      {props.path.map((curr, index) => (
        <MapPath key={`${index}mappath`} stroke={props.stroke} d={curr} /> // eslint-disable-line
      ))}
    </g>
  );
}

Map.propTypes = {
  translation: PropTypes.number.isRequired,
  path: PropTypes.array.isRequired,
  stroke: PropTypes.number.isRequired
};
