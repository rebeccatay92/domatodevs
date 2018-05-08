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
                dates
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>event</i>
              </div>
              Event type
            </div>
            <hr style={styles.sectionDivider} />
            <div style={{width: '100%', height: 'calc(64px * 3)', display: 'flex'}}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>map</i>
              </div>
              location. name + address + opening
            </div>
            <hr style={styles.sectionDivider} />
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>attach_money</i>
              </div>
              cost
            </div>
            <hr style={styles.sectionDivider} />
            <div style={{width: '100%', height: 'calc(64px * 2)', display: 'flex'}}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>credit_card</i>
              </div>
              booking
            </div>
            <hr style={styles.sectionDivider} />
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>edit</i>
              </div>
              notes
            </div>
            <hr style={styles.sectionDivider} />
            <div style={{width: '100%', height: '235px', display: 'flex'}}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>attach_file</i>
              </div>
              attachments
            </div>
          </div>
        }
      </div>
    )
  }
}

export default PlannerSideBar
