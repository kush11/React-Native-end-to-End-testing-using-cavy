import 'react-native';
import React from 'react';
import Renderer from 'react-test-renderer';
import { HeightChange } from '../../../screens/userSettings/HeightChange';

test('BiologicalAgeScore snapshot', () => {
  const snap = Renderer.create(
    <HeightChange />
  ).toJSON();
  expect(snap).toMatchSnapshot();
});
