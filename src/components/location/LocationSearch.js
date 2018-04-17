import React, { Component } from 'react'
import GooglePlaceResult from './GooglePlaceResult'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'

import { locationSelectionInputStyle, locationDropdownStyle, intuitiveDropdownStyle } from '../../Styles/styles'

const crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
var key = `key=${process.env.REACT_APP_GOOGLE_API_KEY}`
var placeSearch = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'

class LocationSearch extends Component {
  constructor (props) {
    super(props)

    this.state = {
      search: props.currentLocation.name,
      selecting: false,
      results: []
    }
  }

  handleChange (e) {
    this.setState({search: e.target.value})
    this.setState({selecting: true})
  }

  searchPlaces (queryStr) {
    this.setState({results: []})
    var query = `&query=${queryStr}`
    var urlPlaceSearch = crossOriginUrl + placeSearch + key + query
    if (queryStr) {
      fetch(urlPlaceSearch)
      .then(response => {
        return response.json()
      }).then(json => {
        console.log('results', json.results)
        this.setState({results: json.results})
      }).catch(err => {
        console.log('err', err)
      })
    } // close if
  }

  customDebounce () {
    var queryStr = this.state.search
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.searchPlaces(queryStr)
    }, 500)
  }

  selectLocation (details) {
    this.setState({selecting: false, results: []})
    this.setState({search: details.name})
    this.props.selectLocation(details)
  }

  handleClickOutside () {
    this.setState({selecting: false})
    // even if props is empty, currentLocation still exists {}
    if (this.props.currentLocation && this.props.currentLocation.name) {
      this.setState({search: this.props.currentLocation.name})
    } else if (!this.props.intuitiveInput) {
      this.setState({search: ''})
    }
    // this.resizeTextArea()
  }

  // resizeTextArea () {
  //   let locationInput = document.querySelector('#locationInput')
  //   let initialClientHeight = locationInput.clientHeight
  //   locationInput.style.height = 'auto'
  //   // console.log(locationInput.style.height);
  //   // locationInput.style.height = locationInput.scrollHeight + 'px'
  //   // console.log(locationInput.clientHeight, locationInput.scrollHeight);
  //   if (locationInput.clientHeight < locationInput.scrollHeight) {
  //     locationInput.style.height = locationInput.scrollHeight + 'px'
  //     if (locationInput.clientHeight < locationInput.scrollHeight) {
  //       locationInput.style.height = (locationInput.scrollHeight * 2 - locationInput.clientHeight) + 'px'
  //     }
  //   }
  //   if (initialClientHeight < locationInput.clientHeight) {
  //     this.setState({
  //       marginTop: this.state.marginTop - 51
  //     })
  //   } else if (initialClientHeight > locationInput.clientHeight) {
  //     this.setState({
  //       marginTop: this.state.marginTop + 51
  //     })
  //   }
  // }

  // componentDidMount () {
  //   this.resizeTextArea()
  // }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentLocation && nextProps.currentLocation !== this.props.currentLocation) {
      this.setState({search: nextProps.currentLocation.name})
    }
  }

  render () {
    if (this.props.blogEditor) {
      return (
        <div style={{display: 'inline-block', width: this.props.eventType ? '30%' : '100%'}}>
          <input type='text' style={{width: '100%', padding: '8px'}} onKeyUp={() => this.customDebounce()} onChange={(e) => this.handleChange(e)} value={this.state.search} />
          {this.state.selecting && this.state.results.length > 0 &&
          <span className='placeSearchResults' style={{width: '218px', overflowY: 'none', maxHeight: '1000px', position: 'absolute', top: '30px', left: 0, backgroundColor: 'white'}}>
            <span className='placeSearchResults' style={{overflowY: 'auto', display: 'inline-block', maxHeight: '216px'}}>
              {this.state.results.map((indiv, i) => {
                return <GooglePlaceResult intuitiveInput result={indiv} selectLocation={(location) => this.selectLocation(location)} key={i} />
              })}
            </span>
            {this.state.results.length > 0 && <div style={{textAlign: 'left', paddingLeft: '8px'}}>
              <img style={{width: '50%', opacity: '0.5'}} src={`${process.env.PUBLIC_URL}/img/poweredByGoogle.png`} />
            </div>}
          </span>}
        </div>
      )
    } else if (this.props.intuitiveInput || this.props.eventInfo) {
      return (
        <span style={{display: 'block'}}>
          <input autoFocus={this.props.eventInfo} type='text' placeholder={this.props.placeholder} onChange={(e) => this.handleChange(e)} onKeyUp={() => this.customDebounce()} style={{...{width: this.props.transport ? '358.5px' : '218px', height: '31px', fontSize: '13px', padding: '8px'}, ...this.props.eventInfo && {width: '168px', position: 'relative', top: '-5px'}}} value={this.state.search} onFocus={(e) => this.props.inputFocus(e)} onBlur={(e) => this.props.inputBlur(e)} />

          {this.state.selecting && this.state.results.length > 0 &&
            <span className='placeSearchResults' style={{...intuitiveDropdownStyle, ...{width: '218px', overflowY: 'none', maxHeight: '1000px'}}}>
              <span className='placeSearchResults' style={{overflowY: 'auto', display: 'inline-block', maxHeight: '216px'}}>
                {this.state.results.map((indiv, i) => {
                  return <GooglePlaceResult intuitiveInput result={indiv} selectLocation={(location) => this.selectLocation(location)} key={i} />
                })}
              </span>
              {this.state.results.length > 0 && <div style={{textAlign: 'left', paddingLeft: '8px'}}>
                <img style={{width: '50%', opacity: '0.5'}} src={`${process.env.PUBLIC_URL}/img/poweredByGoogle.png`} />
              </div>}
            </span>
          }
        </span>
      )
    } else {
      const locationTitle = {
        'Activity': 'Location',
        'Food': 'Eatery',
        'Lodging': 'Lodging',
        'LandTransport': 'Departure Location',
        'LandTransportEnd': 'Arrival Location'
      }
      return (
        <div style={{position: 'relative', display: 'inline-block'}}>
          <p style={{position: 'relative', fontWeight: '300', fontSize: '16px', margin: '0 0 16px 0'}}>{locationTitle[this.props.eventType]}</p>
          <input key='location' id='locationInput' className='left-panel-input' rows='1' autoComplete='off' name='search' value={this.state.search} placeholder={this.props.placeholder} onChange={(e) => this.handleChange(e)} onKeyUp={() => this.customDebounce()} style={locationSelectionInputStyle(0)} />
          {/* <i className='material-icons' onClick={() => this.props.toggleMap()} style={{fontSize: '50px', cursor: 'pointer'}}>place</i> */}

          {this.state.selecting && this.state.results.length > 0 &&
            <div style={{...locationDropdownStyle, ...{overflowY: 'none', maxHeight: '1000px'}}}>
              <div className='placeSearchResults' style={{overflowY: 'auto', display: 'inline-block', maxHeight: '216px', width: '100%'}}>
                {this.state.results.map((indiv, i) => {
                  return <GooglePlaceResult result={indiv} selectLocation={(location) => this.selectLocation(location)} key={i} />
                })}
              </div>
              {this.state.results.length > 0 && <div style={{textAlign: 'left', paddingLeft: '8px'}}>
                <img style={{width: '30%', opacity: '0.5'}} src={`${process.env.PUBLIC_URL}/img/poweredByGoogle.png`} />
              </div>}
            </div>
          }
        </div>
      )
    }
  }
}

export default onClickOutside(Radium(LocationSearch))
