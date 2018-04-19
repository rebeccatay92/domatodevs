import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

// import ConfirmWindow from '../../misc/ConfirmWindow'

import { changeActivePost, initializePosts } from '../../../actions/readActions'
import { toggleSpinner } from '../../../actions/spinnerActions'
import { openConfirmWindow, resetConfirmWindow } from '../../../actions/confirmWindowActions'

import { createPost, updateMultiplePosts, deletePost } from '../../../apollo/post'
import { createBlogHeading, deleteBlogHeading } from '../../../apollo/blogHeading'
import { reorderBlogContent } from '../../../apollo/reorderBlogContent'
import { queryBlog } from '../../../apollo/blog'

const liStyle = {cursor: 'default', lineHeight: '100%', padding: '8px', whiteSpace: 'nowrap', ':hover': {color: '#ed685a'}}

class BlogDropdownMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmation: false
    }
  }

  addPage (index, type, position) {
    this.props.toggleDropdown()

    let adjustedIndex = index

    let indexOfNextHeader = this.props.pages.pagesArr.findIndex((page, i) => {
      return i >= index && page.type === 'BlogHeading'
    })

    let indexOfPrevHeader = -1
    this.props.pages.pagesArr.slice(0, index + 1).forEach((page, i) => {
      if (page.type === 'BlogHeading') indexOfPrevHeader = i
    })

    let indexOfNextHeaderOrPost = this.props.pages.pagesArr.findIndex((page, i) => {
      return i >= index && (page.type === 'BlogHeading' || (page.type === 'Post' && !page.Post.ParentPostId))
    })

    if (indexOfNextHeaderOrPost === -1) indexOfNextHeaderOrPost = this.props.pages.pagesArr.length

    if (type === 'BlogHeading' && position === 'below') {
      if (indexOfNextHeader === -1) {
        indexOfNextHeader = this.props.pages.pagesArr.length
      }
      adjustedIndex = indexOfNextHeader
    }

    if (type === 'BlogHeading' && position === 'above') {
      if (indexOfPrevHeader !== -1) {
        adjustedIndex = indexOfPrevHeader
      }
    }

    const loadSeqArr = this.props.pages.pagesArr.slice(adjustedIndex).map(page => {
      return {
        type: page.type,
        modelId: page.modelId,
        loadSequence: page.loadSequence + 1
      }
    })

    this.props.toggleSpinner(true)

    this.props.reorderBlogContent({
      variables: {
        input: loadSeqArr
      }
    })
    .then(results => {
      const types = {
        'Post': 'createPost',
        'BlogHeading': 'createBlogHeading'
      }
      return this.props[types[type]]({
        variables: {
          BlogId: this.props.blogId,
          loadSequence: adjustedIndex + 1
        }
      })
    })
    .then(results => {
      if ((position === 'below' && type === 'Post' && indexOfNextHeaderOrPost > index) || (position === 'above' && type === 'Post' && this.props.pages.pagesArr[this.props.i].type === 'Post' && this.props.pages.pagesArr[this.props.i].Post.ParentPostId)) {
        console.log('called');
        if (indexOfNextHeaderOrPost === -1) {
          indexOfNextHeaderOrPost = this.props.pages.pagesArr.length
        }
        // subPosts Arr to have parentId changed
        const postsArr = this.props.pages.pagesArr.slice(index, indexOfNextHeaderOrPost).map(post => {
          return {
            id: post.modelId,
            ParentPostId: results.data.createPost.id
          }
        })
        return this.props.updateMultiplePosts({
          variables: {
            input: postsArr
          }
        })
        .then(results => {
          return this.props.data.refetch()
        })
      } else {
        return this.props.data.refetch()
      }
    })
    .then(response => {
      this.props.initializePosts(response.data.findBlog.pages)
      // this.props.changeActivePost(adjustedIndex)
      this.props.toggleSpinner(false)
    })
  }

  deletePage (type) {
    this.props.toggleSpinner(true)

    let noOfSubPosts = 0
    if (this.props.pages.pagesArr[this.props.i].type === 'Post') noOfSubPosts = this.props.pages.pagesArr[this.props.i].Post && this.props.pages.pagesArr[this.props.i].Post.childPosts.length

    const loadSeqArr = this.props.pages.pagesArr.slice(this.props.i + 1).map(page => {
      return {
        type: page.type,
        modelId: page.modelId,
        loadSequence: page.loadSequence - 1 - noOfSubPosts
      }
    })

    const types = {
      'Post': 'deletePost',
      'BlogHeading': 'deleteBlogHeading'
    }

    this.props.reorderBlogContent({
      variables: {
        input: loadSeqArr
      }
    })
    .then(results => {
      return this.props[types[type]]({
        variables: {
          id: this.props.pages.pagesArr[this.props.i].modelId
        }
      })
    })
    .then(results => {
      return this.props.data.refetch()
    })
    .then(response => {
      this.props.initializePosts(response.data.findBlog.pages)
      if (this.props.pages.activePostIndex === 'home') {

      } else if (this.props.i < this.props.pages.activePostIndex) {
        this.props.changeActivePost(this.props.pages.activePostIndex - 1)
      } else if (this.props.i === this.props.pages.activePostIndex) {
        this.props.changeActivePost('home')
      }
      this.props.toggleSpinner(false)
      this.setState({confirmation: false})
      this.props.toggleDropdown()
    })
  }

  handleCancel () {
    this.setState({confirmation: false})
    this.props.toggleDropdown()
  }

  handleDeleteClick () {
    this.setState({confirmation: true})
    this.props.openConfirmWindow({
      message: 'Are you sure you want to delete this ' + (this.props.heading ? 'header?' : 'post?'),
      secondaryMessage: this.props.heading ? '' : 'Warning: All sub-posts that belong to this post will also be deleted.',
      confirmMessage: 'Delete ' + (this.props.heading ? 'Header' : 'Post')
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.confirmation && nextProps.confirmWindow.confirmClicked && !this.props.confirmWindow.confirmClicked) {
      this.deletePage(this.props.heading ? 'BlogHeading' : 'Post')
      this.props.resetConfirmWindow()
    }
    if (this.state.confirmation && !nextProps.confirmWindow.open && this.props.confirmWindow.open && !nextProps.confirmWindow.confirmClicked) {
      this.handleCancel()
    }
  }

  render () {
    return (
      <div style={{position: 'absolute', top: '17px', right: '-20px', backgroundColor: 'white', zIndex: 1, display: 'inline-block', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}}>
        <ul style={{listStyleType: 'none', padding: 0}}>
          <li key='addPostAbv' style={liStyle} onClick={() => this.addPage(this.props.i, 'Post', 'above')}>Add Post Above</li>
          <li key='addPostBel' style={liStyle} onClick={() => this.addPage(this.props.i + 1, 'Post', 'below')}>Add Post Below</li>
          <li key='addHeaderAbv' style={liStyle} onClick={() => this.addPage(this.props.i, 'BlogHeading', 'above')}>Add Header Above</li>
          <li key='addHeaderBel' style={liStyle} onClick={() => this.addPage(this.props.i + 1, 'BlogHeading', 'below')}>Add Header Below</li>
          {this.props.heading && <li key='delHead' style={liStyle} onClick={() => this.handleDeleteClick()}>Delete Header</li>}
          {this.props.post && <li key='delPost' style={liStyle} onClick={() => this.handleDeleteClick()}>Delete Post</li>}
        </ul>
        {/* {this.state.confirmation && <ConfirmWindow message={'Are you sure you want to delete this ' + (this.props.heading ? 'header?' : 'post?')} secondaryMessage={this.props.heading ? '' : 'Warning: All sub-posts that belong to this post will also be deleted.'} confirmMessage={'Delete ' + (this.props.heading ? 'Header' : 'Post')} cancelFn={() => this.handleCancel()} confirmFn={() => this.deletePage(this.props.heading ? 'BlogHeading' : 'Post')} />} */}
      </div>
    )
  }

  handleClickOutside (event) {
    if (this.state.confirmation) return
    this.props.toggleDropdown(event)
  }
}

const mapStateToProps = (state) => {
  return {
    pages: state.blogPosts,
    confirmWindow: state.confirmWindow
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
    },
    openConfirmWindow: (input) => {
      dispatch(openConfirmWindow(input))
    },
    resetConfirmWindow: () => {
      dispatch(resetConfirmWindow())
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

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(queryBlog, options),
  graphql(createPost, { name: 'createPost' }),
  graphql(createBlogHeading, { name: 'createBlogHeading' }),
  graphql(updateMultiplePosts, { name: 'updateMultiplePosts' }),
  graphql(deletePost, { name: 'deletePost' }),
  graphql(deleteBlogHeading, { name: 'deleteBlogHeading' }),
  graphql(reorderBlogContent, { name: 'reorderBlogContent' })
)(onClickOutside(Radium(BlogDropdownMenu))))
