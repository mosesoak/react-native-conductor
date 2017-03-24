import React, { PropTypes } from 'react'
import { Animated, StyleSheet } from 'react-native'

import {
  animationKey,
  animatedStyles,
  addAnimationCallback,
  removeAnimationCallback,
} from './conductorConstants'


export default class AnimatedNode_ extends React.Component {
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
    let propsToPass = {
      ...Child.props,
      ...this.props,
      children: Child.props.children,
    }
    delete propsToPass[animationKey]
    delete propsToPass.onCallback
    const childStyle = StyleSheet.flatten(Child.props.style) || {}
    const { animationKey: key } = this.props
    let animStyles = key && this.context[animatedStyles]
      ? this.context[animatedStyles][key]
      : null
    animStyles = StyleSheet.flatten(animStyles) || {}

    if (animStyles) {
      propsToPass = {
        ...propsToPass,
        style: {
          ...childStyle,
          ...animStyles,
        },
      }
    }

    // Handle edge case where another component passed a conflicting style onto this AnimatedNode_.
    // (In most cases AnimatedNode_ should wrap an Animated element, so we can avoid adding an extra View.)
    const thisStyle = StyleSheet.flatten(this.props.style) || {}
    if (Object.keys(thisStyle).find((name) => (propsToPass.style[name] != null))) {
      return (
        <Animated.View style={thisStyle}>
          {React.cloneElement(Child, propsToPass)}
        </Animated.View>
      )
    }

    return (
      React.cloneElement(Child, propsToPass)
    )
  }
}
