import React from 'react'
import {
  Animated,
} from 'react-native'

import { clamp } from 'lodash'

import { SIZES } from './pulldownConsts'

import HomeScene from './HomeScene'

import { Conductor_ } from 'react-native-conductor'

const {
  EXPANDED_HEIGHT,
  NORMAL_HEIGHT,
  COLLAPSED_HEIGHT,
} = SIZES
const EXPANDED_DIST = EXPANDED_HEIGHT - NORMAL_HEIGHT
const MENU_ITEM_DRIFT = 5


/**
 * This class uses Conductor_ to pipe animated styles to a component tree.
 *
 * This allows you to coordinate animations in one place, and remove bulky Animated code
 * from the child components.
 *
 * Scroll down to render() for futher doc comments...
 */
export default class HomeConductor extends React.Component {

  conductor = null // see <Conductor_> ref

    
  // Note that React Native's docs suggest storing Animated values in state, but that is not
  // necessary and feels like a perf risk. I suggest putting everything in the class scope.

  // --Animated values--

  headerHeight = new Animated.Value(NORMAL_HEIGHT)

  headerBGColor = this.headerHeight.interpolate({
    inputRange: [COLLAPSED_HEIGHT, NORMAL_HEIGHT],
    outputRange: ['white', 'transparent'],
    extrapolate: 'clamp',
  })

  tabsTitleColor = this.headerHeight.interpolate({
    inputRange: [COLLAPSED_HEIGHT, NORMAL_HEIGHT],
    outputRange: ['gray', 'white'],
    extrapolate: 'clamp',
  })

  // normal header

  normalHeaderTitleOpacity = this.headerHeight.interpolate({
    inputRange: [COLLAPSED_HEIGHT + 20, NORMAL_HEIGHT, NORMAL_HEIGHT + (EXPANDED_DIST * 0.5)],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  })

  normalHeaderTitleTranslateY = this.headerHeight.interpolate({
    inputRange: [COLLAPSED_HEIGHT, NORMAL_HEIGHT, NORMAL_HEIGHT + (EXPANDED_DIST * 0.5)],
    outputRange: [0, 0, 40],
    extrapolate: 'clamp',
  })

  // expanded header

  arrowOpacity = this.headerHeight.interpolate({
    inputRange: [NORMAL_HEIGHT + (EXPANDED_DIST * 0.5), EXPANDED_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  arrowTopMargin = this.headerHeight.interpolate({
    inputRange: [NORMAL_HEIGHT, EXPANDED_HEIGHT],
    outputRange: [-10, 0],
    extrapolate: 'clamp',
  })

  expandedHeaderItem1Opacity = this.headerHeight.interpolate({
    inputRange: [COLLAPSED_HEIGHT, NORMAL_HEIGHT + (EXPANDED_DIST * 0.2), NORMAL_HEIGHT + (EXPANDED_DIST * 0.6)],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  })

  expandedHeaderItem1MarginTop = this.headerHeight.interpolate({
    inputRange: [NORMAL_HEIGHT + (EXPANDED_DIST * 0.2), NORMAL_HEIGHT + (EXPANDED_DIST * 0.6), EXPANDED_HEIGHT],
    outputRange: [-35, 0, 0],
    extrapolate: 'clamp',
  })

  expandedHeaderItem2Opacity = this.headerHeight.interpolate({
    inputRange: [COLLAPSED_HEIGHT, NORMAL_HEIGHT + (EXPANDED_DIST * 0.4), NORMAL_HEIGHT + (EXPANDED_DIST * 0.8)],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  })

  expandedHeaderItem2MarginTop = this.headerHeight.interpolate({
    inputRange: [NORMAL_HEIGHT + (EXPANDED_DIST * 0.4), NORMAL_HEIGHT + (EXPANDED_DIST * 0.8), EXPANDED_HEIGHT],
    outputRange: [-MENU_ITEM_DRIFT, 0, 0],
    extrapolate: 'clamp',
  })

  expandedHeaderItem3Opacity = this.headerHeight.interpolate({
    inputRange: [COLLAPSED_HEIGHT, NORMAL_HEIGHT + (EXPANDED_DIST * 0.6), EXPANDED_HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  })

  expandedHeaderItem3MarginTop = this.headerHeight.interpolate({
    inputRange: [NORMAL_HEIGHT + (EXPANDED_DIST * 0.6), EXPANDED_HEIGHT, EXPANDED_HEIGHT],
    outputRange: [-MENU_ITEM_DRIFT, 0, 0],
    extrapolate: 'clamp',
  })

  // --animated styles--

  headerHeightStyle = {
    height: this.headerHeight,
  }

  headerBGColorStyle = {
    backgroundColor: this.headerBGColor,
  }

  tabsTitleColorStyle = {
    color: this.tabsTitleColor,
  }

  normalHeaderTitleStye = {
    opacity: this.normalHeaderTitleOpacity,
    transform: [{ translateY: this.normalHeaderTitleTranslateY }],
  }

  arrowStyle = {
    opacity: this.arrowOpacity,
    marginTop: this.arrowTopMargin,
  }

  expandedHeaderItem1Style = {
    opacity: this.expandedHeaderItem1Opacity,
    marginTop: this.expandedHeaderItem1MarginTop,
  }

  expandedHeaderItem2Style = {
    opacity: this.expandedHeaderItem2Opacity,
    marginTop: this.expandedHeaderItem2MarginTop,
  }

  expandedHeaderItem3Style = {
    opacity: this.expandedHeaderItem3Opacity,
    marginTop: this.expandedHeaderItem3MarginTop,
  }

  // --methods--

  handleScrollPositionChange = (value) => {
    this.headerHeight.setValue(clamp(value, COLLAPSED_HEIGHT, EXPANDED_HEIGHT))
  }

  handleMenuItemPress = () => {
    // To talk to children, e.g. when an animation completes, you can use an event
    // emitter, or this imperitive hook that lets you fire a callback by style key.
    // Note that you need to set a ref on the Conductor_ node to use this.
    this.conductor.fireCallback('headerHeight', 'This is a callback!')
  }

  /**
   * Animated styles are defined using string keys that get used in children like this:
   * <AnimatedNode_ key='headerHeight'><Animated.View...></AnimatedNode_>
   *
   * Each key can define a single style or array of styles. These are piped to the child
   * of the AnimatedNode_, which must be an Animated view.
   */
  render() {
    const animatedStyles = {
      'headerHeight': this.headerHeightStyle,
      'headerBGColor': this.headerBGColorStyle,
      'tabsTitleColor': this.tabsTitleColorStyle,
      'normalHeaderTitle': this.normalHeaderTitleStye,
      'arrow': this.arrowStyle,
      'expandedHeaderItem1': this.expandedHeaderItem1Style,
      'expandedHeaderItem2': this.expandedHeaderItem2Style,
      'expandedHeaderItem3': this.expandedHeaderItem3Style,
    }
    return (
      <Conductor_
        animatedStyles={animatedStyles}
        ref={(r) => { this.conductor = r }}
      >
        <HomeScene
          {...this.props}
          onScrollPositionChange={this.handleScrollPositionChange}
          onMenuItemPress={this.handleMenuItemPress}
        />
      </Conductor_>
    )
  }
}
