# react-native-conductor

Orchestrate animations across components in one place

## Giving `Animated` Code a Home of its Own

React Native's `Animated` is great for simple to moderately complex tasks, along with the many solid JSX-based tools out there, and that covers about 80% of real-world dev cases.

I developed this module to help with the other 20% – more complex cases, where I've found `Animated` doesn't scale very well. Component code gets bulky and harder to follow, and the task of coordinating animation between multiple components can be difficult.

I've provided an example, a pull-down menu modeled on Airbnb, to illustrate one such case:

![Pulldown Menu Example](./PulldownMenuExample.gif)

To run this example first clone this repo, `cd examples/PulldownMenuExample`, run `yarn` (or `npm i`) and then `yarn ios` (or `npm run ios`).

In this example `Animated` is coordinated with a scroll value to interpolate the changes in the menu components. The menu is made up of 3 levels of nested components. `Conductor` provides a single place to put all of the `Animated` code, and acts as a provider of animated styles for all of the child components.



## Specific Problem Space Addressed

This module helps when you're using [`Animated`](https://facebook.github.io/react-native/docs/animated.html) in complex components and:
- Animation code is getting too bulky and complex
- Subcomponent animations are hard to coordinate

In my workflow I found this to be about a 20% case, since not many components require intensive, complex animation code. For the 80% cases like simple fades and drifts, keep using your current tools!

> **Real-world example:** *I helped prototype the in-run screen for a sports app, a complex component with a lot of moving parts. Its various interactive elements animated themselves and triggered animated changes to the screen, as well as needing to perform choreographed intro and outro sequences. That's a lot! Animation code quickly became entangled with component logic and harder to 'conduct' at a screen level. State management and coupling increased, and component code was no longer easy to read or update.*

## Solution

When you find yourself in that 20% case, this module makes it easy to move all your `Animated` values, interpolations, tweens and styles into a separate conductor. The conductor 'decorates' your main component with a tag:
```JSX
<Conductor_
  animatedStyles={{
    'playButton': this.playButtonAnimStyles,
  }}
>
  <YourComponent />
</Conductor_>
```

Views in subcomponents are then decorated with another tag that pipes in styles:
```JSX
<AnimatedNode_ animationKey='playButton'>
  <Animated.View .../>
</AnimatedNode_>
```

(more code below)

This provides a few advantages:
- **Readability** – Your components are free of animation code. View components are clearly annotated with tags that indicate "I receive animated styles from above" and can simply declare their default non-animated style. (While it's true that you don't see which styles are piped in, this can be an advantage in that it remains entirely flexible – the responsibility has been transfered to the 'conductor'.)

- **Cross-component coordination** – Timing can be managed in one place. Tweens can affect views in different nested children with no concern for tree structure.

- **Playfulness** – Cutting & pasting a decorator tag from one view or component to another to apply animations is trivial, which eases the process of trying things in different ways as you build.

- **Simple mental model** – Instead of being forced to go digging, you know where to go to adjust animations.

- **Scalability** – The reason I created this module, it keeps complex components from spiraling into a tangled mess.

> Possible disadvantages include:
> - Indirection – components don't explicitly list their animations
> - Intra-component communication required – triggering animations and receiving completion events is no longer local. (The module provides a way to talk to child components – see below.)

I've intentionally made this module as thin and hands-off as possible – it doesn't ask you to change the way you write your `Animated` code – it just gives you an easy way to condense it in one place.

## Keeping Components Portable

A great practice for packaging up a component is to put it in a folder and include an index file, for example:

- `MusicPlayer` folder, perhaps this lives in a 'shared' folder
  - `index.js`
  - `MusicPlayerConductor.js`
  - `MusicPlayerMain.js`

In this example the index file would export the conductor:
```javascript
export default from './MusicPlayerConductor'
```
Then to use your component with a simple name you can just import using the folder name:
```javascript
import MusicPlayer from '../shared/MusicPlayer'
```
The conductor and main component are now easily treated as a single unit, and if you add subcomponents those can be neatly packaged in an additional subfolder.

