import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardImg } from 'reactstrap';
export default function MapChoice(props) {
  const { func } = props;
  return (
    <Row id="maps">
      <a
        style={{ cursor: 'pointer' }}
        onClick={() => {
          func('Map1');
        }}
      >
        <Col xs={12} sm={6} md={3}>
          <Card>
            <CardBody>
              <CardTitle>Map 1</CardTitle>
              <CardImg top width="100%" src="https://placebeard.it/640x360" />
            </CardBody>
          </Card>
        </Col>
      </a>
      <Col
        xs={12}
        sm={6}
        md={3}
        onClick={() => {
          func('Map1');
        }}
      >
        <Card>
          <CardBody>
            <CardTitle>Map 2</CardTitle>
            <CardImg top width="100%" src="https://placebear.com/640/360" />
          </CardBody>
        </Card>
      </Col>
      <Col
        xs={12}
        sm={6}
        md={3}
        onClick={() => {
          func('Map1');
        }}
      >
        <Card>
          <CardBody>
            <CardTitle>Map 3</CardTitle>
            <CardImg top width="100%" src="https://picsum.photos/640/360" />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
