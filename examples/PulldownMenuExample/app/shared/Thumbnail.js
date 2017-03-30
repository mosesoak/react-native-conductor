import React, { PropTypes } from 'react'

import {
  View,
  Image,
  Text,
} from 'react-native'

export default Thumbnail = (props) => (
  <View
    style={[
      {
        marginRight: 10,
      },
      props.style,
    ]}
  >
    <Image
      source={props.source}
    />
    {
      props.title &&
      <Text style={{
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop: 5,
        color: '#111',
      }}
      >
        {props.title}
      </Text>
    }
  </View>
)

Thumbnail.propTypes = {
  source: PropTypes.number.isRequired,
  title: PropTypes.string,
}
