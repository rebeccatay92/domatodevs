import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import { updateBlog, deleteBlog, getUserBlogs } from '../../apollo/blog'

import { BlogThumbnailDropdownStyles as styles } from '../../Styles/BlogThumbnailDropdownStyles'

class BlogThumbnailDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleClickOutside () {
    this.props.toggleBlogThumbnailDropdown()
  }

  onMenuSelect (action) {
    this.props.toggleBlogThumbnailDropdown()
    if (action === 'edit') {
      this.props.history.push(`/blogeditor/${this.props.blogId}`)
    } else if (action === 'public') {
      this.props.history.push(`/blog/${this.props.blogId}`)
    } else if (action === 'publish') {
      this.props.updateBlog({
        variables: {
          id: this.props.blogId,
          published: true
        },
        refetchQueries: [{
          query: getUserBlogs
        }]
      })
    } else if (action === 'private') {
      this.props.updateBlog({
        variables: {
          id: this.props.blogId,
          published: false
        },
        refetchQueries: [{
          query: getUserBlogs
        }]
      })
    } else if (action === 'delete') {
      this.props.deleteBlog({
        variables: {
          id: this.props.blogId
        },
        refetchQueries: [{
          query: getUserBlogs
        }]
      })
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

export default (compose(
  graphql(updateBlog, {name: 'updateBlog'}),
  graphql(deleteBlog, {name: 'deleteBlog'})
))(withRouter(onClickOutside(Radium(BlogThumbnailDropdown))))
