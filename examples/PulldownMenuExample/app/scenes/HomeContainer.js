import React from 'react'
import { observer } from 'mobx-react/native'

import PulldownMenuState from 'stores/PulldownMenuState'
import Home from './Home'

/**
 * This container wires up app states, to keep the main components portable.
 *
 * If you're adding a Conductor and already have such a container, be sure
 * to make the Conductor wrap your main component directly.
 *
 * That keeps your Conductor easily portable with your component, whereas
 * this container is app-specific so it wouldn't be ported directly.
 */
@observer
export default class HomeContainer extends React.Component {
  render() {
    return (
      <Home
        headerExpanded={PulldownMenuState.headerExpanded}
        topMenuTitle={PulldownMenuState.topMenuTitle}
        topMenuData={PulldownMenuState.topMenuData}
        setHeaderExpanded={(value) => PulldownMenuState.setHeaderExpanded(value)}
      />
    )
  }
}
