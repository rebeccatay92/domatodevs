import React, { Component } from 'react'
import MapOpeningHoursDropdown from './MapOpeningHoursDropdown'
import moment from 'moment'

// NEEDS PROPS DATESARR, GOOGLEPLACEDATA, DAYINT

class MapPopupOpeningHours extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showAllOpeningHours: false,
      openingHoursStr: ''
    }
  }

  toggleOpeningHoursInfo () {
    this.setState({showAllOpeningHours: !this.state.showAllOpeningHours})
  }

  // needs this.props.googlePlaceData and this.props.datesArr and this.props.dayInt
  findOpeningHoursText (datesArr, googlePlaceData, dayInt) {
    if (datesArr) {
      var dateUnix = datesArr[dayInt - 1]
      var momentObj = moment.unix(dateUnix)
      var dayStr = momentObj.format('dddd')
      if (googlePlaceData.openingHoursText) {
        var textArr = googlePlaceData.openingHoursText.filter(e => {
          return e.indexOf(dayStr) > -1
        })
        var openingHoursStr = textArr[0]
      }
    } else {
      if (googlePlaceData.openingHoursText) {
        textArr = googlePlaceData.openingHoursText.filter(e => {
          return e.indexOf('Monday') > -1
        })
        openingHoursStr = textArr[0]
      }
    }
    this.setState({openingHoursStr: openingHoursStr}, () => {
      console.log('str', openingHoursStr)
    })
  }

  componentDidMount () {
    this.findOpeningHoursText(this.props.datesArr, this.props.googlePlaceData, this.props.dayInt)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.dayInt !== nextProps.dayInt || this.props.googlePlaceData !== nextProps.googlePlaceData) {
      this.findOpeningHoursText(nextProps.datesArr, nextProps.googlePlaceData, nextProps.dayInt)
    }
  }

  render () {
    var place = this.props.googlePlaceData
    return (
      <div>
        <h5 style={{display: 'inline-block', fontSize: '12px', marginRight: '10px'}}>Opening hours: </h5>
        {place.openingHoursText && place.openingHoursText.length &&
          <div style={{display: 'inline-block'}} onClick={() => this.toggleOpeningHoursInfo()}>
            <div style={{display: 'inline-block', cursor: 'pointer', width: '180px'}} className={'ignoreOpeningHoursDropdownArrow'}>
              <span style={{fontSize: '10px'}}>{this.state.openingHoursStr}</span>
              <i className='material-icons' style={{display: 'inline-block', verticalAlign: 'middle', float: 'right'}}>arrow_drop_down</i>
            </div>
            {this.state.showAllOpeningHours &&
              <MapOpeningHoursDropdown textArr={place.openingHoursText} toggleOpeningHoursInfo={() => this.toggleOpeningHoursInfo()} outsideClickIgnoreClass={'ignoreOpeningHoursDropdownArrow'} />
            }
          </div>
        }
        {!place.openingHoursText &&
          <h5 style={{display: 'inline-block', fontSize: '12px'}}>Not Available</h5>
        }
      </div>
    )
  }
}

export default MapPopupOpeningHours
