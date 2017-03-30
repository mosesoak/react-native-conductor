![Conductor](./conductor-logo-small.png)

# Conductor
*Orchestrate animations across components in one place*

Provides an easy way to move `Animated` code into a wrapper component that feeds styles to its child components. I wrote this to address the fact that `Animated` code can get bulky and difficult to coordinate between subcomponents.

<p align="center"><img src='./conductor-diagram.png'></p>

The example `PulldownMenuExample` project features a collapsing nav header modeled on the Airbnb app. *(This isn't a collapsing header module! I just needed a sufficiently complex use case to illustrate `Conductor`.)*

<p align="center"><img src='./PulldownMenuExample.gif'></p>

To run the example: clone this repo, `cd examples/PulldownMenuExample`, `yarn`, `yarn ios` (or `npm i`, `npm run ios`)

## Description

A plain wrapper component places a `Conductor_` tag around the main scene component in the example project. This empty wrapper provides a single location to set up and manage all of the `Animated` values, tweens and styles. Nested child components like the header and header menu pipe animated styles onto their views with `AnimatedNode_` tags.

Happily, the Conductor doesn't need to know or care about the structure of the view hierarchy, and child components only need to declare that they want styles to receive them, no extra work is required. Conductors can be nested, and can be used with a single component or a complex hierarchy.

For a more detailed look at the strengths and weaknesses of this system, please read my Medium post:

**[Conductor: Orchestrate Animation in React Native](https://medium.com/@moses.gunesch/conductor-orchestrate-animation-in-react-native-edd22b59ad17)**

Note: in future it would be nice to provide a tween-centric example, since this one just uses scroll interpolations. Using `Conductor` with tweens lets you manage all timings in one place, across any subcomponents.

## Install

`yarn add react-native-conductor`
or
`npm install react-native-conductor --save`

## Overview

The presumed usage is **one `Conductor` per scene** or other discreet unit, not a single one for a whole app.

A `Conductor` is just a vanilla React component that you create and name. In this example it's named `HomeConductor` since it wraps a `HomeScene` component.

Put standard `Animated` code in the class, like so:

```JSX
import { Conductor_ } from 'react-native-conductor'
import HomeScene from './HomeScene'

export default class HomeConductor extends React.Component {

  // ... all the animationz ...
  
  // Note that React Native's docs suggest storing Animated values in state, but that is not
  // necessary and feels like a perf risk. I suggest putting everything in the class scope.

  headerHeight = new Animated.Value(NORMAL_HEIGHT)
  
  headerHeightStyle = {
    height: this.headerHeight,
  }
  
  // ... all the animation codez ...
  
  componentDidMount() {
    // ... maybe start some tweens here
  }

  handleMenuItemPress = (index, data) => {
    // ... maybe start a sequence on a user action, etc.
    this.doIntroSequence()
  }
  
  doIntroSequence() {
    Animated.sequence(...).start() // etc.
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
This pipes all animated styles you've associated with `'headerHeight'` onto the child node, which must be an Animated-enabled tag – `Animated.View`, `Animated.Image`, `Animated.Text`, or a custom component generated using `createAnimatedComponent()`.

That's it!

A few notes about adding the `Conductor_` container:

- Your file bundle can be kept most portable by putting it in a folder, in this case named `Home`, and then including an index file that does `export { default } from './HomeConductor'`. This allows easy import using `import Home from './Home'`.

- If you have a 'smart' container for Redux or Mobx wiring around your component, *don't* put the Conductor around that wrapper! A Conductor 'belongs to' the presentation component and should wrap it directly. A smart container doesn't really belong in the component folder at all, since it's app-specific.

And a few notes about animated styles:

- `AnimatedNode_` tags clearly annotate that a view receives styles from above, but you don't see which animated styles are piped in. This might feel like a limitation, but it can be an advantage in that it retains flexibility.

- Animated views should still declare their default (non-animated) styles. This ensures your component will render correctly without its `Conductor`. It can also be more easily used with a different `Conductor`.

## Communication with a Conductor

You'll need to communicate to and from a Conductor when:
- you want to start animations in the conductor
- you want to know when animations are complete in children

*A straightforward solution is to use an event emitter.*

If you prefer to use callbacks, talking from children up to the `Conductor` is a standard process, as illustrated by `onMenuItemPress` in the example code above. To talk back to child components from a Conductor, e.g. onComplete, an imperative `fireCallback` hook is provided:

Child:
```JSX
<AnimatedNode_
  animationKey='headerHeight'
  onCallback={this.handleHeaderHeightCallback}
>
```
Conductor:
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
Where `this.conductor` is a `ref` that you set on your `Conductor_` node, `'headerHeight'` indicates which child node to send the callback to using a key from its `animatedStyles` list, `'This is on complete'` and any additional arguments are passed to the callback, and at least one child `AnimatedNode_` declares an `onCallback` prop.

It's called `onCallback`, not `onComplete`, since this is just a function-call mechanism that can be used at any time. For example it could be called on animation-start, or after a timeout.

## Nested Conductors

Conductors can be nested. This enables you to break your animation code into more manageable chunks, or separate a subcomponent's animations into a discreet package to make it more portable.

## Other Animation Libs

`Conductor` doesn't intend to replace other solutions – there are quite a few excellent JSX-based animation libraries on the market that can handle most simple and even moderately-complex cases. Continue to use those! `Conductor` is best for substantial components with a lot of `Animated` code. Other libraries almost always use `Animated` as well, making it safe and efficient to mix: use JSX-based animations when you can, then break out a Conductor to help you organize your code when you use `Animated`.

## Thanks

Conductor was created for my work at [Instrument](http://instrument.com). Special thanks to their management for being cool enough to encourage their developers to release open source work! And to the FUN dev team for their help and inspiration.

I wrote `Conductor` to help in my own work, and I hope it helps yours!

More info: **[Conductor: Orchestrate Animation in React Native](https://medium.com/@moses.gunesch/conductor-orchestrate-animation-in-react-native-edd22b59ad17)**
