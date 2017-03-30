import React from 'react'
import { View, Image, Dimensions } from 'react-native'
import HomeContainer from './HomeContainer'

const {
  width: deviceWidth,
} = Dimensions.get('window')


// typically a navigator would be configured here


export default class Root extends React.Component {
  render() {
    return (
      <View style={{ flexGrow: 1 }}>
        <HomeContainer />
        <Image
          source={require('images/fake-tab-bar.png')}
          style={{
            position: 'absolute',
            bottom: 0,
            width: deviceWidth,
            height: 55,
          }}
        />
      </View>
    )
  }
}
