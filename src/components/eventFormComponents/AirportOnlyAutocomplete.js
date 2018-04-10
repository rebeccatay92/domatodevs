import React, { Component } from 'react'
import airports from '../../data/airports.json'
import { locationDropdownStyle } from '../../Styles/styles'
class AirportOnlyAutocomplete extends Component {
  constructor (props) {
    super(props)
    this.state = {
      search: '',
      selecting: false,
      results: [],
      currentLocation: {}
    }
  }
  componentDidMount () {
    // console.log('iata', this.props)
    var currentLocation = airports.find(row => {
      return row.iata === this.props.iata
    })
    // console.log('currentLocation', currentLocation)
    this.setState({currentLocation: currentLocation, search: currentLocation.name}, () => console.log('state', this.state))
  }

  // componentWillReceiveProps (nextProps) {
  //   if (this.props.iata !== nextProps.iata) {
  //     console.log('iata changed', nextProps.iata)
  //     var currentLocation = airports.find(row => {
  //       return row.iata === this.props.iata
  //     })
  //     this.setState({currentLocation: currentLocation, search: currentLocation.name}, () => console.log('state', this.state))
  //   }
  // }

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
      // if (e.city && e.city.match(regex)) {
      //   e.matchCount ++
      // }
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

  selectAirport (result) {
    this.setState({selecting: false, currentLocation: result, search: result.name})
    this.props.handleAirportChange(result)
  }

  render () {
    return (
      <div style={{locationDropdownStyle}}>
        <input type='text' name='search' value={this.state.search} onChange={(e) => this.handleChange(e)} onKeyUp={() => this.customDebounce()} />
        {this.state.selecting &&
          <div>
            {this.state.results.map((result, i) => {
              return (
                <h5 key={'airportonly' + i} onClick={() => this.selectAirport(result)}>{result.name}, {result.city}, {result.iata}</h5>
              )
            })}
          </div>
        }
      </div>
    )
  }
}

export default AirportOnlyAutocomplete
