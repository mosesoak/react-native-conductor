import React, { PropTypes } from 'react'

import {
  View,
  ScrollView,
} from 'react-native'

export default ThumbnailRow = (props) => (
  <View
    style={props.style}
  >
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
        props.contentContainerStyle,
      ]}
    >
      {props.children}
    </ScrollView>
  </View>
)

ThumbnailRow.propTypes = {
  children: PropTypes.any,
  contentContainerStyle: View.propTypes.style,
  style: View.propTypes.style,
}
