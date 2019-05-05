import React from 'react';
import MapChoice from './MapChoice.js';
import { mount } from 'enzyme';

describe('MapChoice test', () => {
  test('Maps should be visible', () => {
    const comp = mount(<MapChoice func={() => console.log('func called')} />);
    expect(comp).toContainExactlyOneMatchingElement(MapChoice);
  });
});
