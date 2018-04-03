import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import { changeActivePost } from '../../../actions/readActions'

import { createPost } from '../../../apollo/post'
import { createBlogHeading } from '../../../apollo/blogHeading'
import { reorderBlogContent } from '../../../apollo/reorderBlogContent'
import { queryBlog } from '../../../apollo/blog'

const liStyle = {cursor: 'default', lineHeight: '100%', padding: '8px', whiteSpace: 'nowrap', ':hover': {color: '#ed685a'}}

class BlogDropdownMenu extends Component {
  addPost (index) {
    this.props.createPost({
      variables: {
        BlogId: this.props.blogId,
        loadSequence: index + 1
      },
      refetchQueries: [{
        query: queryBlog,
        variables: {
          id: this.props.blogId
        }
      }]
    })
    .then(results => console.log(results.data.createPost.id))
  }

  render () {
    return (
      <div style={{position: 'absolute', top: '17px', right: '-17px', backgroundColor: 'white', zIndex: 1, display: 'inline-block', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}}>
        <ul style={{listStyleType: 'none', padding: 0}}>
          <li key='addPostAbv' style={liStyle} onClick={() => this.addPost(this.props.i)}>Add Post Above</li>
          <li key='addPostBel' style={liStyle}>Add Post Below</li>
          <li key='addHeaderAbv' style={liStyle}>Add Header Above</li>
          <li key='addHeaderBel' style={liStyle}>Add Header Below</li>
          {this.props.heading && <li key='delHead' style={liStyle}>Delete Header</li>}
          {this.props.post && <li key='delPost' style={liStyle}>Delete Post</li>}
        </ul>
      </div>
    )
  }

  handleClickOutside (event) {
    this.props.toggleDropdown(event)
  }
}

const mapStateToProps = (state) => {
  return {
    pages: state.blogPosts
  }
}

export default connect(mapStateToProps)(compose(
  graphql(createPost, { name: 'createPost' }),
  graphql(createBlogHeading, { name: 'createBlogHeading' }),
  graphql(reorderBlogContent, { name: 'reorderBlogContent' })
)(onClickOutside(Radium(BlogDropdownMenu))))
