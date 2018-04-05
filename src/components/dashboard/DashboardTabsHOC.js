import React, { Component } from 'react'
import AccountTab from './AccountTab'
import MediaTab from './MediaTab'

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
    } else {
      return <div>Component</div>
    }
  }
}

export default DashboardTabsHOC
