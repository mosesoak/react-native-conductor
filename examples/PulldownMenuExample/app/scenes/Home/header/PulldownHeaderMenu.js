import React, { PropTypes } from 'react'

import {
  StyleSheet,
  Animated,
} from 'react-native'

import { SIZES } from './../pulldownConsts'
import { AnimatedNode_ } from 'react-native-conductor'
import { AnimatedHeaderListItem } from 'shared/HeaderListItem'

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
      <AnimatedNode_
        animationKey='headerBGColor'
      >
        <Animated.View
          style={styles.container}
        >
          {
            this.props.topMenuData.map((data, index) => (
              <AnimatedNode_
                key={`listItem${index}`}
                animationKey={`expandedHeaderItem${(index + 1)}`}
              >
                <AnimatedHeaderListItem
                  text={data.title}
                  onPress={() => this.handleMenuItemPress(index, data)}
                />
              </AnimatedNode_>
            ))
          }
        </Animated.View>
      </AnimatedNode_>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SIZES.NORMAL_TOP_PART_HEIGHT,
    backgroundColor: 'transparent',
  },
})
