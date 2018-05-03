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

  toggleBlogThumbnailDropdown () {
    console.log('toggle dropdown for edit, public view, privacy toggle, delete')
  }

  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)
    // console.log('blogs tab PROPS', this.props.data.getUserBlogs)
    return (
      <div className={'blogsTabComponent'} style={styles.blogsTabContainer}>
        {this.props.data.getUserBlogs.map((blog, i) => {
          return (
            <div key={`dashboardBlog${i}`} style={styles.blogThumbnailContainer}>
              {/* IMAGE CONTAINER -> IMAGE AND ICON */}
              <div style={styles.thumbnailImageContainer}>
                {blog.media[0] &&
                  <img src={blog.media[0].imageUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                }
                {/* PUBLIC / PRIVATE TOGGLE ICON */}
                <div style={blog.published ? styles.blogPublishedIconContainer : styles.blogPrivateIconContainer}>
                  {blog.published &&
                    <i className='material-icons' style={styles.publishToggleIcon}>visibility</i>
                  }
                  {!blog.published &&
                    <i className='material-icons' style={styles.publishToggleIcon}>lock_outline</i>
                  }
                </div>
              </div>
              {/* BOTTOM INFO SECTION. 4 ROWS. REUSED FROM HOMEPAGE */}
              <div style={styles.bottomInfoContainer}>
                <div style={styles.countryAndTimeFromPublishDateRow}>
                  <span style={styles.timeFromPublishDate}>{blog.timeFromPublishDate}</span>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={styles.countryName}>South Korea</span>
                    <i className='material-icons' style={{cursor: 'pointer'}} onClick={() => this.toggleBlogThumbnailDropdown()}>more_horiz</i>
                  </div>
                </div>
                <div style={styles.blogTitleRow}>
                  <span style={styles.blogTitle}>{blog.title}</span>
                </div>
                <div style={styles.blogTagsRow}>
                  {blog.hashtags.map((hashtag, i) => {
                    return (
                      <div key={`blogHashTagDiv${i}`}>
                        {i !== 0 &&
                          <span style={styles.blogTagsSpacer}>&#8226;</span>
                        }
                        <span style={styles.blogTags}>{hashtag.name}</span>
                      </div>
                    )
                  })}
                </div>
                <span style={styles.blogViewsText}>{blog.views} views</span>
              </div>
            </div>
          )
        })}
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
