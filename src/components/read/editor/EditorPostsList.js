import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import { changeActivePost, initializePosts } from '../../../actions/readActions'
import { toggleSpinner } from '../../../actions/spinnerActions'

import { createBlogHeading } from '../../../apollo/blogHeading'
import { queryBlog } from '../../../apollo/blog'

import EditorPostsListRow from './EditorPostsListRow'

class EditorPostsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      pageTitle: '',
      eventType: null
    }
  }

  addHeader (index) {
    this.props.toggleSpinner(true)

    this.props.createBlogHeading({
      variables: {
        BlogId: this.props.blogId,
        loadSequence: index + 1
      }
    })
    .then(results => {
      return this.props.data.refetch()
    })
    .then(response => {
      this.props.initializePosts(response.data.findBlog.pages)
      // this.props.changeActivePost(index)
      this.props.toggleSpinner(false)
    })
  }

  render () {
    return (
      <div style={{position: 'fixed', zIndex: 2}}>
        <div style={{overflow: 'hidden', top: '56px', display: 'inline-block', width: '15vw', height: 'calc(100vh - 60px)'}}>
          <div style={{overscrollBehaviorY: 'contain', overflowY: 'scroll', width: '110%', height: '100%', paddingRight: '10%'}}>
            <ul style={{fontSize: '13px', listStyleType: 'none', padding: '24px 24px 0 24px', width: '15vw'}}>
              <li style={{textAlign: 'center', position: 'relative'}}><hr style={{position: 'absolute', width: '100%', top: '17px', margin: 0}} /><span onClick={() => this.props.changeActivePost('home')} style={{display: 'inline-block', padding: '8px 8px 16px 8px', position: 'relative', backgroundColor: 'white', color: this.props.pages.activePostIndex === 'home' ? '#ed685a' : '#3C3A44', cursor: 'pointer', fontWeight: 'bold'}}>Home</span></li>
              {this.props.pages.pagesArr.map((page, i, arr) => {
                return <EditorPostsListRow key={i} page={page} prevPage={i > 0 && arr[i - 1]} activePostIndex={this.props.pages.activePostIndex} i={i} blogId={this.props.blogId} />
              })}
              <span style={{marginBottom: '16px', display: 'inline-block', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => this.addHeader(this.props.pages.pagesArr.length)}>+ Add New Header</span>
              <li style={{textAlign: 'center', position: 'relative', zIndex: '-1'}}><hr style={{position: 'absolute', width: '100%', top: '9px', margin: 0}} /><span onClick={() => this.props.changeActivePost('fin')} style={{display: 'inline-block', padding: '0 8px 16px 8px', position: 'relative', backgroundColor: 'white', fontWeight: 'bold', color: this.props.pages.activePostIndex === 'fin' ? '#ed685a' : '#3C3A44', cursor: 'pointer'}}>fin</span></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
    },
    initializePosts: (pages) => {
      dispatch(initializePosts(pages))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.blogId
    }
  })
}

export default connect(null, mapDispatchToProps)(compose(
  graphql(queryBlog, options),
  graphql(createBlogHeading, { name: 'createBlogHeading' })
)(EditorPostsList))
