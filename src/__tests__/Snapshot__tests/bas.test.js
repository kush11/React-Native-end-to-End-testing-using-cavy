import 'react-native';
import 'isomorphic-fetch';
import React from 'react';
import Renderer from 'react-test-renderer';
import { BiologicalAgeReport } from '../../screens/assessmentReport/BiologicalAgeReport';

test('BiologicalAgeScore snapshot', () => {
  const snap = Renderer.create(
    <BiologicalAgeReport />
  ).toJSON();
  expect(snap).toMatchSnapshot();
});
