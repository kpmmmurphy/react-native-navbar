import React from 'react'

export default {
  LeftButton: (route, navigator, index, navState) => {
    const Component = route.component
    if (!Component.navBar) return null
    const LeftButton = Component.navBar.LeftButton
    if (!LeftButton) return null
    return <LeftButton params={route.params} />
  },

  Title: (route, navigator, index, navState) => {
    const Component = route.component
    if (!Component.navBar) return null
    const Title = Component.navBar.Title
    return Title && <Title params={route.params} />
  },

  RightButton: (route, navigator, index, navState) => {
    const Component = route.component
    if (!Component.navBar) return null
    const RightButton = Component.navBar.RightButton
    if (!RightButton) return null
    return <RightButton params={route.params} />
  }
}
