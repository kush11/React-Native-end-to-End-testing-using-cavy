import 'react-native';
import 'isomorphic-fetch';
import React from 'react';
import Renderer from 'react-test-renderer';
import { PrivateSetting } from '../../../screens/userSettings/PrivacySetting';

it('snapshots', () => {
  const tree = Renderer.create(<PrivateSetting />).toJSON();
  expect(tree).toMatchSnapshot();
});
