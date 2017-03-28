import React, { PropTypes } from 'react'

import {
  View,
  ScrollView,
} from 'react-native'

export default class ThumbnailRow extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.any,
  }

  render() {
    return (
      <View style={this.props.style}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 1 }}
          contentContainerStyle={[
            {
              justifyContent: 'flex-start',
              flexDirection: 'row',
              padding: 20,
            },
            this.props.contentContainerStyle,
          ]}
        >
          {this.props.children}
        </ScrollView>
      </View>
    )
  }
}
