import React, { PropTypes } from 'react'

import {
  View,
  Image,
  Text,
} from 'react-native'

export default class Thumbnail extends React.Component {
  static propTypes = {
    source: PropTypes.number.isRequired,
    title: PropTypes.string,
  }

  render() {
    return (
      <View style={{ marginRight: 10 }}>
        <Image source={this.props.source} />
        <Text style={{
          fontWeight: 'bold',
          fontSize: 16,
          paddingTop: 5,
          color: '#111',
        }}>{this.props.title}</Text>
      </View>
    )
  }
}
