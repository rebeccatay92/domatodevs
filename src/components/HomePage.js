import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { getAllPublishedBlogs } from '../apollo/blog'
import { getAllPublishedItineraries } from '../apollo/itinerary'

import Radium from 'radium'
import { HomePageStyles as styles } from '../Styles/HomePageStyles'

// PUBLIC ROUTE. CAN VIEW WITHOUT LOGGING IN
class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      focusedTab: 'blogs'
    }
  }

  redirectToBlog (BlogId) {
    this.props.history.push(`/blog/${BlogId}`)
  }

  render () {
    // if (this.props.data.loading) return (<h1>Loading</h1>)
    // console.log('blogs', this.props.data.getAllPublishedBlogs)
    if (this.props.getAllPublishedBlogs.loading) return (<h1>Loading</h1>)
    if (this.props.getAllPublishedItineraries.loading) return (<h1>Loading</h1>)

    // console.log('props', this.props)
    return (
      <div style={styles.homePageContainer}>
        {/* HORIZONTAL TABS */}
        <div style={styles.tabsBar}>
          <h3 style={this.state.focusedTab === 'blogs' ? styles.clickedTab : styles.unclickedTab} onClick={() => this.setState({focusedTab: 'blogs'})}>Blogs</h3>
          <h3 style={this.state.focusedTab === 'itineraries' ? styles.clickedTab : styles.unclickedTab} onClick={() => this.setState({focusedTab: 'itineraries'})}>Itineraries</h3>
        </div>

        {/* BLOG SECTION */}
        {this.state.focusedTab === 'blogs' &&
          <div style={styles.blogSectionContainer}>
            {this.props.getAllPublishedBlogs.getAllPublishedBlogs.map((blog, i) => {
              return (
                <div key={i} style={styles.blogThumbnailContainer}>
                  {/* TOP INFO ROW */}
                  <div style={styles.blogThumbnailTopInfoRow}>
                    <div style={styles.blogThumbnailAuthorContainer}>
                      {/* AUTHOR PROFILE PIC */}
                      <img src={blog.user.profilePic} style={styles.authorProfilePic} />
                      {/* AUTHOR NAME AND PUBLISH DATE */}
                      <div style={styles.publishInfoContainer}>
                        <span style={styles.authorName}>
                          By <span style={styles.authorNameHover} key={`authorName${i}`}>{blog.user.username}</span>
                        </span>
                        <span style={styles.timeFromPublishDate}>{blog.timeFromPublishDate}</span>
                      </div>
                    </div>
                    {/* COUNTRY. RIGHT ALIGN */}
                    <span key={`countryName${i}`} style={styles.countryName}>South Korea</span>
                  </div>
                  {/* THUMBNAIL IMAGE */}
                  <div style={styles.thumbnailImageContainer}>
                    {blog.medium &&
                      <img src={blog.medium.imageUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} onClick={() => this.redirectToBlog(blog.id)} />
                    }
                  </div>
                  {/* BOTTOM INFO ROW */}
                  <div style={styles.blogThumbnailBottomInfoRow}>
                    <div style={styles.blogTitleRow}>
                      {/* <span style={styles.blogTitle}>Work Trip to Melbourne abc hkhj jh abd</span> */}
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
        }

        {/* ITINERARIES SECTIONS */}

        {this.state.focusedTab === 'itineraries' &&
          <div>ITINERARIES</div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile
  }
}

export default connect(mapStateToProps)(compose(
  graphql(getAllPublishedBlogs, {name: 'getAllPublishedBlogs'}),
  graphql(getAllPublishedItineraries, {name: 'getAllPublishedItineraries'})
)(Radium(HomePage)))
