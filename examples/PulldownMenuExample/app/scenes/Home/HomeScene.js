import React, { PropTypes } from 'react'
import {
  View,
  ScrollView,
} from 'react-native'

import { SIZES } from './pulldownConsts'
import pageContent from 'data/pageContent'

import PulldownHeader from './header/PulldownHeader'
import ThumbnailRow from 'shared/ThumbnailRow'
import Thumbnail from 'shared/Thumbnail'

const {
  EXPANDED_HEIGHT,
  NORMAL_HEIGHT,
  COLLAPSED_HEIGHT,
} = SIZES

/**
 * This is the main scene. It doesn't contain any Animated code.
 * It renders content and reports scroll position using a callback.
 */
export default class HomeScene extends React.Component {

  static propTypes = {
    headerExpanded: PropTypes.bool.isRequired,
    setHeaderExpanded: PropTypes.func.isRequired,
    topMenuData: PropTypes.array.isRequired,
    topMenuTitle: PropTypes.string.isRequired,

    onMenuItemPress: PropTypes.func,
    onScrollPositionChange: PropTypes.func,
  }

  scrollY = -NORMAL_HEIGHT
  scrollingUp = false
  transitioning = false

  handleClosePress = () => {
    this.transitionTo(NORMAL_HEIGHT)
  }

  handleOpenPress = () => {
    this.transitionTo(EXPANDED_HEIGHT)
  }

  handleMenuItemPress = (index, data) => {
    this.props.onMenuItemPress && this.props.onMenuItemPress(index, data)
    this.transitionTo(NORMAL_HEIGHT)
  }

  handleScroll = ({
    nativeEvent: {
      contentOffset: { y: scrollY },
    },
  }) => {
    this.scrollingUp = -this.scrollY < scrollY
    this.scrollY = -scrollY
    this.props.onScrollPositionChange && this.props.onScrollPositionChange(this.scrollY)
    if (!this.transitioning && this.scrollY < EXPANDED_HEIGHT) {
      this.setHeaderExpanded(false)
    }
  }

  handleEndDrag = () => {
    this.snap()
  }

  snap = () => {
    if (this.scrollView.getScrollResponder().scrollResponderIsAnimating()) {
      return
    }

    // this is a little more complicated than it typically would be, since there are 3 'snap' positions
    let min = -1
    let max = -1
    if (this.scrollY > COLLAPSED_HEIGHT && this.scrollY < NORMAL_HEIGHT) {
      min = COLLAPSED_HEIGHT
      max = NORMAL_HEIGHT
    }
    else if (this.scrollY > NORMAL_HEIGHT && this.scrollY < EXPANDED_HEIGHT) {
      min = NORMAL_HEIGHT
      max = EXPANDED_HEIGHT
    }

    if (min > -1 && max > -1) {
      const pct = (this.scrollY - min) / (max - min)
      const tolerance = (!this.scrollingUp ? 0.25 : 0.75)
      const targetPosition = (pct > tolerance ? max : min)
      this.transitionTo(targetPosition)
    }
  }

  setHeaderExpanded = (value) => {
    if (this.props.headerExpanded !== value) {
      this.props.setHeaderExpanded(value)
    }
  }

  transitionTo = (targetPosition) => {
    this.transitioning = true
    this.scrollView.scrollTo({ y: -targetPosition })
    const expanded = targetPosition === EXPANDED_HEIGHT
    !expanded && this.props.setHeaderExpanded(false)
    setTimeout(() => {
      expanded && this.props.setHeaderExpanded(expanded)
      this.transitioning = false
    }, 400)
  }

  render() {
    return (
      <View
        style={{ flexGrow: 1 }}
      >
        <ScrollView
          ref={(r) => { this.scrollView = r }}
          style={{ flexGrow: 1 }}
          contentInset={{ top: EXPANDED_HEIGHT }}
          contentOffset={{ y: -NORMAL_HEIGHT }}
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={this.handleScroll}
          onScrollEndDrag={this.handleEndDrag}
        >
          {
            Object.values(pageContent).map((items, i) => (
              <ThumbnailRow key={`row-${i}`}>
                {
                  items.map((props, j) => (
                    <Thumbnail key={`row-${i}-item-${j}`} {...props} />
                  ))
                }
              </ThumbnailRow>
            ))
          }
        </ScrollView>
        <PulldownHeader
          headerExpanded={this.props.headerExpanded}
          topMenuTitle={this.props.topMenuTitle}
          topMenuData={this.props.topMenuData}
          onOpenPress={this.handleOpenPress}
          onClosePress={this.handleClosePress}
          onMenuItemPress={this.handleMenuItemPress}
        />
      </View>
    )
  }
}
