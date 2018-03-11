import React, { Component } from 'react'
import { connect } from 'react-redux'

import { changeActivePost } from '../../actions/readActions'

class PostsList extends Component {
  render () {
    return (
      <div style={{display: 'inline-block', width: '15vw', height: 'calc(100vh - 60px)', overflow: 'hidden'}}>
        <div style={{overflowY: 'scroll', width: '110%', height: '100%', paddingRight: '10%'}}>
          <ul style={{fontSize: '13px', listStyleType: 'none', padding: '24px 24px 0 24px', width: '15vw'}}>
            <li style={{textAlign: 'center', position: 'relative'}}><hr style={{position: 'absolute', width: '100%', top: '17px', margin: 0}} /><span onClick={() => this.props.changeActivePost('home')} style={{display: 'inline-block', padding: '8px', position: 'relative', backgroundColor: 'white', color: this.props.pages.activePostIndex === 'home' ? '#ed685a' : '#3C3A44', cursor: 'pointer', fontWeight: 'bold'}}>Home</span></li>
            {this.props.pages.pagesArr.map((page, i) => {
              if (page.type === 'Heading') {
                return (
                  <li key={i}><span style={{display: 'inline-block', fontWeight: 'bold', padding: '8px 0', cursor: 'default'}}>{page.title}</span></li>
                )
              } else if (page.contentOnly) {
                return (
                  <li key={i}><span onClick={() => this.props.changeActivePost(i)} style={{display: 'inline-block', padding: '8px 0 8px 8px', color: this.props.pages.activePostIndex === i ? '#ed685a' : '#3C3A44', cursor: 'pointer'}}>{page.title}</span></li>
                )
              } else if (!page.contentOnly) {
                return (
                  <li key={i}><span onClick={() => this.props.changeActivePost(i)} style={{display: 'inline-block', padding: '8px 0 8px 8px', color: this.props.pages.activePostIndex === i ? '#ed685a' : '#3C3A44', cursor: 'pointer'}}>{page.location} - {page.description}</span></li>
                )
              }
            })}
            <li style={{textAlign: 'center', position: 'relative'}}><hr style={{position: 'absolute', width: '100%', top: '17px', margin: 0}} /><span onClick={() => this.props.changeActivePost('fin')} style={{display: 'inline-block', padding: '8px', position: 'relative', backgroundColor: 'white', fontWeight: 'bold', color: this.props.pages.activePostIndex === 'fin' ? '#ed685a' : '#3C3A44', cursor: 'pointer'}}>fin</span></li>
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

export default connect(null, mapDispatchToProps)(PostsList)
