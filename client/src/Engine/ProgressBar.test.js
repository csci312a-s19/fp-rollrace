import React from 'react';
import { shallow } from 'enzyme';
import ProgressBar from './ProgressBar.js';
import { CONSTANTS } from './Helpers/constants.js';

describe('progressbar', () => {
  test('progressBar snapshot', () => {
    const comp = shallow(
      <ProgressBar x={CONSTANTS.TOOLBAR_X} y={CONSTANTS.TOOLBAR_Y} />
    );
    expect(comp).toMatchSnapshot();
  });
});
