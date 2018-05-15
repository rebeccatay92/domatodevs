import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Editor, EditorState } from 'draft-js'
import { updateEvent } from '../actions/planner/eventsActions'

import _ from 'lodash'


import { PlannerSideBarStyles as styles } from '../Styles/PlannerSideBarStyles'

class PlannerSideBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      clickedTab: 'none'
    }
  }

  handleEditorChange (editorState, field) {
    this.props.updateEvent(this.props.activeEventId, field, editorState)
  }

  render () {
    // console.log('activeEventId', this.props.activeEventId)
    // console.log('redux events arr', this.props.events.events)
    let reduxEventsArr = this.props.events.events
    let activeEvent = _.find(reduxEventsArr, e => {
      return e.id === this.props.activeEventId
    })

    console.log('activeEvent', activeEvent)
    return (
      <div style={styles.sidebarContainer}>
        {/* TABS */}
        <div style={styles.tabsContainer}>
          <div style={this.state.clickedTab === 'bucket' ? styles.tabClicked : styles.tabUnclicked} onClick={() => this.setState({clickedTab: 'bucket'})}>
            <span style={styles.tabText}>Bucket</span>
          </div>
          {this.props.activeEventId &&
            <div style={this.props.activeEventId ? styles.tabClicked : styles.tabUnclicked} onClick={() => this.setState({clickedTab: 'event'})}>
              <span style={styles.tabText}>Event</span>
            </div>
          }
        </div>
        {/* MAINAREA ITSELF */}
        {this.props.activeEventId &&
          <div style={styles.mainAreaContainer}>
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>schedule</i>
              </div>
              <div style={styles.inputSection}>
                <label style={styles.labelContainer}>
                  <span style={styles.labelText}>Day / Date</span>
                  <select style={styles.dayDropdown}>
                    <option style={{margin: 0}}>Day 1</option>
                  </select>
                </label>
                <label style={styles.labelContainer}>
                  <span style={styles.labelText}>Time</span>
                  <input type='time' style={styles.timeInput} />
                  <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '14px', color: 'rgba(60, 58, 68, 0.7)', margin: '0 5px 0 5px'}}>to</span>
                  <input type='time' style={styles.timeInput} />
                </label>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>event</i>
              </div>
              <div style={styles.inputSection}>
                <label style={styles.labelContainer}>
                  <span style={styles.labelText}>Event Type</span>
                  {/* <input type='text' placeholder={'-'} style={styles.inputField} /> */}
                  <Editor editorState={activeEvent.eventType} onChange={editorState => this.handleEditorChange(editorState, 'eventType')} />
                </label>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>map</i>
              </div>
              <div style={styles.inputSection}>
                <label style={styles.labelContainer}>
                  <span style={styles.labelText}>Location name</span>
                  <input type='text' placeholder='-' style={styles.inputField} />
                </label>
                <label style={styles.labelContainer}>
                  <span style={styles.labelText}>Address</span>
                  <span style={styles.addressText}>Lorong 12 Geylang Singapore 123456 </span>
                </label>
                <label style={styles.labelContainer}>
                  <span style={styles.labelText}>Opening Hours</span>
                  <input type='text' placeholder='-' style={styles.inputField} />
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
                  <span style={styles.labelText}>Cost</span>
                  {/* <input type='number' placeholder={'-'} style={styles.inputField} /> */}
                  <Editor editorState={activeEvent.cost} onChange={editorState => this.handleEditorChange(editorState, 'cost')} />
                </label>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={styles.minHeightSection}>
              <div style={styles.iconSection}>
                <i className='material-icons' style={styles.icon}>credit_card</i>
              </div>
              <div style={styles.inputSection}>
                <label style={styles.labelContainer}>
                  <span style={styles.labelText}>Booking service</span>
                  {/* <input type='text' placeholder={'-'} style={styles.inputField} /> */}
                  <Editor editorState={activeEvent.bookingService} onChange={editorState => this.handleEditorChange(editorState, 'bookingService')} />
                </label>
                <label style={styles.labelContainer}>
                  <span style={styles.labelText}>Confirmation number</span>
                  {/* <input type='text' placeholder={'-'} style={styles.inputField} /> */}
                  <Editor editorState={activeEvent.bookingConfirmation} onChange={editorState => this.handleEditorChange(editorState, 'bookingConfirmation')} />
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
                  <span style={styles.labelText}>Notes</span>
                  {/* <textarea placeholder={'-'} style={styles.notesTextArea} /> */}
                  <Editor editorState={activeEvent.notes} onChange={editorState => this.handleEditorChange(editorState, 'notes')} />
                </label>
              </div>
            </div>
            <hr style={styles.sectionDivider} />
            <div style={{width: '100%', display: 'flex'}}>
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

const mapStateToProps = (state) => {
  return {
    events: state.events,
    activeEventId: state.activeEventId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateEvent: (id, property, value) => {
      return dispatch(updateEvent(id, property, value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlannerSideBar)
