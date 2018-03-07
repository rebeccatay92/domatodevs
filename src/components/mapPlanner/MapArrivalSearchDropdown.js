import React, { Component } from 'react'
import MapArrivalSearchResult from './MapArrivalSearchResult'
import onClickOutside from 'react-onclickoutside'

class MapArrivalSearchDropdown extends Component {
  handleClickOutside () {
    this.props.closeSearchDropdown()
  }

  render () {
    return (
      <div>
        {this.props.arrivalSearchResults.map((result, i) => {
          return <MapArrivalSearchResult key={i} result={result} selectArrivalLocation={(place) => this.props.selectArrivalLocation(place)} />
        })}
      </div>
    )
  }
}

export default onClickOutside(MapArrivalSearchDropdown)
