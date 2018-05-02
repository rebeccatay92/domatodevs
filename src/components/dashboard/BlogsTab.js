import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { getUserBlogs } from '../../apollo/blog'

import { BlogsTabStyles as styles } from '../../Styles/BlogsTabStyles'

class BlogsTab extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)
    console.log('blogs tab PROPS', this.props.data.getUserBlogs)
    return (
      <div style={styles.blogsTabContainer}>
        Dashboard blogs
      </div>
    )
  }
}

export default graphql(getUserBlogs)(BlogsTab)
