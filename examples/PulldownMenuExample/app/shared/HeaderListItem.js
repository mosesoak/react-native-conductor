import React, { PropTypes } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'

// Custom components need to be cloned using createAnimatedComponent() in order to be animated directly.
// (see the last line in this file)

export default class HeaderListItem extends React.Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,

    style: View.propTypes.style,
    textStyle: Text.propTypes.style,
  }

  render() {
    return (
      <View
        style={this.props.style}
      >
        <TouchableOpacity
          onPress={this.props.onPress}
          activeOpacity={0.8}
        >
          <View
            style={{
              height: 50,
              marginHorizontal: 10,
              justifyContent: 'center',
              marginBottom: 7,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <Text
              style={[
                {
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  paddingHorizontal: 10,
                },
                this.props.textStyle,
              ]}
            >
              {
                this.props.text
              }
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export const AnimatedHeaderListItem = Animated.createAnimatedComponent(HeaderListItem)
