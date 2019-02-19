import 'react-native';
import React from 'react';
import render from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { UserSettings } from '../../screens/userSettings/UserSettings';

configure({ adapter: new Adapter() });

it('Check State for componentWillMount', () => {
  const PrivacyData = render.create(<UserSettings />).getInstance();
  PrivacyData.componentWillMount(PrivacyData.setState({ isRegister: true }));

  expect(PrivacyData.state.isRegister).toBe(true);
});

it('snapshots', () => {
  const tree = render.create(<UserSettings />).toJSON();
  expect(tree).toMatchSnapshot();
});
