import React, { PropTypes } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'

export default class HeaderListItem extends React.Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,

    style: View.propTypes.style,
    textStyle: Text.propTypes.style,
  }

  render() {
    return (
      // Currently you need to wrap Touchable elements in an extra View when opacity will be animated.
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

// Custom components need to be cloned like this before wrapping them in an AnimatedNode_
export const AnimatedHeaderListItem = Animated.createAnimatedComponent(HeaderListItem)
