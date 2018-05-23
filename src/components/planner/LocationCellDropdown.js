import React, { Component } from 'react'
import { ClipLoader } from 'react-spinners'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'

const inTableStyle = {position: 'absolute', top: '83px', left: '-1px', background: 'white', width: '100%', border: '1px solid #ed685a', zIndex: '2', minHeight: '35px', boxSizing: 'content-box'}
const inRightBarStyle = {position: 'absolute', top: '20px', left: '0', background: 'white', width: '100%', border: '1px solid black', zIndex: '2', minHeight: '35px'}

class LocationCellDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleClickOutside () {
    this.props.handleClickOutside()
  }

  render () {
    return (
      <div style={this.props.openedIn === 'table' ? inTableStyle : inRightBarStyle}>
        <ClipLoader color={'#000000'} size={28} loading={this.props.showSpinner} />
        {!this.props.showSpinner && this.props.predictions.length === 0 &&
          <h6 style={{background: 'white', margin: 0, cursor: 'pointer', minHeight: '35px', fontFamily: 'Roboto, san-serif', fontWeight: '300', fontSize: '16px', lineHeight: '24px', paddingLeft: '8px'}}>No results found</h6>
        }
        {!this.props.showSpinner && this.props.predictions.map((prediction, i) => {
          return <h6 key={i} style={{background: 'white', margin: 0, cursor: 'pointer', minHeight: '35px', fontFamily: 'Roboto, san-serif', fontWeight: '300', fontSize: '16px', lineHeight: '25px', padding: '5px 0 5px 8px', ':hover': {background: 'rgb(245, 245, 245)'}}} onClick={() => this.props.selectLocation(prediction)}>{prediction.structured_formatting.main_text}{prediction.structured_formatting.secondary_text}</h6>
        })}
        {!this.props.showSpinner &&
          <div style={{width: '50%', height: '30px', padding: '8px'}}>
            <img src='/img/poweredByGoogle.png' width='100%' height='100%' />
          </div>
        }
      </div>
    )
  }
}

export default onClickOutside(Radium(LocationCellDropdown))
