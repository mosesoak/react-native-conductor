![Conductor](./conductor-logo-small.png)

# Conductor
*Orchestrate animations across components in one place*

Not a new animation syntax, but a way to organize your code to make `Animated` easier to work with. Animation code is condensed into a wrapper component that feeds `Animated` styles to its children.

![Conductor Diagram](./conductor-diagram.png)

I wrote this to address the fact that `Animated` code can get bulky and difficult to coordinate between subcomponents.

## Install

`yarn add react-native-conductor` - or - `npm install --save react-native-conductor`

## Example

The included `PulldownMenuExample` project features a collapsing nav header modeled on the Airbnb app. *(This isn't a collapsing header module! I just needed a sufficiently complex use case to illustrate Conductor.)*

![Pulldown Menu Example](./PulldownMenuExample.gif)

To run:
- clone this repo
- cd into the repo and then `cd examples/PulldownMenuExample`
- run `yarn`, then `yarn ios` to start (or `npm i`, `npm run ios`)

## Docs

The presumed usage is **one Conductor per scene or component group,** not a single one for a whole app. Conductors can be nested, so subcomponents can have their own as needed.

This example is a vanilla React component class named `HomeConductor` that wraps a `HomeScene` component. This class houses all of your `Animated` code.

```JSX
import { Conductor_ } from 'react-native-conductor'
import HomeScene from './HomeScene'

export default class HomeConductor extends React.Component {

  // ... all the animationz ...
  headerHeight = new Animated.Value(NORMAL_HEIGHT)
  headerHeightStyle = { height: this.headerHeight }

  handleMenuItemPress = (index, data) => {
   // ... trigger some animation on a user action, etc.
    this.doIntroSequence()
  }
```

Now for the setup: 'decorate' your main component with a `Conductor_` tag that provides its animated styles by string key:
```JSX
  render() {
    return (
      <Conductor_
        animatedStyles={{
          'headerHeight': this.headerHeightStyle,
          // ... and all the others – styles can be objects or arrays
        }}
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
```

Then in any child component, no matter how deeply nested:
```JSX
import { AnimatedNode_ } from 'react-native-conductor'
...
  <AnimatedNode_
    animationKey='headerHeight'
  >
    <Animated.View ...etc. />
  </AnimatedNode_>
```
This pipes all animated styles you've associated with `'headerHeight'` onto any child node, which must be an Animated-enabled tag – `Animated.View`, `Animated.Image`, `Animated.Text`, or a custom component generated using `createAnimatedComponent()`.

Happily, the Conductor doesn't need to know or care about the structure of the view hierarchy, and child components only need to declare that they want styles to receive them, no extra work is required. Please read my [Medium post](#medium-post) for more.

That's it!

#### `Conductor_` Tips

- Your file bundle can be kept most portable by putting it in a folder, in this case named `Home`, and then including an index file that does `export { default } from './HomeConductor'`. This allows easy import using `import Home from './Home'`.

- If you have a 'smart' container for Redux or Mobx wiring around your component, *don't* put the Conductor around that wrapper! A Conductor 'belongs to' the presentation component and should wrap it directly. (A smart container doesn't really belong in the component folder at all, since it's app-specific.)

#### `AnimatedNode_` Tips

- Decorated views should declare default (non-animated) styles so the view will render correctly without the Conductor, or if used with a different Conductor.

- `AnimatedNode_` tags annotate that views receive styles from above, but you don't see which animated styles are piped in. This might be a drawback in some cases, although I've found it freeing in practice: responsibility is offloaded to the Conductor; no extra linkages need to be maintained.

- Receiving tags are non-unique, in the odd case that two different views want the same animations.

- Only one set of styles can be indicated with `animationKey`, but an array of styles may be passed for any key.

## Communication with a Conductor

Child nodes need a way to start animations, and to receive on-complete callbacks. There are two ways to solve this:

1. If you're comfortable using **an event emitter**, this neatly solves for both directions. You're ready to go!

2. If you prefer to use **callbacks**, this is straightforward in the child-to-parent direction (see `onMenuItemPress` above) but not in the case where a Conductor needs to pass an onComplete to a child.

To keep your `Animated` code as pure as possible (vs. introducing a new tween syntax), an imperative API is provided that allows you to send callbacks to any child easily:

```JSX
fireCallback(animationKey: string, ...args)
```

This method is called directly on the `Conductor_` node so you must set a ref.

```JSX
<Conductor_
  animatedStyles={{ headerHeight: this.headerHeightStyle }}
  ref={(r) => { this.conductor = r }}
/>
...
Animated.timing(this.headerHeight, {...}, () => {
  this.conductor.fireCallback('headerHeight', 'This is on complete')
})
```
Child:
```JSX
<AnimatedNode_
  animationKey='headerHeight'
  onCallback={this.handleHeaderHeightCallback}
>
```

It's called `onCallback`, not `onComplete`, since this is just a function-call mechanism that can be used at any time – on complete, on start, after a timeout.

## Nested Conductors

Conductors can be nested. This enables you to break your animation code into more manageable chunks, or separate a subcomponent's animations into a discreet package to make it more portable.

## Other Animation Libs

This module doesn't intend to replace other solutions (e.g. JSX-based libs), and can be used in tandem with those efficiently since everyone uses `Animated`. Use JSX for fades and drifts; use Conductor when you turn to `Animated` for the more complex cases.

## Thanks

Conductor was created for my work at [Instrument](http://instrument.com). Special thanks to their management for being cool enough to encourage their developers to release open source work! And to the FUN dev team for their help and inspiration.

## Medium Post

**[Conductor: Orchestrate Animation in React Native](https://medium.com/@moses.gunesch/conductor-orchestrate-animation-in-react-native-edd22b59ad17)**
