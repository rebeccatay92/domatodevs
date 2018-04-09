import React, { Component } from 'react'
import { WithOutContext as ReactTags } from 'react-tag-input'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import { updateActivePage } from '../../../actions/blogEditorActivePageActions'
import { changeActivePost } from '../../../actions/readActions'
import { toggleSpinner } from '../../../actions/spinnerActions'

import { constructGooglePlaceDataObj } from '../../../helpers/location'

import { queryBlog, updateBlog } from '../../../apollo/blog'
import { updatePost, updateMultiplePosts } from '../../../apollo/post'

import LocationSearch from '../../location/LocationSearch'

// function getPageInfo (props) {
//   const post = props.pages.pagesArr[props.pages.activePostIndex]
//   if (post && post.type === 'BlogHeading') return {}
//   let title, location, content, startDay, endDay
//   if (props.pages.activePostIndex === 'home') {
//     title = props.blogTitle
//     content = props.blogContent
//   } else if (props.pages.activePostIndex !== 'fin') {
//     title = post.Post.title || post.Post.description
//     content = post.Post.textContent
//   }
//   return {
//     title,
//     content
//   }
// }

class EditorTextContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmation: false
    }
  }

  handleSave (type) {
    const types = {
      Post: 'savePost',
      Blog: 'saveBlog'
    }

    this[types[type]]()
  }

  saveBlog () {
    this.props.toggleSpinner(true)
    this.props.updateBlog({
      variables: {
        id: this.props.page.modelId,
        title: this.props.page.title,
        textContent: this.props.page.textContent,
        days: this.props.page.days
      },
      refetchQueries: [{
        query: queryBlog,
        variables: { id: this.props.blogId }
      }]
    })
    .then(results => {
      this.props.updateActivePage('changesMade', false)
      this.props.toggleSpinner(false)
    })
  }

  savePost () {
    this.props.toggleSpinner(true)

    let indexOfNextHeaderOrPost = this.props.pages.pagesArr.findIndex((page, i) => {
      return i > this.props.pages.activePostIndex && (page.type === 'BlogHeading' || (page.type === 'Post' && !page.Post.ParentPostId))
    })

    if (indexOfNextHeaderOrPost === -1) indexOfNextHeaderOrPost = this.props.pages.pagesArr.length

    let parentPostId
    if (this.props.page.isSubPost) {
      for (var i = this.props.pages.activePostIndex - 1; i >= 0; i--) {
        if (this.props.pages.pagesArr[i].type === 'BlogHeading') {
          alert('error, no parent post to hold sub-posts')
          this.props.toggleSpinner(false)
          return
        }
        if (this.props.pages.pagesArr[i].type === 'Post' && !this.props.pages.pagesArr[i].Post.ParentPostId) {
          parentPostId = this.props.pages.pagesArr[i].modelId
          break
        }
      }
    } else {
      parentPostId = this.props.page.modelId
    }

    let subPostsArrToBeChanged
    if (this.props.page.isSubPost) {
      subPostsArrToBeChanged = this.props.pages.pagesArr[this.props.pages.activePostIndex].Post.childPosts.map(post => {
        return {
          id: post.id,
          ParentPostId: parentPostId
        }
      })
    } else if (!this.props.page.isSubPost) {
      subPostsArrToBeChanged = this.props.pages.pagesArr.slice(this.props.pages.activePostIndex + 1, indexOfNextHeaderOrPost).map(post => {
        return {
          id: post.modelId,
          ParentPostId: parentPostId
        }
      })
    }

    this.props.updatePost({
      variables: {
        ...{
          id: this.props.page.modelId,
          textContent: this.props.page.textContent,
          eventType: this.props.page.eventType,
          contentOnly: !this.props.page.eventType
        },
        ...this.props.page.eventType && {
          description: this.props.page.title,
          title: ''
        },
        ...!this.props.page.eventType && {
          title: this.props.page.title,
          description: ''
        },
        ...this.props.page.isSubPost && {
          ParentPostId: parentPostId
        },
        ...!this.props.page.isSubPost && {
          ParentPostId: null
        },
        ...this.props.page.googlePlaceData.placeId && {
          googlePlaceData: this.props.page.googlePlaceData
        }
      }
    })
    .then(results => {
      return this.props.updateMultiplePosts({
        variables: {
          input: subPostsArrToBeChanged
        },
        refetchQueries: [{
          query: queryBlog,
          variables: { id: this.props.blogId }
        }]
      })
    })
    .then(() => {
      this.props.updateActivePage('changesMade', false)
      this.props.toggleSpinner(false)
    })
  }

  selectLocation (location) {
    var googlePlaceData = constructGooglePlaceDataObj(location)
    googlePlaceData
    .then(resolved => {
      this.props.updateActivePage('googlePlaceData', resolved)
    })
  }

  handleHashtagAddition (tag) {
    this.props.updateActivePage('hashtags', [...this.props.page.hashtags, ...[tag]])
  }

  handleHashtagDelete (i) {
    this.props.updateActivePage('hashtags', this.props.page.hashtags.filter((hashtag, index) => index !== i))
  }

  render () {
    const {title, textContent, eventType, googlePlaceData, changesMade, days} = this.props.page
    const post = this.props.pages.pagesArr[this.props.pages.activePostIndex]
    if (post && post.type === 'BlogHeading') return null
    if (this.props.pages.activePostIndex === 'fin') return null
    return (
      <div style={{left: '60vw', width: '40vw', display: 'inline-block', verticalAlign: 'top', position: 'relative', backgroundColor: 'white', padding: '24px'}}>
        <label style={{margin: '8px 0'}}>{this.props.pages.activePostIndex === 'home' ? 'Blog Title' : 'Post Title'}</label>
        <input type='text' style={{width: '100%', padding: '8px'}} value={title} onChange={(e) => this.props.updateActivePage('title', e.target.value)} />
        {this.props.pages.activePostIndex !== 'home' &&
        <React.Fragment>
          <label style={{margin: '8px 0'}}>Location</label>
          <div style={{position: 'relative'}}>
            {/* <input type='text' style={{width: eventType ? '80%' : '100%', padding: '8px'}} />
            {eventType && <input type='text' style={{width: '20%', padding: '8px'}} />} */}
            <LocationSearch blogEditor selectLocation={location => this.selectLocation(location)} placeholder={'Location'} currentLocation={googlePlaceData} eventType={eventType} />
          </div>
        </React.Fragment>}
        <label style={{margin: '8px 0'}}>Content</label>
        <textarea rows={10} style={{width: '100%', padding: '8px'}} value={textContent} onChange={(e) => this.props.updateActivePage('textContent', e.target.value)} />
        {/* <input className='hashtagInput' type='text' placeholder='Add hashtags to get discovered by others' style={{width: '100%', padding: '8px', margin: '8px 0'}} /> */}
        <div>
          <ReactTags autofocus={false} delimiters={[32, 13, 9]} inline tags={this.props.page.hashtags} handleDelete={(i) => this.handleHashtagDelete(i)} handleAddition={(tag) => this.handleHashtagAddition(tag)} />
        </div>
        {this.props.pages.activePostIndex === 'home' &&
        <div>
          <label style={{margin: '8px 0'}}>No. of Days</label>
          <input type='number' step={1} style={{width: '20%', padding: '8px', margin: '8px'}} min={0} value={days} onChange={(e) => this.props.updateActivePage('days', e.target.value)} />
        </div>}
        <div style={{position: 'absolute', right: '24px', bottom: '-8px'}}>
          <button disabled={!changesMade} style={{opacity: changesMade ? '1.0' : '0.5'}} onClick={() => this.handleSave(this.props.page.type)}>Save Changes</button>
          <button onClick={() => this.props.changeActivePost('home')}>Cancel</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    page: state.blogEditorActivePage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateActivePage: (property, value) => {
      dispatch(updateActivePage(property, value))
    },
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
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
  graphql(updateBlog, { name: 'updateBlog' }),
  graphql(updatePost, { name: 'updatePost' }),
  graphql(updateMultiplePosts, { name: 'updateMultiplePosts' })
)(EditorTextContent))
