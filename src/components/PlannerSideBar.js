import React, { Component } from 'react'

import { PlannerSideBarStyles as styles } from '../Styles/PlannerSideBarStyles'

class PlannerSideBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      clickedTab: 'event'
    }
  }
  render () {
    return (
      <div style={styles.sidebarContainer}>
        {/* TABS */}
        <div style={styles.tabsContainer}>
          <div style={this.state.clickedTab === 'bucket' ? styles.tabClicked : styles.tabUnclicked} onClick={() => this.setState({clickedTab: 'bucket'})}>
            <span style={styles.tabText}>Bucket</span>
          </div>
          <div style={this.state.clickedTab === 'event' ? styles.tabClicked : styles.tabUnclicked} onClick={() => this.setState({clickedTab: 'event'})}>
            <span style={styles.tabText}>Event</span>
          </div>
        </div>
        {/* MAINAREA ITSELF */}
        {this.state.clickedTab === 'event' &&
          <div style={styles.mainAreaContainer}>
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>schedule</i>
              </div>
              <div style={styles.inputSection}>
                date, startTime, endTime
                <span style={styles.labelText}>Date and Time</span>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>event</i>
              </div>
              <div style={styles.inputSection}>
                <label style={styles.labelContainer}>
                  <input type='text' placeholder={'-'} style={styles.inputField} />
                  <span style={styles.labelText}>Event Type</span>
                </label>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={{width: '100%', height: 'calc(64px * 3)', display: 'flex'}}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>map</i>
              </div>
              <div style={styles.inputSection}>
                <label style={styles.labelContainer}>
                  <input type='text' placeholder='-' style={styles.inputField} />
                  <span style={styles.labelText}>Location</span>
                </label>
                <label style={styles.labelContainer}>
                  <textarea placeholder='-' style={styles.inputField} />
                  <span style={styles.labelText}>Address</span>
                </label>
                <label style={styles.labelContainer}>
                  <input type='text' placeholder='-' style={styles.inputField} />
                  <span style={styles.labelText}>Opening Hours</span>
                </label>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>money</i>
              </div>
              <div style={styles.inputSection}>
                <label style={styles.labelContainer}>
                  <input type='number' placeholder={'-'} style={styles.inputField} />
                  <span style={styles.labelText}>Cost</span>
                </label>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={{width: '100%', height: 'calc(64px * 2)', display: 'flex'}}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>credit_card</i>
              </div>
              <div style={styles.inputSection}>
                <label style={styles.labelContainer}>
                  <input type='text' placeholder={'-'} style={styles.inputField} />
                  <span style={styles.labelText}>Booking service</span>
                </label>
                <label style={styles.labelContainer}>
                  <input type='text' placeholder={'-'} style={styles.inputField} />
                  <span style={styles.labelText}>Confirmation number</span>
                </label>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>edit</i>
              </div>
              <div style={styles.inputSection}>
                <label style={styles.labelContainer}>
                  <textarea placeholder={'-'} style={styles.inputField} />
                  <span style={styles.labelText}>Notes</span>
                </label>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={{width: '100%', height: '235px', display: 'flex'}}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>attach_file</i>
              </div>
              <div style={styles.inputSection}>
                <span style={styles.attachFileLabelText}>Attach a file</span>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default PlannerSideBar
