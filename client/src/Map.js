import React from 'react';
import styled from 'styled-components';

const MapPath = styled.path`
  fill: none;
  stroke: #000000;
  stroke-width: 5;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-opacity: 1;
`;

export default function Map(props) {
  return (
    <g transform={`translate(${props.translation} 0)`}>
      <MapPath d={props.paths[0]} />

      <MapPath d={props.paths[1]} />
    </g>
  );
}
