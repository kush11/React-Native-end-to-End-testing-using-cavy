import 'react-native';
import 'isomorphic-fetch';
import React from 'react';
import Renderer from 'react-test-renderer';
import { PersonalSetting } from '../../../screens/userSettings/PersonalSettings';

it('snapshots', () => {
  const tree = Renderer.create(<PersonalSetting />).toJSON();
  expect(tree).toMatchSnapshot();
});
