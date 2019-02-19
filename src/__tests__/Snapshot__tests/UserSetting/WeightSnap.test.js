import 'react-native';
import React from 'react';
import Renderer from 'react-test-renderer';
import { WeightChange } from '../../../screens/userSettings/WeightChange';

test('BiologicalAgeScore snapshot', () => {
  const snap = Renderer.create(
    <WeightChange />
  ).toJSON();
  expect(snap).toMatchSnapshot();

});
