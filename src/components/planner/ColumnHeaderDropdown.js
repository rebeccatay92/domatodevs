import React, { Component } from 'react'
import Radium from 'radium'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'

import { changeColumns } from '../../actions/planner/columnsActions'

const optionsArr = ['Event', 'Location', 'Opening Hours', 'Price', 'Booking Service', 'Confirmation Number', 'Notes'].sort()

class ColumnHeaderDropdown extends Component {
  handleClickOutside (e) {
    if (e.target.className === 'material-icons planner-column-header-arrow') return
    this.props.disableDropdown()
  }

  handleColumnLengthClick (index) {
    const { name, columns, disableDropdown } = this.props
    disableDropdown()
    const initialColumnsArr = columns.slice()
    const startIndex = initialColumnsArr.findIndex(column => column === name)
    const newColumnsArr = initialColumnsArr.map((column, i) => {
      if ((i >= startIndex && i <= index) || (i <= startIndex && i >= index)) return name
      else return column
    })
    this.props.changeColumns(newColumnsArr)
  }

  render () {
    const { name, columns } = this.props
    return (
      <div style={{position: 'absolute', width: '232px', left: 0}}>
        <ul style={{listStyleType: 'none', padding: '0', backgroundColor: '#F5F5F5', border: '1px solid rgba(60, 58, 68, 1)'}}>
          {optionsArr.map((option, i) => {
            return (
              <li key={i} style={{padding: '8px'}}>
                <span>{option}</span>
              </li>
            )
          })}
          <li style={{padding: '0 8px', height: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {new Array(4).fill().map((e, i) => {
              const occupied = columns[i] === name
              return <span key={i} style={{height: '20%', width: '22%', border: '1px solid rgba(60, 58, 68, 1)', display: 'inline-block', backgroundColor: occupied ? 'rgba(60, 58, 68, 1)' : '#F5F5F5'}} onClick={() => this.handleColumnLengthClick(i)} />
            })}
          </li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.columns
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeColumns: (columns) => {
      return dispatch(changeColumns(columns))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(ColumnHeaderDropdown))
