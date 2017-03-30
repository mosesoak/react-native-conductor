import React, { PropTypes } from 'react'
import { View, Image, TouchableOpacity, Animated } from 'react-native'

export default class ImageButton extends React.Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    source: PropTypes.number.isRequired,

    style: View.propTypes.style,
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
          <Image
            source={this.props.source}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

// Custom components need to be cloned like this before wrapping them in an AnimatedNode_
export const AnimatedImageButton = Animated.createAnimatedComponent(ImageButton)
