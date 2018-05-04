import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import { updateBlog, deleteBlog, getUserBlogs } from '../../apollo/blog'
import { openConfirmWindow } from '../../actions/confirmWindowActions'

import { BlogThumbnailDropdownStyles as styles } from '../../Styles/BlogThumbnailDropdownStyles'

class BlogThumbnailDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmIsFor: ''
    }
  }

  handleClickOutside () {
    this.props.toggleBlogThumbnailDropdown()
  }

  onMenuSelect (action) {
    if (action === 'edit') {
      this.props.history.push(`/blogeditor/${this.props.blogId}`)
    } else if (action === 'public') {
      this.props.history.push(`/blog/${this.props.blogId}`)
    } else if (action === 'publish') {
      this.setState({confirmIsFor: 'publish'})
      this.props.openConfirmWindow({
        message: 'Are you sure you want to publish this blog?',
        secondaryMessage: '',
        confirmMessage: 'Proceed'
      })
    } else if (action === 'private') {
      this.setState({confirmIsFor: 'private'})
      this.props.openConfirmWindow({
        message: 'Are you sure you want to make this blog private?',
        secondaryMessage: 'This blog will no longer be viewable by others',
        confirmMessage: 'Proceed'
      })
    } else if (action === 'delete') {
      this.setState({confirmIsFor: 'delete'})
      this.props.openConfirmWindow({
        message: 'Are you sure you want to delete this blog? Deleted blogs are unrecoverable.',
        secondaryMessage: `If you want to remove this blog from public view, you can also change the privacy setting to Private.`,
        confirmMessage: 'Proceed'
      })
    }
  }

  makeBlogPublic () {
    this.props.updateBlog({
      variables: {
        id: this.props.blogId,
        published: true
      },
      refetchQueries: [{
        query: getUserBlogs
      }]
    })
    this.props.toggleBlogThumbnailDropdown()
  }

  makeBlogPrivate () {
    this.props.updateBlog({
      variables: {
        id: this.props.blogId,
        published: false
      },
      refetchQueries: [{
        query: getUserBlogs
      }]
    })
    this.props.toggleBlogThumbnailDropdown()
  }

  deleteBlog () {
    this.props.deleteBlog({
      variables: {
        id: this.props.blogId
      },
      refetchQueries: [{
        query: getUserBlogs
      }]
    })
    this.props.toggleBlogThumbnailDropdown()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.confirmWindow !== this.props.confirmWindow) {
      console.log('nextprops', nextProps.confirmWindow)
      if (!nextProps.confirmWindow.open && nextProps.confirmWindow.confirmClicked) {
        // if confirm is true
        console.log('confirm clicked')
        if (this.state.confirmIsFor === 'publish') {
          this.makeBlogPublic()
        } else if (this.state.confirmIsFor === 'private') {
          this.makeBlogPrivate()
        } else if (this.state.confirmIsFor === 'delete') {
          this.deleteBlog()
        }
        this.setState({confirmIsFor: ''})
      } else if (!nextProps.confirmWindow.open && !nextProps.confirmWindow.confirmClicked) {
        // if cancelled
        console.log('cancelled')
        this.setState({confirmIsFor: ''})
        this.props.toggleBlogThumbnailDropdown()
      }
    }
  }

  render () {
    return (
      <div style={styles.dropdownContainer}>
        <div key={'dropdownOption1'} style={styles.dropdownOptionContainer} onClick={() => this.onMenuSelect('edit')}>
          <span style={styles.dropdownOption}>Edit</span>
        </div>
        <div key={'dropdownOption2'} style={styles.dropdownOptionContainer} onClick={() => this.onMenuSelect('public')}>
          <span style={styles.dropdownOption}>View Public Link</span>
        </div>
        {this.props.published &&
          <div key={'dropdownOption3'} style={styles.dropdownOptionContainer} onClick={() => this.onMenuSelect('private')}>
            <span style={styles.dropdownOption}>Make Private</span>
          </div>
        }
        {!this.props.published &&
          <div key={'dropdownOption4'} style={styles.dropdownOptionContainer} onClick={() => this.onMenuSelect('publish')}>
            <span style={styles.dropdownOption}>Publish</span>
          </div>
        }
        <div key={'dropdownOption5'} style={styles.dropdownOptionContainer} onClick={() => this.onMenuSelect('delete')}>
          <span style={styles.dropdownOption}>Delete</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    confirmWindow: state.confirmWindow
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openConfirmWindow: (input) => {
      dispatch(openConfirmWindow(input))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateBlog, {name: 'updateBlog'}),
  graphql(deleteBlog, {name: 'deleteBlog'})
)(withRouter(onClickOutside(Radium(BlogThumbnailDropdown)))))
