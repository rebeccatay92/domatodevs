import React, { Component } from 'react'

class PlannerLeftBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return <div style={{width: '355px', minHeight: '872px', height: 'calc(100vh - 52px - 51px)', border: '1px solid red'}}>
      Left bar
    </div>
  }
}

export default PlannerLeftBar
