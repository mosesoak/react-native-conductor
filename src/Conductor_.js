import React, { PropTypes } from 'react'

import {
  animatedStyles,
  addAnimationCallback,
  removeAnimationCallback,
} from './conductorConstants'

export default class Conductor_ extends React.Component {

  static propTypes = {
    animatedStyles: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    [animatedStyles]: PropTypes.object,
    [addAnimationCallback]: PropTypes.func,
    [removeAnimationCallback]: PropTypes.func,
  }

  callbacks = {}

  componentWillUnmount = () => {
    this.callbacks = null
  }

  getChildContext = () => {
    return {
      [animatedStyles]: this.props.animatedStyles,
      [addAnimationCallback]: this.addAnimationCallback,
      [removeAnimationCallback]: this.removeAnimationCallback,
    }
  }

  addAnimationCallback = (key, instanceId, onCallback) => {
    // Stored by animationKey and instanceId to handle special case of key being shared.
    // This allows for clean removal, e.g. if just one instance is removed on complete.
    if (key && this.props.animatedStyles[key]) {
      if (!this.callbacks[key]) {
        this.callbacks[key] = {}
      }
      this.callbacks[key][instanceId] = onCallback
    }
  }

  removeAnimationCallback = (key, instanceId) => {
    const list = this.callbacks[key]
    if (key && list) {
      if (Object.keys(list).length > 1) {
        delete list[instanceId]
      }
      else {
        delete this.callbacks[key]
      }
    }
  }

  fireCallback = (animationKey, ...args) => {
    const list = this.callbacks[animationKey] ? Object.values(this.callbacks[animationKey]) : []
    if (list.length > 0) {
      list.forEach(onCallback => onCallback(...args))
    }
    else {
      console.warn(`Error: fireCallback received invalid argument: "${animationKey}" - the onCallback will not fire!`)
    }
  }

  render() {
    return (
      React.Children.only(this.props.children)
    )
  }
}
