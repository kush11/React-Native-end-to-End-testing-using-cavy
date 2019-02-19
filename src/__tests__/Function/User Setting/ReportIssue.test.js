import React from 'react';
import 'react-native';
import render from 'react-test-renderer';
import ReportIssue from '../../../screens/userSettings/ReportIssue';

const findByPlaceHolder = ((tree, placeHolders) => {
  if (tree.props && tree.props.placeholder === placeHolders) {
    return tree;
  }
  if (tree.children && tree.children.length > 0) {
    const childs = tree.children;
    for (let i = 0; i < childs.length; i += 1) {
      // console.log(JSON.stringify(childs[i].props));
      const item = findByPlaceHolder(childs[i], placeHolders);
      if (typeof (item) !== 'undefined') {
        return item;
      }
    }
  }
});

describe('Testint the Element and the Placeholder', () => {
  it('should render Placeholder = Please describe your problem', () => {
    const tree = render.create(<ReportIssue />).toJSON();
    expect(findByPlaceHolder(tree, 'Please describe your problem')).toBeDefined();
  });
});
