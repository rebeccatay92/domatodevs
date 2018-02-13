import React, { Component } from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import { plannerHeaderRightBarIconContainerStyle, plannerHeaderRightBarIconStyle } from '../Styles/styles'

class PlannerHeaderRightBarIcons extends Component {
  render () {
    var mapUrl = '/map/' + this.props.id
    // console.log('props', this.props)
    return (
      <div style={{position: 'absolute', right: '0', bottom: '0'}}>
        <div key={'view'} style={{...plannerHeaderRightBarIconContainerStyle, ...{backgroundColor: '#ed6a5a'}}}>
          <i className='material-icons' style={plannerHeaderRightBarIconStyle} key={1}>view_list</i>
        </div>
        <div key={'share'} style={{...plannerHeaderRightBarIconContainerStyle, ...{backgroundColor: '#438496'}}}>
          <i className='material-icons' style={plannerHeaderRightBarIconStyle} key={2}>share</i>
        </div>
        <div key={'place'} style={{...plannerHeaderRightBarIconContainerStyle, ...{backgroundColor: '#a8dadc'}}}>
          <Link to={mapUrl}><i className='material-icons' style={plannerHeaderRightBarIconStyle} key={3}>place</i></Link>
        </div>
      </div>
    )
  }
}

export default Radium(PlannerHeaderRightBarIcons)
