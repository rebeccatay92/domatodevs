import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import AirportResults from './AirportResults'
import airports from '../../data/airports.json'
import { locationSelectionInputStyle } from '../../Styles/styles'

class AirportSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      search: '',
      selecting: false,
      results: []
    }
  }

  handleChange (e) {
    this.setState({search: e.target.value})
    this.setState({selecting: true})
  }

  customDebounce () {
    var queryStr = this.state.search
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.searchAirports(queryStr)
    }, 500)
  }

  searchAirports (queryStr) {
    queryStr = queryStr.trim()
    if (!queryStr.length || queryStr.length < 3) {
      this.setState({results: []})
      return
    }

    var regex = new RegExp(queryStr.trim(), 'gi')
    // console.log('regex', regex)

    var results = []
    airports.forEach(e => {
      // max 10 results to prevent hanging
      if (results.length > 9) return
      e.matchCount = 0
      if (e.city && e.city.match(regex)) {
        e.matchCount ++
      }
      if (e.name.match(regex)) {
        e.matchCount ++
      }
      if (e.matchCount > 0) {
        results.push(e)
      }
    })
    results.sort(function (a, b) {
      return b.matchCount - a.matchCount
    })
    this.setState({results: results})
  }

  selectLocation (details) {
    // console.log('AIRPORT LOCATION', details)
    this.setState({selecting: false, results: []})
    this.setState({search: details.name})
    this.props.selectLocation(details)
  }

  handleClickOutside () {
    this.setState({selecting: false, results: []})
    if (this.props.edit) return
    if (this.props.currentLocation) {
      this.setState({search: this.props.currentLocation.name})
    } else {
      this.setState({search: ''})
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentLocation !== this.props.currentLocation) {
      this.setState({
        search: nextProps.currentLocation.name
      })
    }
  }

  render () {
    if (this.props.intuitiveInput) {
      return (
        <div>
          <input style={{height: '31px', width: '100%', padding: '8px', fontSize: '13px'}} placeholder={this.props.placeholder} name='search' value={this.state.search} onChange={(e) => this.handleChange(e)} onKeyUp={() => this.customDebounce()} />
          {this.state.selecting &&
            <AirportResults intuitiveInput results={this.state.results} selectLocation={(details) => this.selectLocation(details)} />
          }
        </div>
      )
    } else {
      return (
        <div>
          <input key='airportLocation' id='locationInput' className='left-panel-input' autoComplete='off' name='search' value={this.state.search} onChange={(e) => this.handleChange(e)} onKeyUp={() => this.customDebounce()} style={locationSelectionInputStyle(this.state.marginTop, 'flight')} />

          {this.state.selecting &&
            <AirportResults results={this.state.results} selectLocation={(details) => this.selectLocation(details)} />
          }
        </div>
      )
    }
  }
}

export default onClickOutside(AirportSearch)
