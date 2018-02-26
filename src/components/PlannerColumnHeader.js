import React, { Component } from 'react'
import Radium from 'radium'
import { connect } from 'react-redux'
import { changeColumns } from '../actions/plannerColumnActions'
import onClickOutside from 'react-onclickoutside'
import { tableDropdownStyle, tableOptionStyle, tableHeadingStyle } from '../Styles/styles'

const options = ['Price', 'Booking Status', 'Booking Platform', 'Notes', 'Booking Number'].sort()

class PlannerColumnHeader extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dropdown: false
    }
  }

  render () {
    const notesIsVisible = this.props.columns.includes('Notes') && this.props.column !== 'Notes'
    if (!this.state.dropdown) {
      return (
        <th style={tableHeadingStyle}>
          <span onClick={() => {
            if (notesIsVisible) return
            this.setState({dropdown: !this.state.dropdown})
          }} style={{...tableDropdownStyle, ...{opacity: notesIsVisible ? 0.3 : 1, cursor: notesIsVisible ? 'auto' : 'pointer'}}}>{this.props.column}<i className='material-icons' style={{fontSize: '24px', verticalAlign: 'middle'}}>keyboard_arrow_down</i></span>
        </th>
      )
    } else if (this.state.dropdown) {
      return (
        <th style={tableHeadingStyle}>
          <div style={{width: '100%', border: '1px solid rgba(60, 58, 68, 0.2)', position: 'absolute', top: '-1px', backgroundColor: 'white', zIndex: '1', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}}>
            <span className='plannerDropdownOption' key='header' onClick={() => this.setState({dropdown: !this.state.dropdown})} style={{...tableDropdownStyle, ...{width: '100%'}}}>{this.props.column}</span>
            <div style={{width: '100%', margin: '0 auto', paddingBottom: '8px'}}>
              {options.filter(option => option !== this.props.column).map((option, i) => {
                return (
                  <span className='plannerDropdownOption' key={i} style={tableOptionStyle} onClick={() => this.handleClick(option)}>{option}</span>
                )
              })}
            </div>
          </div>
        </th>
      )
    }
  }

  handleClick (option) {
    let newArr = this.props.columns.map((column, i) => {
      if (i === this.props.index || column === 'Notes') return option
      else return column
    })
    this.props.changeColumns(newArr)
    this.setState({
      dropdown: false,
      _radiumStyleState: {}
    })
  }

  handleClickOutside (event) {
    this.setState({
      dropdown: false
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeColumns: (columns) => {
      dispatch(changeColumns(columns))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.plannerColumns
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(Radium(PlannerColumnHeader)))
