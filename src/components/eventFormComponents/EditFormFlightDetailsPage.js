import React, { Component } from 'react'
import EditFormFlightDetailsInstance from './EditFormFlightDetailsInstance'
import { timelineStyle } from '../../Styles/styles'

const pStyle = {
  margin: '0'
}
const infoStyle = {...pStyle,
  ...{
    fontSize: '14px'
  }
}

class EditFormFlightDetailsPage extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div style={{textAlign: 'center', fontSize: '18px', color: 'white', position: 'relative'}}>

        {this.props.instances.length === 1 &&
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <tbody>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[0]} />
            </tbody>
          </table>
        }

        {this.props.instances.length === 2 && ((this.props.totalInstances === 2 && !this.props.isReturn) || (this.props.totalInstances === 4)) &&
          <table style={{width: '100%', tableLayout: 'fixed', position: 'relative'}}>
            <tbody>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[0]} />
              <tr>
                <td style={{width: '100%', height: '90px'}}>
                  <p style={infoStyle}>layover xxx mins</p>
                </td>
              </tr>
              {/* <tr>
                <td style={{width: '100%', height: '90px'}}>
                  {((this.props.totalInstances === 4 && this.props.isReturn) || (this.props.totalInstances === 2 && !this.props.isReturn)) && <div style={{...timelineStyle, ...{height: '55%', backgroundColor: 'white', opacity: '0.5', top: '-22%'}}} />}

                  {this.props.totalInstances === 2 && this.props.isReturn ? <p>Return Flight</p> : <p style={infoStyle}>layover</p>}

                  {((this.props.totalInstances === 4 && this.props.isReturn) || (this.props.totalInstances === 2 && !this.props.isReturn)) && <div style={{...timelineStyle, ...{height: '55%', top: '67%', backgroundColor: 'white', opacity: '0.5'}}} />}

                </td>
              </tr> */}
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[1]} />
            </tbody>
          </table>
        }

        {this.props.instances.length === 2 && this.props.totalInstances === 2 && this.props.isReturn &&
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <tbody>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[0]} />
              <tr>
                <td style={{width: '100%', height: '90px'}}>
                  <p style={infoStyle}>Return Flight</p>
                </td>
              </tr>
              {/* <tr>
                <td style={{width: '100%', height: '90px'}}>
                  {((this.props.totalInstances === 4 && this.props.isReturn) || (this.props.totalInstances === 2 && !this.props.isReturn)) && <div style={{...timelineStyle, ...{height: '55%', backgroundColor: 'white', opacity: '0.5', top: '-22%'}}} />}

                  {this.props.totalInstances === 2 && this.props.isReturn ? <p>Return Flight</p> : <p style={infoStyle}>layover</p>}

                  {((this.props.totalInstances === 4 && this.props.isReturn) || (this.props.totalInstances === 2 && !this.props.isReturn)) && <div style={{...timelineStyle, ...{height: '55%', top: '67%', backgroundColor: 'white', opacity: '0.5'}}} />}

                </td>
              </tr> */}
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[1]} />
            </tbody>
          </table>
        }
      </div>
    )
  }
}

export default EditFormFlightDetailsPage
