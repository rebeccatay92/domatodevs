import React, { Component } from 'react'
import AccountTab from './AccountTab'
import MediaTab from './MediaTab'
import BlogsTab from './BlogsTab'
import ItinerariesTab from './ItinerariesTab'

class DashboardTabsHOC extends Component {
  // constructor (props) {
  //   super(props)
  // }
  render () {
    if (this.props.focusedTab === 'account') {
      return (
        <AccountTab lock={this.props.lock} />
      )
    } else if (this.props.focusedTab === 'media') {
      return (
        <MediaTab />
      )
    } else if (this.props.focusedTab === 'blogs') {
      return <BlogsTab />
    } else if (this.props.focusedTab === 'itineraries') {
      return <ItinerariesTab />
    } else {
      return <div>Component</div>
    }
  }
}

export default DashboardTabsHOC
