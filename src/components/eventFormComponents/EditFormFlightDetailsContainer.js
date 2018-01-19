import React, { Component } from 'react'

class EditFormFlightDetailsContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.flightInstances !== nextProps.flightInstances) {
      console.log('NEXT PROPS', nextProps)
    }
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <h1 style={{textAlign: 'center', fontSize: '18px', color: 'white', position: 'relative'}}>Testing</h1>
      </div>
    )
  }
}

export default EditFormFlightDetailsContainer
