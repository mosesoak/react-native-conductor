import React, { PropTypes } from 'react'
import { Animated, StyleSheet } from 'react-native'

import {
  animationKey,
  animatedStyles,
  addAnimationCallback,
  removeAnimationCallback,
} from './conductorConstants'


class AnimatedNode_ extends React.Component {
  static propTypes = {
    animationKey: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    onCallback: PropTypes.func,
  }

  static contextTypes = {
    [animatedStyles]: PropTypes.object,
    [addAnimationCallback]: PropTypes.func,
    [removeAnimationCallback]: PropTypes.func,
  }

  static _instanceCounter = 0

  instanceId = 0

  constructor(props, state, context) {
    super(props, state, context)
    this.instanceId = AnimatedNode_._instanceCounter++
  }

  componentWillMount = () => {
    if (this.context[addAnimationCallback] && this.props.onCallback != null) {
      this.context[addAnimationCallback](this.props.animationKey, this.instanceId, this.props.onCallback)
    }
  }

  componentWillUnmount = () => {
    if (this.context[addAnimationCallback] && this.props.onCallback != null) {
      this.context[removeAnimationCallback](this.props.animationKey, this.instanceId)
    }
  }

  render() {
    const Child = React.Children.only(this.props.children)
    const propsToPass = {
      ...Child.props,
      ...this.props,
      children: Child.props.children,
    }
    delete propsToPass[animationKey]
    delete propsToPass.onCallback
    const childStyle = StyleSheet.flatten(Child.props.style) || {}
    const hasThisStyle = this.props.style != null
    const thisStyle = hasThisStyle ? StyleSheet.flatten(this.props.style) : {}
    const { animationKey: key } = this.props
    let animStyles = key && this.context[animatedStyles]
      ? this.context[animatedStyles][key]
      : null
    animStyles = StyleSheet.flatten(animStyles) || {}
    const stylesToPass = {
      ...childStyle,
      ...animStyles,
      ...thisStyle,
    }

    // Workaround for wrapping a Touchable: apply styles to a wrapper view. (Not ideal but usually works)
    if (Child.type.displayName && Child.type.displayName.includes('Touchable')) {
      return (
        <Animated.View
          style={stylesToPass}
        >
          {
            React.cloneElement(Child, {
              ...propsToPass,
              style: {},
            })
          }
        </Animated.View >
      )
    }

    // All normal cases
    return (
      React.cloneElement(Child, {
        ...propsToPass,
        style: stylesToPass,
      })
    )
  }
}

// Workaround for case where a parent node is also trying to animate our child node
export default Animated.createAnimatedComponent(AnimatedNode_)
