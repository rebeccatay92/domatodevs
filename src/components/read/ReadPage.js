import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { readPageStyle } from '../../Styles/styles'

import PostsList from './PostsList'
import PostTextContent from './PostTextContent'

import { initializePosts } from '../../actions/readActions'
import { queryBlog } from '../../apollo/blog'

class ReadPage extends Component {
  render () {
    return (
      <div style={readPageStyle}>
        <PostsList pages={this.props.pages} />
        <div style={{width: '50vw', height: 'calc(100vh - 60px)', display: 'inline-block', verticalAlign: 'top', backgroundColor: '#F5F5F5'}}></div>
        <PostTextContent pages={this.props.pages} />
      </div>
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findBlog !== nextProps.data.findBlog) {
      const allPages = nextProps.data.findBlog.pages
      console.log(allPages)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    pages: state.blogPosts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializePosts: (pages) => {
      dispatch(initializePosts(pages))
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.match.params.blogId
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(queryBlog, options)(ReadPage))
