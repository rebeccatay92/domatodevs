import React, { Component } from 'react'
import MapLocationSearchResult from './MapLocationSearchResult'
import onClickOutside from 'react-onclickoutside'

class MapLocationSearchDropdown extends Component {
  handleClickOutside () {
    this.props.closeSearchDropdown()
  }

  render () {
    return (
      <div>
        {this.props.searchResults.map((result, i) => {
          return <MapLocationSearchResult key={i} result={result} selectLocation={(place) => this.props.selectLocation(place)} />
        })}
      </div>
    )
  }
}

export default onClickOutside(MapLocationSearchDropdown)
