import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import { setStickyTabs } from '../../actions/userDashboardActions'

import { getUserBlogs } from '../../apollo/blog'

import { BlogsTabStyles as styles } from '../../Styles/BlogsTabStyles'

class BlogsTab extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleScrollBound = (e) => this.handleScroll(e)
  }

  componentDidMount () {
    document.addEventListener('scroll', this.handleScrollBound)
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.handleScrollBound)
  }

  handleScroll (e) {
    const el = document.querySelector('.blogsTabComponent')
    if (!el) return
    const rect = el.getBoundingClientRect()
    const distFromTop = rect.top
    // console.log('component distFromTop', distFromTop)
    // 108 px is navbar + horizontal tabs
    if (distFromTop >= 108 && this.props.userDashboard.stickyTabs) {
      this.props.setStickyTabs(false)
    }
  }
  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)
    console.log('blogs tab PROPS', this.props.data.getUserBlogs)
    return (
      <div className={'blogsTabComponent'} style={styles.blogsTabContainer}>
        insert thumbnail here
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userDashboard: state.userDashboard
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setStickyTabs: (sticky) => {
      dispatch(setStickyTabs(sticky))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(getUserBlogs)(BlogsTab))
