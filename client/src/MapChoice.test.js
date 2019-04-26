import React from 'react';
import MapChoice from './MapChoice.js';
import { mount } from 'enzyme';

describe('MapChoice test', () => {
  test('Possible Maps should be visible', () => {
    const comp = mount(<MapChoice />);
    expect(comp.find('Row[id="maps"]')).toBeVisible();
  });
});
