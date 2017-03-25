import React, { PropTypes } from 'react'

import {
  StyleSheet,
  Animated,
  View,
  Image,
  TouchableWithoutFeedback,
  Text,
} from 'react-native'

import { SIZES, STYLES } from './../pulldownConsts'

import { AnimatedNode_ } from 'react-native-conductor'

import PulldownHeaderMenu from './PulldownHeaderMenu'
import HeaderListItem from './HeaderListItem'

/**
 * This child component receives animated styles from HomeConductor.
 *
 * Note how each <AnimatedNode_> declares one of the keys defined on the
 * Conductor_ and always 'decorates' a single Animated child view.
 */
export default class PulldownHeader extends React.Component {

  static propTypes = {
    topMenuData: PropTypes.array.isRequired,

    isExpanded: PropTypes.bool,
    onClosePress: PropTypes.func,
    onMenuItemPress: PropTypes.func,
    onOpenPress: PropTypes.func,
    topMenuTitle: PropTypes.string,
  }

  static defaultProps = {
  }

  handleMenuTogglePress = () => {
    if (this.props.isExpanded) {
      this.props.onClosePress && this.props.onClosePress()
    }
    else {
      this.props.onOpenPress && this.props.onOpenPress()
    }
  }

  handleMenuItemPress = (index, data) => {
    this.props.onMenuItemPress && this.props.onMenuItemPress(index, data)
  }

  /**
   * Example of communication from the conductor back to a child (e.g. onComplete).
   * See HomeConductor for more.
   */
  handleHeaderHeightCallback = (...args) => {
    console.log('headerHeight callback fired! args=' + args.join('  '))
  }

  render() {
    return (
      <AnimatedNode_
        animationKey='headerHeight'
        onCallback={this.handleHeaderHeightCallback}
      >
        <Animated.View
          style={styles.container}
        >
          <PulldownHeaderMenu
            onMenuItemPress={this.handleMenuItemPress}
            topMenuData={this.props.topMenuData}
          />

          <TouchableWithoutFeedback
            onPress={this.handleMenuItemPress}
          >
            <AnimatedNode_
              animationKey='arrow'
            >
              <Animated.Image
                source={require('images/up-arrow.png')}
                style={styles.arrow}
              />
            </AnimatedNode_>
          </TouchableWithoutFeedback>

          {
            !this.props.isExpanded &&
            <AnimatedNode_
              animationKey='normalHeaderTitle'
            >
              <Animated.View
                style={{ backgroundColor: 'transparent' }}
              >
                <HeaderListItem
                  onPress={this.handleMenuTogglePress}
                  text={this.props.topMenuTitle}
                />
              </Animated.View>
            </AnimatedNode_>
          }
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
        </Animated.View>
      </AnimatedNode_ >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...STYLES.HEADER_CONTAINER,
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
  },
  tabTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: 20,
  },
  arrow: {
    position: 'absolute',
    top: 45,
    left: 30,
  },
})
