import React, { Component } from 'react'
import { connect } from 'react-redux'
import { readPageStyle } from '../../Styles/styles'

import PostsList from './PostsList'

class ReadPage extends Component {
  render () {
    return (
      <div style={readPageStyle}>
        <PostsList posts={this.props.posts} />
        <div style={{width: '50vw', height: 'calc(100vh - 60px)', display: 'inline-block', verticalAlign: 'top', backgroundColor: '#F5F5F5'}}></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    posts: state.blogPosts
  }
}

export default connect(mapStateToProps)(ReadPage)
