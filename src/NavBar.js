import React, { Component, PropTypes } from 'react'
import { Navigator } from 'react-native'
import { isSameUrl, findRoute } from './routing'
import routeMapper from './route-mapper'

const styleType = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.number,
  PropTypes.array
])

class NavBar extends Component {
  static propTypes = {
    // Routes in this navigation bar
    // { '/path/to/route/:param': Component } map
    routes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,

    // The current route URL
    url: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        from: PropTypes.oneOf(['left', 'right', 'none'])
      })
    ]).isRequired,

    // Show a NavigationBar or not
    showBar: PropTypes.bool,

    style: styleType,

    barStyle: styleType,
    barNavigationStyles: PropTypes.any,

    sceneStyle: styleType,
    sceneConfigLeft: PropTypes.object,
    sceneConfigRight: PropTypes.object
  }

  static defaultProps = {
    showBar: true,
    sceneConfigLeft: Navigator.SceneConfigs.HorizontalSwipeJumpFromLeft,
    // https://github.com/facebook/react-native/issues/11751
    sceneConfigRight: Navigator.SceneConfigs.HorizontalSwipeJump
  }

  constructor (props) {
    super(props)
    this._navigator = null
    this.state = {}

    const { url, routes } = props
    if (!url) return

    // If we have a valid url in props, set the initialRoute
    const route = findRoute(url, routes)
    if (!route) return console.warn(`Route not found "${url}"`)

    this.state = { initialRoute: route, initialRouteStack: [route] }
  }

  componentWillReceiveProps (nextProps) {
    const { url } = this.props
    const { url: nextUrl, routes: nextRoutes } = nextProps

    const route = findRoute(nextUrl, nextRoutes)
    if (!route) return console.warn(`Route not found "${nextUrl}"`)

    if (!this.state.initialRoute) {
      return this.setState({ initialRoute: route, initialRouteStack: [route] })
    }

    const navigator = this._navigator
    if (!navigator || isSameUrl(nextUrl, url)) return

    if (route.from === 'none') {
      return navigator.replace(route)
    }

    navigator.push(route)
  }

  _onRouteDidFocus = (route) => {
    const navigator = this._navigator
    if (!navigator) return

    // Clean up old routes after transition
    const currentRoutes = navigator.getCurrentRoutes()
    const routeIndex = currentRoutes.findIndex(({ url }) => isSameUrl(url, this.props.url))
    if (routeIndex > 0) navigator.immediatelyResetRouteStack(currentRoutes.slice(routeIndex))
  }

  render () {
    const {
      showBar,
      barStyle,
      barNavigationStyles,
      sceneStyle,
      sceneConfigLeft,
      sceneConfigRight
    } = this.props

    const { initialRoute, initialRouteStack } = this.state

    if (!initialRoute) return null

    return (
      <Navigator
        ref={(r) => { this._navigator = r }}
        initialRoute={initialRoute}
        initialRouteStack={initialRouteStack}
        renderScene={(route) => {
          const Component = route.component
          return <Component location={route.location} params={route.params} />
        }}
        configureScene={(route, routeStack) => ({
          ...(route.from === 'left' ? sceneConfigLeft : sceneConfigRight),
          gestures: {}
        })}
        sceneStyle={sceneStyle}
        navigationBar={showBar && (
          <Navigator.NavigationBar
            routeMapper={routeMapper}
            style={barStyle}
            navigationStyles={barNavigationStyles} />
        )}
        onDidFocus={this._onRouteDidFocus}
      />
    )
  }
}

export default NavBar
