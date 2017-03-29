import React from 'react'
import { View, Image, Dimensions } from 'react-native'
import Home from './HomeContainer'
const { width: deviceWidth } = Dimensions.get('window')

// typically a navigator would be configured here

export default class Root extends React.Component {
  render() {
    return (
      <View style={{ flexGrow: 1 }}>
        <Home />
        <Image
          source={require('images/fake-tab-bar.png')}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: deviceWidth,
          }}
        />
      </View>
    )
  }
}
