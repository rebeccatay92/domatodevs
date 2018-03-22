import React, { Component } from 'react'
import { connect } from 'react-redux'

import { changeActivePost } from '../../../actions/readActions'

import EditorPostsListRow from './EditorPostsListRow'

class EditorPostsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      pageTitle: '',
      eventType: null
    }
  }

  render () {
    return (
      <div style={{position: 'fixed', top: '56px', display: 'inline-block', width: '15vw', height: 'calc(100vh - 60px)', overflow: 'hidden'}}>
        <div style={{overscrollBehaviorY: 'contain', overflowY: 'scroll', width: '110%', height: '100%', paddingRight: '10%'}}>
          <ul style={{fontSize: '13px', listStyleType: 'none', padding: '24px 24px 0 24px', width: '15vw'}}>
            <li style={{textAlign: 'center', position: 'relative'}}><hr style={{position: 'absolute', width: '100%', top: '17px', margin: 0}} /><span onClick={() => this.props.changeActivePost('home')} style={{display: 'inline-block', padding: '8px 8px 16px 8px', position: 'relative', backgroundColor: 'white', color: this.props.pages.activePostIndex === 'home' ? '#ed685a' : '#3C3A44', cursor: 'pointer', fontWeight: 'bold'}}>Home</span></li>
            {this.props.pages.pagesArr.map((page, i) => {
              return <EditorPostsListRow key={i} page={page} activePostIndex={this.props.pages.activePostIndex} i={i} />
            })}
            <li style={{textAlign: 'center', position: 'relative'}}><hr style={{position: 'absolute', width: '100%', top: '9px', margin: 0}} /><span onClick={() => this.props.changeActivePost('fin')} style={{display: 'inline-block', padding: '0 8px 16px 8px', position: 'relative', backgroundColor: 'white', fontWeight: 'bold', color: this.props.pages.activePostIndex === 'fin' ? '#ed685a' : '#3C3A44', cursor: 'pointer'}}>fin</span></li>
          </ul>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
    }
  }
}

export default connect(null, mapDispatchToProps)(EditorPostsList)
