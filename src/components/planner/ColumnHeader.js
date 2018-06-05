import React, { Component } from 'react'
import Radium from 'radium'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'

import ColumnHeaderDropdown from './ColumnHeaderDropdown'

import { changeColumnSort } from '../../actions/planner/sortActions'
import { sortEvents } from '../../actions/planner/eventsActions'

const eventPropertyNames = {
  Event: 'eventType',
  Price: 'cost',
  Notes: 'notes',
  'Booking Service': 'bookingService',
  'Confirmation Number': 'bookingConfirmation',
  Location: 'location'
}

class ColumnHeader extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showDropdown: false
    }
  }

  disableDropdown () {
    this.setState({showDropdown: false})
  }

  handleSort (type) {
    const { name } = this.props
    this.disableDropdown()
    this.props.changeColumnSort(eventPropertyNames[name], type)
    this.props.sortEvents(eventPropertyNames[name], type)
  }

  handleHeaderClick (e) {
    const { name } = this.props
    if (e.target.className === `material-icons planner-column-header ${name}`) return
    this.setState({showDropdown: !this.state.showDropdown})
  }

  render () {
    const { name, colSpan, startingColumn, endingColumn, sortOptions } = this.props
    return (
      <td className={`planner-column-header planner-column-header ${name}`} colSpan={colSpan} style={{width: `calc(232px * ${colSpan})`, padding: '0 8px', height: '40px', position: 'relative', cursor: 'default'}} onClick={(e) => this.handleHeaderClick(e)}>
        {name}
        {(eventPropertyNames[name] !== sortOptions.column || sortOptions.type === 'unsorted') && <i onClick={() => this.handleSort('descending')} className={`material-icons planner-column-header ${name}`} style={{verticalAlign: 'top', fontSize: '20px', cursor: 'pointer'}}>unfold_more</i>}
        {eventPropertyNames[name] === sortOptions.column && sortOptions.type === 'descending' && <i onClick={() => this.handleSort('ascending')} className={`material-icons planner-column-header ${name}`} style={{verticalAlign: 'top', fontSize: '20px', cursor: 'pointer'}}>keyboard_arrow_down</i>}
        {eventPropertyNames[name] === sortOptions.column && sortOptions.type === 'ascending' && <i onClick={() => this.handleSort('unsorted')} className={`material-icons planner-column-header ${name}`} style={{verticalAlign: 'top', fontSize: '20px', cursor: 'pointer'}}>keyboard_arrow_up</i>}
        {this.state.showDropdown && <ColumnHeaderDropdown disableDropdown={() => this.disableDropdown()} name={name} startingColumn={startingColumn} endingColumn={endingColumn} />}
      </td>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sortOptions: state.sortOptions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeColumnSort: (column, sortType) => {
      return dispatch(changeColumnSort(column, sortType))
    },
    sortEvents: (column, sortType) => {
      return dispatch(sortEvents(column, sortType))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnHeader)
