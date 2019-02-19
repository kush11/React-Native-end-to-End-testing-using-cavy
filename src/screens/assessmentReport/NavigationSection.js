import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  Thumbnail, Text, Icon, List, ListItem, Left, Right, Body, Card
} from 'native-base';

const mapStateToProps = state => ({ next: state.Report.assessmentReport.next });

const NavigationSection = ({ next }) => (
  <View>
    <Text style={styles.title}>{'What Next?'.toUpperCase()}</Text>
    <Card style={{ backgroundColor: '#ffffff' }}>
      <List>
        {next.map(x => (
          <ListItem thumbnail key={x.title}>
            <Left>
              <Thumbnail small source={x.icon} />
            </Left>
            <Body>
              <Text>{x.title}</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        ))}
      </List>
    </Card>
  </View>
);
const styles = StyleSheet.create({
  title: {
    color: '#495057',
    fontSize: 13,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingLeft: 10
  }
});
export default connect(mapStateToProps)(NavigationSection);
