import 'react-native';
import React from 'react';
// import render from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import { Question } from '../../screens/assessment/Question';
import Goal from '../../screens/goals/ActivityList';

configure({ adapter: new Adapter() });

it('testing the props', () => {
  const wrapper = shallow(<Goal content="ZingUp" />).props();
  // console.log(JSON.stringify(wrapper));
  // console.log(wrapper.children[0].props.children);

  expect(wrapper.children[0].props.children).toEqual('ZingUp');
});

it('testing the props', () => {
  const wrapper = shallow(<Goal content="ZingUp" />);
  // console.log(wrapper.instance().props.content);
  expect(wrapper.instance().props.content).toEqual('ZingUp');
});
