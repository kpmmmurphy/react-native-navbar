# react-native-navbar

A stupidly simple "stateless", route based, navigation bar component built on top of React Native's Navigator, for use with Redux.

## Getting started

`npm install @tableflip/react-native-navbar`

### Example

```js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavBar from '@tableflip/react-native-navbar'
import { Home, Post } from './scenes'

const Routes = {
  '/': Home,
  '/post/:id': Post
}

class App extends Component {
  static defaultProps = { url: '/' }

  render () {
    return <NavBar routes={Routes} url={this.props.url} />
  }
}

export default connect(({ url }) => ({ url }))(App)
```

1. Store the current URL in your Redux store
2. Create a redux action for changing the URL
3. Your scenes change the URL by dispatching your action

## Conventions

* URL params are passed to your scenes in a **`params`** prop
* Your scenes specify the bar `LeftButton`, `Title` and `RightButton` components in a static property called **`navBar`**

### URL params

Currently route URLs only support params defined as `:paramName` within a URL. Wildcards are currently not supported. When navigating to a URL, the params are extracted and passed to the scene in a `params` prop.

For example a route like `/post/:id` would result in an object like `{ id: 'some id' }` being passed to your scene in a `params` prop.

These params are also passed to any `navBar` components (see below).

### `static navBar = { LeftButton, Title, RightButton }`

Your scenes define what **components** should appear in the navigation bar when they are shown. All three properties are optional.

Your `navBar` components are passed any URL `params` in props.

**Note:** be careful when wrapping your component in a container, it can hide the `navBar` property from the NavBar component.

## Props

### `routes`

An object describing the routes available to the `NavBar`. Keys should be URLs and values should be React Components.

### `url`

The URL that should currently be displayed. This can be a string, but will more commonly be an object, e.g.

```js
// Slide in from the right
{ url: '/post/123', from: 'right' }
// Slide in from the left (looks like we're navigating "backwards")
{ url: '/', from: 'left' }
// Do not transition, display immediately
{ url: '/', from: 'none' }
```

### `showBar`

Display a `Navigator.NavigationBar` at the top of the screen. This is `true` by default but can be disabled if your scenes need to take up the whole screen.

### `style`, `barStyle`, `sceneStyle`

Styles passed to the container, bar and scene respectively.

### `sceneConfigLeft` and `sceneConfigRight`

Configuration for scene transitions. Defaults to `Navigator.SceneConfigs.HorizontalSwipeJumpFromLeft` and `Navigator.SceneConfigs.HorizontalSwipeJumpFromRight`. [Scene configuration options](https://facebook.github.io/react-native/docs/navigator.html#configurescene).
