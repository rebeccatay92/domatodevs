import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { readPageStyle } from '../../../Styles/styles'

import EditorPostsList from './EditorPostsList'
import EditorTextContent from './EditorTextContent'
import EditorMediaContent from './EditorMediaContent'

import { initializePosts } from '../../../actions/readActions'
import { initializeActivePage } from '../../../actions/blogEditorActivePageActions'
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
        <EditorPostsList pages={this.props.pages} blogId={this.props.match.params.blogId} />
        <EditorMediaContent />
        <EditorTextContent pages={this.props.pages} blogTitle={this.props.data.findBlog.title} blogContent={this.props.data.findBlog.textContent} blogId={this.props.match.params.blogId} />
      </div>
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findBlog !== nextProps.data.findBlog) {
      const blog = nextProps.data.findBlog
      const allPages = blog.pages
      console.log(blog)
      console.log(allPages)
      this.props.initializePosts(allPages)
      if (this.props.pages.activePostIndex === 'home') {
        const page = {
          modelId: blog.id,
          type: 'Blog',
          title: blog.title,
          textContent: blog.textContent,
          days: blog.days,
          hashtags: blog.hashtags.map(hashtag => {
            return {
              id: hashtag.id,
              text: hashtag.name
            }
          })
        }
        this.props.initializeActivePage(page)
      }
    }
    if (this.props.pages.activePostIndex !== nextProps.pages.activePostIndex) {
      const blog = nextProps.data.findBlog
      let page = {
        modelId: '',
        type: '',
        title: '',
        textContent: '',
        isSubPost: false,
        startDay: '',
        endDay: '',
        eventType: '',
        googlePlaceData: {name: ''},
        hashtags: []
      }
      if (nextProps.pages.activePostIndex === 'home') {
        page = {
          modelId: blog.id,
          type: 'Blog',
          title: blog.title,
          textContent: blog.textContent,
          isSubPost: false,
          startDay: '',
          endDay: '',
          eventType: '',
          days: blog.days,
          googlePlaceData: {name: ''},
          hashtags: blog.hashtags.map(hashtag => {
            return {
              id: hashtag.id,
              text: hashtag.name
            }
          })
        }
      } else if (nextProps.pages.activePostIndex !== 'fin') {
        const activePage = this.props.pages.pagesArr[nextProps.pages.activePostIndex]
        const type = activePage.type
        const pageObj = activePage[type]
        page = {
          modelId: activePage.modelId,
          type,
          title: pageObj.title || pageObj.description,
          isSubPost: !!pageObj.ParentPostId,
          textContent: pageObj.textContent || '',
          eventType: pageObj.eventType,
          startDay: pageObj.startDay,
          endDay: pageObj.endDay,
          googlePlaceData: {name: pageObj.location ? pageObj.location.name : ''},
          hashtags: pageObj.hashtags ? pageObj.hashtags.map(hashtag => {
            return {
              id: hashtag.id,
              text: hashtag.name
            }
          }) : []
        }
      }
      this.props.initializeActivePage(page)
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
    },
    initializeActivePage: (page) => {
      dispatch(initializeActivePage(page))
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
