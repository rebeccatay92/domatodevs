import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { readPageStyle } from '../../Styles/styles'

import PostsList from './PostsList'
import PostTextContent from './PostTextContent'
import PostMediaContent from './PostMediaContent'

import { initializePosts } from '../../actions/readActions'
import { queryBlog, increaseBlogViews } from '../../apollo/blog'

class ReadPage extends Component {
  render () {
    if (this.props.data.loading) {
      return <span>Loading...</span>
    }
    console.log(this.props.data)
    return (
      <div style={readPageStyle}>
        <PostsList pages={this.props.pages} />
        <PostMediaContent pages={this.props.pages} blogMedia={this.props.data.findBlog.media} />
        <PostTextContent pages={this.props.pages} blogTitle={this.props.data.findBlog.title} blogContent={this.props.data.findBlog.textContent} blogAuthor={this.props.data.findBlog.user.username} noOfLikes={this.props.data.findBlog.likes.length} noOfViews={this.props.data.findBlog.views} noOfShares={this.props.data.findBlog.shares} dateCreated={this.props.data.findBlog.createdAt} />
      </div>
    )
  }

  componentDidMount () {
    if (this.props.match.params.blogId) {
      this.props.increaseBlogViews({
        variables: {
          id: this.props.match.params.blogId
        }
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findBlog !== nextProps.data.findBlog) {
      const allPages = nextProps.data.findBlog.pages
      console.log(allPages)
      this.props.initializePosts(allPages)
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

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(queryBlog, options),
  graphql(increaseBlogViews, { name: 'increaseBlogViews' })
)(ReadPage))
