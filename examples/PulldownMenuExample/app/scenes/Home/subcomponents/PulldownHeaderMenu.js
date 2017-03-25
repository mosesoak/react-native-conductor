import React, { PropTypes } from 'react'

import {
  StyleSheet,
  Animated,
  View,
  Image,
} from 'react-native'

import { SIZES, STYLES } from './../pulldownConsts'

import { AnimatedNode_ } from 'react-native-conductor'
import HeaderListItem from './HeaderListItem'

/**
 * This is the 3rd child down in the component tree, and also uses
 * <AnimatedNode_> to pipe in animated styles from HomeConductor.
 */
export default class PulldownHeaderMenu extends React.Component {
  static propTypes = {
    topMenuData: PropTypes.array.isRequired,

    onMenuItemPress: PropTypes.func,
  }

  handleMenuItemPress = (index, data) => {
    this.props.onMenuItemPress && this.props.onMenuItemPress(index, data)
  }

  render() {
    return (
      <Image
        style={styles.container}
        source={require('images/menu-bg.png')}
      >
        <AnimatedNode_
          animationKey='headerBGColor'
        >
          <Animated.View
            style={styles.innerContainer}
          >
            {
              this.props.topMenuData.map((data, index) => (
                <AnimatedNode_
                  key={`listItem${index}`}
                  animationKey={`expandedHeaderItem${(index + 1)}`}
                >
                  <Animated.View>
                    <HeaderListItem
                      text={data.title}
                      onPress={() => this.handleMenuItemPress(index, data)}
                    />
                  </Animated.View>
                </AnimatedNode_>
              ))
            }
          </Animated.View>
        </AnimatedNode_>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...STYLES.HEADER_CONTAINER,
    height: SIZES.EXPANDED_HEIGHT,
  },
  innerContainer: {
    flexGrow: 1,
    paddingTop: SIZES.NORMAL_TOP_PART_HEIGHT,
  },
})
