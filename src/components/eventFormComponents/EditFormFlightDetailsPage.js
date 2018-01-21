import React, { Component } from 'react'
import moment from 'moment'
import EditFormFlightDetailsInstance from './EditFormFlightDetailsInstance'

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
    // this.state = {
    //   instances: []
    // }
  }

  // componentWillReceiveProps (nextProps) {
  //   if (this.props.instances !== nextProps.instances) {
  //     this.setState({instances: nextProps.instances}, () => console.log('INSTANCES', this.state.instances))
  //   }
  // }

  // IF THERE ARE TWO INSTANCES IN 1 PAGE, NEED LAYOVER TIME
  // IF THERE IS 1 PAGE BUT ITS RETURN TRIP, ADD RETURN HEADING
  // ELSE JUST RENDER 1 INSTANCE
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
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <tbody>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[0]} />
              <tr>
                <td>
                  <p style={infoStyle}>Layover</p>
                </td>
              </tr>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[1]} />
            </tbody>
          </table>
        }

        {this.props.instances.length === 2 && this.props.totalInstances === 2 && this.props.isReturn &&
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <tbody>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[0]} />
              <tr>
                <td>
                  <p style={infoStyle}>Returning Flight</p>
                </td>
              </tr>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[1]} />
            </tbody>
          </table>
        }
      </div>
    )
  }
}

export default EditFormFlightDetailsPage
