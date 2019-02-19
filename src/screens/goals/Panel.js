import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated
} from 'react-native';

class Panel extends Component {
  constructor(props) {
    super(props);

    this.icons = {
      'up': require('./images/Arrowhead-01-128.png'),
      'down': require('./images/Arrowhead-Down-01-128.png')
    };

    this.state = {
      title: props.title,
      daysLeft: props.daysLeft,
      expanded: true,
      animation: 60
    };
  }

  toggle() {
    const { expanded, maxHeight, minHeight } = this.state;
    const initialValue = expanded ? maxHeight + minHeight : minHeight;

    this.setState({ expanded: !expanded });

    this.setState({ animation: initialValue });
  }

  _setMaxHeight() {
    const { activityLength } = this.props;
    this.setState({ maxHeight: 110 * activityLength });
  }

  _setMinHeight() {
    this.setState({ minHeight: 60 });
  }

  render() {
    const {
      expanded, animation, title, daysLeft
    } = this.state;
    const { children } = this.props;
    let icon = this.icons['down'];

    if (expanded) {
      icon = this.icons['up'];
    }

    return (
      <TouchableOpacity
        onPress={this.toggle.bind(this)}
        underlayColor="#f1f1f1"
      >
        <Animated.View
          style={[styles.container, { height: animation }]}
        >
          <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.daysLeft}>{daysLeft}</Text>

            {/* <Image
              style={styles.buttonImage}
              source={icon}
            /> */}

          </View>

          <View
            style={styles.body}
            onLayout={this._setMaxHeight.bind(this)}
          >
            {children}
          </View>

        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10,
    overflow: 'hidden',
    borderRadius: 5,
    elevation: 5,
    borderWidth: 0.15,
  },
  titleContainer: {
    flexDirection: 'row',
    // borderRadius: 5,
    // elevation: 5,
    // borderWidth: 0.15,
  },
  title: {
    fontSize: 30,
    flex: 1,
    padding: 10,
    color: '#2a2f43',
  },
  daysLeft: {
    alignItems: 'center',
    alignSelf: 'center',
    color: '#2a2f43',
    justifyContent: 'flex-end',
  },
  buttonImage: {
    width: 30,
    height: 25
  },
  body: {
    marginTop: 15,

    paddingTop: 0
  }
});

export default Panel;
