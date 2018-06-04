import React, { Component } from 'react'
import Radium from 'radium'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'

import { changeColumns } from '../../actions/planner/columnsActions'

const optionsArr = ['Event', 'Location', 'Price', 'Booking Service', 'Confirmation Number', 'Notes'].sort()

const originalColumnsState = ['Event', 'Location', 'Price', 'Notes']

class ColumnHeaderDropdown extends Component {
  handleClickOutside (e) {
    if (e.target.className === `planner-column-header planner-column-header ${this.props.name}` || e.target.className === `material-icons planner-column-header ${this.props.name}`) return
    this.props.disableDropdown()
  }

  handleColumnLengthClick (index) {
    const { name, columns, disableDropdown, startingColumn, endingColumn } = this.props
    disableDropdown()
    const initialColumnsArr = columns.slice()
    const occupied = index >= startingColumn && index <= endingColumn
    const newColumnsArr = initialColumnsArr.map((column, i) => {
      // if ((i >= startIndex && i <= index) || (i <= startIndex && i >= index)) return name
      // else return column
      if (index > startingColumn) {
        if (index > endingColumn) {
          if (i >= startingColumn && i <= index) return name
          else return column
        } else if (index <= endingColumn) {
          if (i >= startingColumn && i < index) return name
          else if (i >= index && i <= endingColumn) {
            return originalColumnsState.filter(ogColumn => {
              let notInCurrentColumns = true
              columns.forEach(column => {
                if (ogColumn === column) notInCurrentColumns = false
              })
              return notInCurrentColumns
            })[0]
          } else return column
        }
      } else if (index < startingColumn) {
        if (i >= index && i <= endingColumn) return name
        else return column
      } else if (index === startingColumn) {
        if (startingColumn === endingColumn) return column
        else if (i === index) {
          return originalColumnsState.filter(ogColumn => {
            let notInCurrentColumns = true
            columns.forEach(column => {
              if (ogColumn === column) notInCurrentColumns = false
            })
            return notInCurrentColumns
          })[0]
        } else return column
      }
    })
    this.props.changeColumns(newColumnsArr)
  }

  handleOptionClick (option) {
    const { startingColumn, endingColumn, columns } = this.props
    const newColumnsArr = columns.map((column, i) => {
      if (i >= startingColumn && i <= endingColumn) return option
      else return column
    })
    this.props.changeColumns(newColumnsArr)
    this.props.disableDropdown()
  }

  render () {
    const { startingColumn, endingColumn } = this.props
    return (
      <div style={{position: 'absolute', width: '232px', left: 0, zIndex: 1}}>
        <ul style={{listStyleType: 'none', padding: '0', backgroundColor: '#F5F5F5', border: '1px solid rgba(60, 58, 68, 1)'}}>
          {optionsArr.map((option, i) => {
            return (
              <li key={i} style={{padding: '8px'}} className='column-header-dropdown-option' onClick={() => this.handleOptionClick(option)}>
                <span>{option}</span>
              </li>
            )
          })}
          <li style={{padding: '0 8px', height: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {new Array(4).fill().map((e, i) => {
              const occupied = i >= startingColumn && i <= endingColumn
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
