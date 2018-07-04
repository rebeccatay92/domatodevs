import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { EditorState, convertFromRaw } from 'draft-js'
import { readPageStyle } from '../../Styles/styles'

import PostsList from './PostsList'
import PostTextContent from './PostTextContent'
import PostMediaContent from './PostMediaContent'

import { initializePosts, changeActivePost } from '../../actions/readActions'
import { queryBlog, increaseBlogViews } from '../../apollo/blog'

class ReadPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // allPages: [],
      // currentPage: 0
      showSaveToBucketMenu: false
    }
  }

  // REPLACE WITH SCROLLUP/SCROLLDOWN LOGIC
  pageUp () {
    // homepage is index 0
    if (this.props.pages.activePostIndex > 0) {
      this.props.changeActivePost(this.props.pages.activePostIndex - 1)
    }
  }

  pageDown () {
    if (this.props.pages.activePostIndex < this.props.pages.pagesArr.length - 1) {
      this.props.changeActivePost(this.props.pages.activePostIndex + 1)
    }
  }

  componentDidMount () {
    // console.log('did mount')
    if (this.props.match.params.blogId) {
      this.props.increaseBlogViews({
        variables: {
          id: this.props.match.params.blogId
        }
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.findBlog !== this.props.data.findBlog) {
      // console.log('willreceiveprops pages', nextProps.data.findBlog.pages)
      let findBlog = nextProps.data.findBlog
      let allPagesArr = [{
        type: 'homepage',
        blogTitle: findBlog.title,
        author: findBlog.user.username,
        hashtags: findBlog.hashtags,
        medium: findBlog.medium,
        noOfLikes: findBlog.likes.length,
        noOfViews: findBlog.views,
        noOfShares: findBlog.shares,
        dateCreated: findBlog.createdAt
      }].concat(findBlog.pages)
      // page's position in arr will follow load seq and activePostIndex
      // home is 0, very fist post is load seq 1 and index 1
      console.log('allPagesArr', allPagesArr)

      this.props.initializePosts(allPagesArr)
    }
  }

  render () {
    if (this.props.data.loading) {
      return <span>Loading...</span>
    }
    // console.log('findBlog', this.props.data.findBlog)
    console.log('redux pagesArr', this.props.pages.pagesArr, 'activePostIndex', this.props.pages.activePostIndex)

    if (this.props.pages.pagesArr.length) {
      var page = this.props.pages.pagesArr[this.props.pages.activePostIndex]
      console.log('page', page)
      var medium
      if (page.type === 'Post') {
        var mediaArr = page.Post.media
      } else if (page.type === 'homepage') {
        medium = page.medium
      } else if (page.type === 'BlogHeading') {
        medium = page.BlogHeading.medium
      }
    }
    return (
      <div style={readPageStyle}>
        <div style={{position: 'fixed', left: '600px', top: 0, zIndex: 999, border: '1px solid blue'}}>
          <span>Buttons before scroll logic is in</span>
          <button onClick={() => this.pageUp()}>Page Up</button>
          <button onClick={() => this.pageDown()}>Page Down</button>
          {this.props.pages.pagesArr.length > 0 &&
            <React.Fragment>
              <span>Current page: {this.props.pages.activePostIndex}</span>
              <span>type: {this.props.pages.pagesArr[this.props.pages.activePostIndex].type}</span>
            </React.Fragment>
          }
        </div>

        <div style={{position: 'relative', zIndex: 999, border: '1px solid red'}}>
          <button onClick={() => this.setState({showSaveToBucketMenu: !this.state.showSaveToBucketMenu})}>SAVE TO BUCKET</button>
          {this.state.showSaveToBucketMenu &&
            <div style={{width: '336px', height: '181px', background: 'white', border: '1px solid rgb(219, 219, 219)', position: 'absolute', left: '50px', padding: '12px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)'}}>
              <h6 style={{margin: 0, fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '26px', color: 'rgb(95, 93, 102)'}}>Write a note</h6>
              <input type='text' placeholder={'Notes'} style={{width: '100%', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '26px', color: 'rgb(60, 58, 68)', outline: 'none', borderBottom: '1px solid rgb(219, 219, 219)'}} />
              <h6 style={{margin: '14px 0 0 0', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '26px', color: 'rgb(95, 93, 102)'}}>Event</h6>
              <input type='text' placeholder={'Type of event'} style={{display: 'inline-block', width: '213px', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '26px', color: 'rgb(60, 58, 68)', outline: 'none', borderBottom: '1px solid rgb(219, 219, 219)'}} />
              <select style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', border: 'none', outline: 'none', color: 'rgb(60, 58, 68)', background: 'transparent'}}>
                <option value='Location'>Location</option>
                <option value='Activity'>Activity</option>
                <option value='Food'>Food</option>
                <option value='Lodging'>Lodging</option>
                <option value='Flight'>Flight</option>
                <option value='Transport'>Transport</option>
              </select>

              <button style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', marginTop: '17px', background: 'transparent', border: 'none', color: 'rgb(250, 51, 82)', outline: 'none'}}>Save</button>
              <button style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', marginTop: '17px', background: 'transparent', border: 'none', color: 'rgb(60, 58, 68)', outline: 'none'}}>Cancel</button>
            </div>
          }
        </div>
        {/* TEXT CONTENT COMPONENT RECEIVES 1 PAGE ONLY, INSTEAD OF ENTIRE ARR. EITHER HOMEPAGE, OR HEADER, OR POST. */}
        {/* DOM WANTS TEXT CONTENT TO BE CONTINOUS SCROLL LIKE MSWORD. RENDER ALL PAGES AT ONCE? */}
        {this.props.pages.pagesArr.length &&
          <PostTextContent page={this.props.pages.pagesArr[this.props.pages.activePostIndex]} />
        }

        {/* SCROLLABLE POSTS LIST COMPONENT */}

        {/* MEDIA COMPONENT RECEIVES CAROUSEL BOOLEAN, MEDIUM OBJ, MEDIA ARR. CHECK EITHER MEDIUM OR MEDIA DEPENDING ON BOOLEAN */}
        {this.props.pages.pagesArr.length &&
          <PostMediaContent carousel={this.props.pages.pagesArr[this.props.pages.activePostIndex].type === 'Post'} medium={medium} mediaArr={mediaArr} />
        }
        {/* <PostsList pages={this.props.pages} />
        <PostMediaContent pages={this.props.pages} blogMedia={this.props.data.findBlog.media} />
        <PostTextContent pages={this.props.pages} blogTitle={this.props.data.findBlog.title} blogContent={EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.data.findBlog.textContent)))} blogAuthor={this.props.data.findBlog.user.username} blogHashtags={this.props.data.findBlog.hashtags} noOfLikes={this.props.data.findBlog.likes.length} noOfViews={this.props.data.findBlog.views} noOfShares={this.props.data.findBlog.shares} dateCreated={this.props.data.findBlog.createdAt} /> */}
      </div>
    )
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
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
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
  graphql(queryBlog, options),
  graphql(increaseBlogViews, { name: 'increaseBlogViews' })
)(ReadPage))
