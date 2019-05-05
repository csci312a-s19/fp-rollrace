import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MapPath = styled.path`
  fill: none;
  stroke: #000000;
  stroke-width: ${props => props.stroke || '20'};
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-opacity: 1;
`;

export default function Map(props) {
  return (
    <g transform={`translate(${props.translation} 0)`}>
      <MapPath stroke={props.stroke} d={props.map} />
    </g>
  );
}

Map.propTypes = {
  translation: PropTypes.number.isRequired,
  map: PropTypes.array.isRequired,
  stroke: PropTypes.number.isRequired
};
