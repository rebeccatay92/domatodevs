import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { readPageStyle } from '../../../Styles/styles'

import EditorPostsList from './EditorPostsList'
import EditorTextContent from './EditorTextContent'
import EditorMediaContent from './EditorMediaContent'

import { initializePosts } from '../../../actions/readActions'
import { queryBlog } from '../../../apollo/blog'

class BlogEditorPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editedPages: [],
      deletedPages: []
    }
  }
  render () {
    if (this.props.data.loading) {
      return (
        <div style={readPageStyle}>
          <span>Loading...</span>
        </div>
      )
    }
    return (
      <div style={readPageStyle}>
        <EditorPostsList pages={this.props.pages} />
        <EditorMediaContent />
        <EditorTextContent />
      </div>
    )
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
  graphql(queryBlog, options)
)(BlogEditorPage))
