import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import onClickOutside from 'react-onclickoutside'

import { updateItineraryDetails, queryItinerary } from '../apollo/itinerary'

class PlannerHeaderInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editing: false,
      value: this.props.value,
      newValue: this.props.value
    }
  }

  handleClickOutside (event) {
    if (event.target.localName === 'input') return
    this.setState({
      editing: false,
      newValue: this.state.value
    })
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleEdit()
    }
  }

  handleEdit () {
    this.setState({
      editing: false
    })

    if (this.state.newValue === this.state.value) return

    this.setState({
      value: this.state.newValue
    })

    this.props.mutate({
      variables: {
        id: this.props.id,
        [this.props.type]: this.state.newValue
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.id }
      }]
    })
  }

  render () {
    return (
      this.state.editing ? <input onKeyDown={(e) => this.handleKeyDown(e)} autoFocus style={{...this.props.style, ...{padding: '8px', marginBottom: '0px', color: 'black', width: this.props.type === 'description' ? '100%' : '77%'}}} value={this.state.newValue} onChange={(e) => this.setState({newValue: e.target.value})} /> : <span title={this.state.value} style={{...this.props.style, ...{display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', padding: '8px'}}} className='itineraryInfo' onClick={() => this.setState({editing: true})}>{this.state.value}</span>
    )
  }
}

export default graphql(updateItineraryDetails)(onClickOutside(PlannerHeaderInfo))
