import React, { Component } from 'react'
import { Popup } from 'react-mapbox-gl'

import { PopupTemplateStyles as styles } from '../../../Styles/PopupTemplateStyles'

class PopupTemplate extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let markerType = this.props.markerType
    let locationObj = this.props.locationObj
    let activeEventId = this.props.activeEventId
    let activeEventLocationObj = this.props.activeEventLocationObj

    let popupContentDiv
    let popupActionButtonsDiv

    if (markerType === 'custom' && !locationObj.address) {
      popupContentDiv = (
        <div style={styles.popupContentContainer}>
          <h6>No result found. Please try again.</h6>
        </div>
      )
    } else {
      // custom with address / search / event / bucket
      popupContentDiv = (
        <div style={styles.popupContentContainer}>
          <h6 style={styles.popupContentHeader}>Name</h6>
          <h6 style={styles.popupContentText}>{locationObj.name}</h6>
          <h6 style={styles.popupContentHeader}>Address</h6>
          <h6 style={styles.popupContentText}>{locationObj.address}</h6>
        </div>
      )
    }

    if (markerType === 'custom') {
      if (activeEventId && locationObj.address) {
        if (activeEventLocationObj) {
          popupActionButtonsDiv = (
            <div style={{display: 'flex'}}>
              <div style={styles.popupSingleButtonWidthContainer} onClick={() => this.props.saveCustomLocation()}>
                <span style={styles.popupButtonText}>Save Location</span>
              </div>
              <div style={styles.popupSingleButtonWidthContainer} onClick={() => this.props.saveCustomAddress()}>
                <span style={styles.popupButtonText}>Save Address only</span>
              </div>
            </div>
          )
        } else {
          popupActionButtonsDiv = (
            <div style={{display: 'flex'}}>
              <div style={styles.popupDoubleButtonWidthContainer} onClick={() => this.props.saveCustomLocation()}>
                <span style={styles.popupButtonText}>Save Location</span>
              </div>
            </div>
          )
        } // close if else
      } else if (!activeEventId && locationObj.address) {
        popupActionButtonsDiv = (
          <div style={styles.popupDoubleButtonWidthContainer} onClick={() => this.props.customMarkerAddEvent()}>
            <span style={styles.popupButtonText}>Add to</span>
            <select className={'customMarkerDayDropdown'} onClick={e => e.stopPropagation()}>
              {this.props.daysArr.map((day, i) => {
                return (
                  <option key={i} value={day}>Day {day}</option>
                )
              })}
            </select>
          </div>
        )
      }
    } else if (markerType === 'search') {
      if (activeEventId) {
        if (activeEventLocationObj) {
          // 2 buttons
          popupActionButtonsDiv = (
            <div style={{display: 'flex'}}>
              <div style={styles.popupSingleButtonWidthContainer} onClick={() => this.props.saveSearchLocation()}>
                <span style={styles.popupButtonText}>Save Location</span>
              </div>
              <div style={styles.popupSingleButtonWidthContainer} onClick={() => this.props.saveSearchAddress()}>
                <span style={styles.popupButtonText}>Save Address only</span>
              </div>
            </div>
          )
        } else {
          // 1 button
          popupActionButtonsDiv = (
            <div style={{display: 'flex'}}>
              <div style={styles.popupDoubleButtonWidthContainer} onClick={() => this.props.saveSearchLocation()}>
                <span style={styles.popupButtonText}>Save Location</span>
              </div>
            </div>
          )
        }
      } else if (!activeEventId) {
        // add event button
        popupActionButtonsDiv = (
          <div style={styles.popupDoubleButtonWidthContainer} onClick={() => this.props.searchMarkerAddEvent()}>
            <span style={styles.popupButtonText}>Add to</span>
            <select className={'searchMarkerDayDropdown'} onClick={e => e.stopPropagation()}>
              {this.props.daysArr.map((day, i) => {
                return (
                  <option key={i} value={day}>Day {day}</option>
                )
              })}
            </select>
          </div>
        )
      }
    }

    return (
      <Popup anchor='bottom' coordinates={[this.props.longitude, this.props.latitude]} offset={{'bottom': [0, -40]}} style={{zIndex: 5}}>
        <div style={styles.popupContainer}>
          <i className='material-icons' style={styles.popupCloseIcon} onClick={() => this.props.closePopup()}>clear</i>
          {popupContentDiv}
          {popupActionButtonsDiv}
        </div>
      </Popup>
    )
  }
}

export default PopupTemplate
