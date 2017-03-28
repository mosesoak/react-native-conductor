import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default HeaderListItem = (props) => (
  <TouchableOpacity
    onPress={props.onPress}
  >
    <View
      style={[
        {
          height: 50,
          marginHorizontal: 10,
          justifyContent: 'center',
          marginBottom: 7,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
        props.style,
      ]}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
          paddingHorizontal: 10,
        }}
      >{props.text}</Text>
    </View>
  </TouchableOpacity>
)
