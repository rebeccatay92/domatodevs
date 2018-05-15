import React, { Component } from 'react'
import { plannerHeaderContainerStyle, itineraryNameStyle, itineraryDescStyle, plannerHeaderIconsContainerStyle, userIconsContainerStyle, userIconStyle, plannerIconStyle } from '../Styles/styles'
import { Image } from 'react-bootstrap'
import PlannerHeaderRightBarIcons from './PlannerHeaderRightBarIcons'
import PlannerHeaderInfo from './PlannerHeaderInfo'
import PlannerHeaderDates from './PlannerHeaderDates'

class PlannerHeader extends Component {
  render () {
    return (
      <div style={plannerHeaderContainerStyle}>
        <div style={{marginTop: '32px'}}>
          <PlannerHeaderInfo type='name' style={itineraryNameStyle} value={this.props.name} id={this.props.id} />
          <PlannerHeaderDates style={itineraryNameStyle} startDate={this.props.startDate} endDate={this.props.endDate} days={this.props.days} id={this.props.id} />
        </div>
        <PlannerHeaderInfo type='description' style={itineraryDescStyle} value={this.props.description} id={this.props.id} />
        {/* <p style={itineraryDescStyle}>{this.props.description}</p> */}
        {/* <div style={plannerHeaderIconsContainerStyle}>
          <div style={userIconsContainerStyle}>
            <Image src='https://scontent-sin6-2.xx.fbcdn.net/v/t1.0-9/14225571_677406772406900_4575646425482055747_n.jpg?oh=935665cd290c11b5c698a4b91772fe91&oe=5AACAA18' circle style={userIconStyle} />
            <Image src='https://scontent-sin6-2.xx.fbcdn.net/v/t1.0-9/13335715_630881200392791_5149958966299133966_n.jpg?oh=c360bd9cf2063d1daf86cd294e3e231f&oe=5A9CF157' circle style={userIconStyle} />
            <Image src='https://media.licdn.com/media/AAEAAQAAAAAAAAqQAAAAJDhmZmZhOTg2LWE1YmYtNDQ2OC1iMzhiLWU0Y2RiZTBmNGRkMw.jpg' circle style={userIconStyle} />
            <i className='material-icons person-add' style={{...plannerIconStyle, ...{verticalAlign: 'middle', margin: '0 0 0 8px'}}}>add</i>
          </div>
          <PlannerHeaderRightBarIcons id={this.props.id} />
        </div> */}
      </div>
    )
  }
}

export default PlannerHeader
