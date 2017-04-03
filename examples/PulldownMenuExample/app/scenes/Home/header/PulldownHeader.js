import React, { PropTypes } from 'react'

import {
  StyleSheet,
  Animated,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'

import { STYLES } from './../pulldownConsts'

import { AnimatedNode_ } from 'react-native-conductor'

import PulldownHeaderMenu from './PulldownHeaderMenu'
import { AnimatedHeaderListItem } from 'shared/HeaderListItem'

/**
 * This child component receives animated styles from HomeConductor.
 *
 * Note how each <AnimatedNode_> declares one of the keys defined on the
 * Conductor_ and always 'decorates' a single Animated child view.
 */
export default class PulldownHeader extends React.Component {

  static propTypes = {
    headerExpanded: PropTypes.bool.isRequired,
    topMenuData: PropTypes.array.isRequired,
    topMenuTitle: PropTypes.string.isRequired,

    onClosePress: PropTypes.func,
    onMenuItemPress: PropTypes.func,
    onOpenPress: PropTypes.func,
  }

  handleMenuTogglePress = () => {
    if (this.props.headerExpanded) {
      this.props.onClosePress && this.props.onClosePress()
    }
    else {
      this.props.onOpenPress && this.props.onOpenPress()
    }
  }

  handleMenuItemPress = (index, data) => {
    this.props.onMenuItemPress && this.props.onMenuItemPress(index, data)
  }

  handleHeaderHeightCallback = (message) => {
    /**
     * Example of communication from the conductor back to a child (e.g. onComplete).
     * See HomeConductor for more.
     */
    console.log(`headerHeight callback fired! message: ${message}`)
  }

  render() {
    return (
      <AnimatedNode_
        animationKey='headerHeight'
        onCallback={this.handleHeaderHeightCallback}
      >
        <Animated.Image
          style={styles.container}
          source={require('images/menu-bg.png')}
        >
          <PulldownHeaderMenu
            onMenuItemPress={this.handleMenuItemPress}
            topMenuData={this.props.topMenuData}
          />

          {/* Close button */}
          <AnimatedNode_
            animationKey='arrow'
          >
            <TouchableOpacity
              style={styles.arrow}
              onPress={this.handleMenuItemPress}
              activeOpacity={0.8}
            >
              <Image
                source={require('images/up-arrow.png')}
              />
            </TouchableOpacity>
          </AnimatedNode_>

          {/* Title item at normal size */}
          {
            !this.props.headerExpanded &&
            <AnimatedNode_
              animationKey='normalHeaderTitle'
            >
              <AnimatedHeaderListItem
                style={styles.normalHeaderTitle}
                onPress={this.handleMenuTogglePress}
                text={this.props.topMenuTitle}
              />
            </AnimatedNode_>
          }

          {/* Fake tab bar at bottom of header */}
          <View
            style={styles.tabContainer}
          >
            {
              ['FOR YOU', 'HOMES', 'EXPERIENCES', 'PLACES'].map((title, i) => (
                <AnimatedNode_
                  key={`tab-${i}`}
                  animationKey='tabsTitleColor'
                >
                  <Animated.Text
                    style={styles.tabTitle}
                  >
                    {title}
                  </Animated.Text>
                </AnimatedNode_>
              ))
            }
          </View>
        </Animated.Image>
      </AnimatedNode_ >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...STYLES.HEADER_CONTAINER,
  },
  normalHeaderTitle: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
  },
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginHorizontal: 20,
  },
  tabTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  arrow: {
    position: 'absolute',
    top: 45,
    left: 30,
  },
})
