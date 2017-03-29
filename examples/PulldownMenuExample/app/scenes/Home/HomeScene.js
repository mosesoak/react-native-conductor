import React, { PropTypes } from 'react'
import {
  View,
  Image,
  ScrollView,
} from 'react-native'

import { SIZES } from './pulldownConsts'
import pageContent from 'data/pageContent'

import PulldownHeader from './subcomponents/PulldownHeader'
import ThumbnailRow from './subcomponents/ThumbnailRow'
import Thumbnail from './subcomponents/Thumbnail'

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
    topMenuData: PropTypes.array.isRequired,

    isExpanded: PropTypes.bool,
    onMenuItemPress: PropTypes.func,
    onScrollPositionChange: PropTypes.func,
    setHeaderExpanded: PropTypes.func,
    topMenuTitle: PropTypes.string,
  }

  scrollY = -NORMAL_HEIGHT
  scrollingUp = false

  handleClosePress = () => {
    this.scrollView.scrollTo({ y: -NORMAL_HEIGHT })
    setTimeout(() => this.setHeaderExpanded(false), 300)
  }

  handleOpenPress = () => {
    this.scrollView.scrollTo({ y: -EXPANDED_HEIGHT })
    setTimeout(() => this.setHeaderExpanded(true), 300)
  }

  handleMenuItemPress = (index, data) => {
    this.props.onMenuItemPress && this.props.onMenuItemPress(index, data)
    this.scrollView.scrollTo({ y: -NORMAL_HEIGHT })
    setTimeout(() => this.setHeaderExpanded(false), 300)
  }

  handleScroll = ({
    nativeEvent: {
      contentOffset: { y: scrollY },
    },
  }) => {
    this.scrollingUp = -this.scrollY < scrollY
    this.scrollY = -scrollY
    this.props.onScrollPositionChange && this.props.onScrollPositionChange(this.scrollY)
    if (this.props.headerExpanded && this.scrollY < EXPANDED_HEIGHT) {
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

    // this is a little more complicated than it typically would be, since there 2 'snap' positions
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
      const target = (pct > tolerance ? max : min)
      this.scrollView.scrollTo({ y: -target })
      this.props.setHeaderExpanded(target === EXPANDED_HEIGHT)
    }
  }

  setHeaderExpanded = (value) => {
    this.props.setHeaderExpanded && this.props.setHeaderExpanded(value)
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
            [...Object.values(pageContent), ...Object.values(pageContent)].map((items, i) => (
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
          isExpanded={this.props.headerExpanded}
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
