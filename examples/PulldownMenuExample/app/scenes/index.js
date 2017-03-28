import React from 'react'
import { View, Image } from 'react-native'
import Home from './HomeContainer'

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
            right: 0,
          }}
        />
      </View>
    )
  }
}
