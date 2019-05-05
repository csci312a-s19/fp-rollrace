import React from 'react';
import PropTypes from 'prop-types';
import {
  CardSubtitle,
  CardText,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardDeck
} from 'reactstrap';

/* eslint-disable react/no-array-index-key */

function MapChoice(props) {
  /*
    props.func: 
    the call back that will be used to set the 
    map that the player is working on
  */
  const { func } = props;
  const maps = [
    // TODO: fetch images from the server instead of hardcode
    'https://placebeard.it/640/360',
    'https://placebear.com/640/360',
    'https://picsum.photos/640/360'
  ];

  const cards = maps.map((link, i) => {
    // map each map to a Card
    return (
      <Card
        key={`Map#${i}`}
        style={{ flex: 1, border: '1px black solid', margin: '30px' }}
      >
        <CardImg
          center="true"
          width={`${500 / maps.length}px`} // space out images evenly across 500px
          height="100px"
          src={link}
          alt="Card image cap"
        />
        <CardBody>
          <CardTitle>{`Map #${i + 1}`}</CardTitle>
          {/* information for maps should also be fetched */}
          <CardSubtitle>An awesome map to try!</CardSubtitle>
          <CardText>Most people have an easier time using this map.</CardText>
          <Button
            onClick={() => {
              func(`Map #${i + 1}`); // TODO: callback will pass the map to use in GameEngine
            }}
          >
            Set Map
          </Button>
        </CardBody>
      </Card>
    );
  });

  return (
    <>
      <div style={{ margin: 'auto 0' }}>Choose A Map</div>
      <CardDeck
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        {cards}
      </CardDeck>
    </>
  );
}

MapChoice.propTypes = {
  func: PropTypes.func.isRequired
};

export default MapChoice;