- `MusicPlayer` folder
  - `index.js`
  - `MusicPlayerConductor.js`
  - `MusicPlayerMain.js`
  - `subcomponents` folder
    - `NowPlayingDisplay.js`
    - `Controls.js`
      - `PlayButton.js`
      - `BackButton.js`
      - `ForawardButton.js`
      - `ProgressBar.js`

#### Nested Conductors

Animation conductors can be nested. This might be helfpul to:
- more neatly package a subcomponent's animation with it (perhaps making it easier to break out later)
- split up a conductor that gets too big

#### Mobx or Redux Containers

If you follow the (good) practice of creating a separate 'smart' container for Mobx or Redux wiring, be sure to keep it **outside** the conductor, because it doesn't directly 'belong to' the component, it belongs to the project. That means if you already have an app-specific container for your component, insert the conductor so it wraps your component directly.

Ideally your 'smart' wrapper would live outside the the component folder, to more clearly reenforce this arrangement.

- `MusicPlayer` folder
- `MusicPlayerContainer.js` app-specific wrapper that imports MusicPlayer by folder

## Conductor example

In the example folder structure above, `MusicPlayerConductor` would be structured like this:

```JSX
import { Conductor_ } from 'react-native-conductor'

export default class MusicPlayerConductor extends React.Component {

  /* this is a vanilla component that you put all your animation code into */
  
  animVal = new Animated.Value(0)
  
  playButtonOpacity = animVal.interpolate(...)

  playButtonAnimStyle = {
    opacity: this.playButtonOpacity,
    ...
  }

  /* ...etc. */

  /*
  Wrap your main presentation component in an Conductor_ decorator tag
  and declare its animatedStyles, which can each be an object or an array.
  */
  render() {
    return (
      <Conductor_
        animatedStyles={{
          'playButton': this.playButtonAnimStyle,
          // ...and all your other styles, each with a unique key
        }}
      >
        <MusicPlayer
          {...this.props}
          onPlayButtonPress={this.handlePlayButtonPress}
        />
      </Conductor_>
    )
  }

  handlePlayButtonPress = () => {
    // Start some tweens!
    // In this conductor, this callback should just be used to run animations.
    // Your main component should handle whatever the onPress actually does.
  }
}

```

Then in any child component, no matter how deeply nested:
```JSX
import { AnimatedNode_ } from 'react-native-conductor'

...

  <AnimatedNode_
    animationKey='playButton'
  >
    <Animated.View ...etc. />
  </AnimatedNode_>
```
This pipes all animated styles you've associated with 'playButton' onto the child node, which must be an Animated-enabled tag – `Animated.View`, `Animated.Image`, `Animated.Text`, or a custom component generated using `createAnimatedComponent()`.

You may use the same key on any number of nodes anywhere in the component tree, all of them will receive the styles for that key.

Best practice note: Your decorated components should still set up their default styles using plain (non-animated) values, not rely on the styles piped in. This makes them more readable, and keeps the component renderable elsewhere. (The `AnimatedNode_` tags won't do anything if no parent conductor exists above them.)

## Triggering Animations from Children

No magic here. Your conductor is a plain React component; use standard techniques. (Pass a callback prop, or use an event emitter.)

## Passing onComplete to Children

Since animation code is now decoupled, it's a little harder to fire an onComplete in a child component. To keep your code more pure, I chose not to add constraints around how `Animated` tweens are written, so this module doesn't have a way to automate this process.

Two ways to deal with this are:

1. Use an event emitter and listen in the child
2. Use the imperitive `fireCallback` hook provided by this module

Child:
```JSX
<AnimatedNode_ animationKey='playButton' onCallback={this.handlePlayButtonCallback}>
```
Conductor:
```javascript
this.conductor.fireCallback('playButton', 'This is on complete')
```
Where `this.conductor` is a ref that you set on your `Conductor_` node, `'playButton'` indicates which child node to send the callback to using a key from its `animatedStyles` list, `'This is on complete'` and any additional arguments are passed to the callback, and at least one child `AnimatedNode_` declares an `onCallback` prop.

It's called `onCallback`, not `onComplete`, since this is just an imperitive function-call mechanism that can be used at any time. For example it could be called on animation-start, or after a timeout.
