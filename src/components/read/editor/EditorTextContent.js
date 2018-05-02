import React, { Component } from 'react'
import { WithOutContext as ReactTags } from 'react-tag-input'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'
// import editorStyles from './editorStyles.css'

import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'
import { EditorState, convertToRaw } from 'draft-js'
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton
} from 'draft-js-buttons'

import { updateActivePage, initializeActivePage } from '../../../actions/blogEditorActivePageActions'
import { changeActivePost } from '../../../actions/readActions'
import { toggleSpinner } from '../../../actions/spinnerActions'

import { constructGooglePlaceDataObj } from '../../../helpers/location'

import { queryBlog, updateBlog } from '../../../apollo/blog'
import { updatePost, updateMultiplePosts } from '../../../apollo/post'
import { getAllHashtags } from '../../../apollo/hashtag'

import LocationSearch from '../../location/LocationSearch'

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    UnorderedListButton,
    OrderedListButton
  ]
})
const { InlineToolbar } = inlineToolbarPlugin
const plugins = [inlineToolbarPlugin]
const text = 'In this editor a toolbar shows up once you select part of the text …'

class EditorTextContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmation: false,
      editingStartTime: false,
      editingEndTime: false,
      editingStartDay: false,
      editingEndDay: false
    }

    this.onChange = (editorState) => {
      console.log(convertToRaw(editorState.getCurrentContent()))
      this.props.updateActivePage('textContent', editorState)
    }

    this.focus = () => {
      this.editor.focus()
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
        days: this.props.page.days,
        hashtags: this.props.page.hashtags.map(hashtag => {
          return hashtag.text.toString()
        }),
        media: this.props.page.media.map(medium => {
          return {
            MediumId: medium.id,
            caption: medium.caption,
            loadSequence: medium.loadSequence
          }
        })
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

    var startUnix, endUnix
    if (this.props.page.startTime) {
      var startHours = this.props.page.startTime.split(':')[0]
      var startMins = this.props.page.startTime.split(':')[1]
      startUnix = (startHours * 60 * 60) + (startMins * 60)
    }
    if (this.props.page.endTime) {
      var endHours = this.props.page.endTime.split(':')[0]
      var endMins = this.props.page.endTime.split(':')[1]
      endUnix = (endHours * 60 * 60) + (endMins * 60)
    }

    console.log({
      ...{
        id: this.props.page.modelId,
        textContent: this.props.page.textContent,
        eventType: this.props.page.eventType,
        contentOnly: !this.props.page.eventType,
        hashtags: this.props.page.hashtags.map(hashtag => {
          return hashtag.text.toString()
        }),
        media: this.props.page.media.map(medium => {
          return {
            MediumId: medium.MediumId,
            caption: medium.caption,
            loadSequence: medium.loadSequence
          }
        }),
        startDay: this.props.page.startDay && this.props.page.startDay.value,
        endDay: this.props.page.endDay && this.props.page.endDay.value,
        startTime: startUnix,
        endTime: endUnix
      },
      ...this.props.page.eventType && {
        description: this.props.page.title,
        title: ''
      },
      ...!this.props.page.eventType && {
        title: this.props.page.title,
        description: '',
        startDay: null,
        endDay: null,
        startTime: null,
        endTime: null
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
    });

    this.props.updatePost({
      variables: {
        ...{
          id: this.props.page.modelId,
          textContent: this.props.page.textContent,
          eventType: this.props.page.eventType,
          contentOnly: !this.props.page.eventType,
          hashtags: this.props.page.hashtags.map(hashtag => {
            return hashtag.text.toString()
          }),
          media: this.props.page.media.map(medium => {
            return {
              MediumId: medium.MediumId,
              caption: medium.caption,
              loadSequence: medium.loadSequence
            }
          }),
          startDay: this.props.page.startDay && this.props.page.startDay.value,
          endDay: this.props.page.endDay && this.props.page.endDay.value,
          startTime: startUnix,
          endTime: endUnix
        },
        ...this.props.page.eventType && {
          description: this.props.page.title,
          title: ''
        },
        ...!this.props.page.eventType && {
          title: this.props.page.title,
          description: '',
          startDay: null,
          endDay: null,
          startTime: null,
          endTime: null
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
    .then(() => {
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
    if (this.props.page.hashtags.map(obj => obj.text).includes(tag.text)) return
    this.props.updateActivePage('hashtags', [...this.props.page.hashtags, ...[tag]])
  }

  handleHashtagDelete (i, e) {
    if (e.keyCode === 8) return
    this.props.updateActivePage('hashtags', this.props.page.hashtags.filter((hashtag, index) => index !== i))
  }

  discardChanges () {
    this.props.toggleSpinner(true)
    this.props.queryBlog.refetch()
    .then(results => {
      const blog = results.data.findBlog
      if (this.props.pages.activePostIndex === 'home') {
        const page = {
          modelId: blog.id,
          type: 'Blog',
          title: blog.title,
          textContent: blog.textContent,
          days: blog.days,
          hashtags: blog.hashtags ? blog.hashtags.map(hashtag => {
            return {
              id: hashtag.id,
              text: hashtag.name
            }
          }) : [],
          media: blog.media || []
        }
        this.props.initializeActivePage(page)
      } else if (this.props.pages.activePostIndex !== 'fin') {
        const activePage = this.props.pages.pagesArr[this.props.pages.activePostIndex]
        const type = activePage.type
        const pageObj = activePage[type]
        const page = {
          modelId: activePage.modelId,
          type,
          title: pageObj.title || pageObj.description,
          isSubPost: !!pageObj.ParentPostId,
          textContent: pageObj.textContent || '',
          eventType: pageObj.eventType,
          startDay: {value: pageObj.startDay},
          endDay: {value: pageObj.endDay},
          googlePlaceData: {name: pageObj.location ? pageObj.location.name : ''},
          hashtags: pageObj.hashtags ? pageObj.hashtags.map(hashtag => {
            return {
              id: hashtag.id,
              text: hashtag.name
            }
          }) : [],
          media: pageObj.media || []
        }
        this.props.initializeActivePage(page)
      }
      this.props.toggleSpinner(false)
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.pages.activePostIndex !== nextProps.pages.activePostIndex) {
      this.setState({
        editingStartTime: false,
        editingEndTime: false
      })
    }

    if (this.props.getAllHashtags.getAllHashtags !== nextProps.getAllHashtags.getAllHashtags) {
      const arr = nextProps.getAllHashtags.getAllHashtags.map(hashtag => {
        return {
          id: hashtag.id,
          text: hashtag.name
        }
      })

      this.setState({
        suggestions: arr
      })
    }
  }

  generateDropdown (days, startDay) {
    let arr = []
    for (var i = 1; i <= days; i++) {
      if (i >= startDay) {
        arr.push({value: i, label: 'Day ' + i})
      }
    }
    return arr
  }

  render () {
    const {title, textContent, eventType, googlePlaceData, startTime, endTime, startDay, endDay, changesMade, days} = this.props.page
    const post = this.props.pages.pagesArr[this.props.pages.activePostIndex]
    if (post && post.type === 'BlogHeading') return null
    if (this.props.pages.activePostIndex === 'fin') return null
    return (
      <div style={{left: '60vw', width: '40vw', display: 'inline-block', verticalAlign: 'top', position: 'relative', backgroundColor: 'white', padding: '16px 24px', fontSize: '13px', minHeight: 'calc(100vh - 60px)'}}>
        {this.props.pages.activePostIndex === 'home' && <React.Fragment>
          <label style={{margin: '8px 0'}}>Blog Title</label>
          <input type='text' style={{width: '100%', padding: '8px'}} value={title} onChange={(e) => this.props.updateActivePage('title', e.target.value)} />
        </React.Fragment>}
        {this.props.pages.activePostIndex !== 'home' &&
        <React.Fragment>
          <label style={{margin: '8px 0'}}>{eventType ? 'Event Info' : 'Location'}</label>
          <div style={{position: 'relative'}}>
            {/* <input type='text' style={{width: eventType ? '80%' : '100%', padding: '8px'}} />
            {eventType && <input type='text' style={{width: '20%', padding: '8px'}} />} */}
            <LocationSearch blogEditor selectLocation={location => this.selectLocation(location)} placeholder={'Location'} currentLocation={googlePlaceData} eventType={eventType} />
            {eventType && <React.Fragment>
              <Select
                placeholder='Start Day'
                value={startDay && startDay.value}
                onChange={(e) => {
                  this.props.updateActivePage('startDay', e)
                  if (endDay && e.value > endDay.value) {
                    this.props.updateActivePage('endDay', e)
                  }
                }}
                options={
                [...Array(this.props.blogDays)].map((day, i) => {
                  return (
                    {value: i + 1, label: 'Day ' + (i + 1)}
                  )
                })}
              />
              <Select
                placeholder='End Day'
                value={endDay && endDay.value}
                onChange={(e) => this.props.updateActivePage('endDay', e)}
                options={
                this.generateDropdown(this.props.blogDays, startDay ? startDay.value : 0)}
              />
              {/* <select onChange={(e) => this.props.updateActivePage('startDay', e.target.value)} className='editorDayDropdown' value={startDay} style={{width: '65px', padding: '8px', marginLeft: '8px', backgroundColor: 'white'}} onBlur={(e) => this.setState({editingStartDay: false})}>
                <option value='' />
                {[...Array(this.props.blogDays)].map((day, i) => {
                  return (
                    <option key={i} value={i + 1}>Day {i + 1}</option>
                  )
                })}
              </select> */}
              {/* <span style={{padding: '3px'}}>to</span>
              <select onChange={(e) => this.props.updateActivePage('endDay', e.target.value)} className='editorDayDropdown' value={endDay} style={{width: '65px', padding: '8px', backgroundColor: 'white'}} onBlur={(e) => this.setState({editingEndDay: false})}>
                <option value='' />
                {[...Array(this.props.blogDays)].map((day, i) => {
                  return (
                    <option key={i} value={i + 1}>Day {i + 1}</option>
                  )
                })}
              </select> */}
              {!this.props.page.startTime && !this.state.editingStartTime && <input className='editorTimeInput' type='text' placeholder='Start Time' style={{width: '76px', fontSize: '13px', padding: '8px', marginLeft: '8px', textAlign: 'center'}} onFocus={(e) => {
                this.setState({editingStartTime: true})
              }} />}
              {(this.props.page.startTime || this.state.editingStartTime) && <input autoFocus={!this.props.page.startTime} type='time' style={{width: '76px', fontSize: '13px', padding: '8px', marginLeft: '8px', textAlign: 'center', verticalAlign: 'top'}} value={startTime} onChange={(e) => this.props.updateActivePage('startTime', e.target.value)} onBlur={(e) => {
                this.setState({editingStartTime: false})
              }} />}
              {!this.props.page.endTime && !this.state.editingEndTime && <input className='editorTimeInput' type='text' placeholder='End Time' style={{width: '76px', fontSize: '13px', padding: '8px', marginLeft: '8px', textAlign: 'center'}} onFocus={(e) => {
                this.setState({editingEndTime: true})
              }} />}
              {(this.props.page.endTime || this.state.editingEndTime) && <input autoFocus={!this.props.page.endTime} type='time' style={{width: '76px', fontSize: '13px', padding: '8px', marginLeft: '8px', textAlign: 'center', verticalAlign: 'top'}} value={endTime} onChange={(e) => this.props.updateActivePage('endTime', e.target.value)} onBlur={(e) => {
                this.setState({editingEndTime: false})
              }} />}
            </React.Fragment>}
          </div>
        </React.Fragment>}
        <label style={{margin: '8px 0'}}>Content</label>
        {/* <textarea rows={10} style={{width: '100%', padding: '8px'}} value={textContent} onChange={(e) => this.props.updateActivePage('textContent', e.target.value)} /> */}
        {/* <input className='hashtagInput' type='text' placeholder='Add hashtags to get discovered by others' style={{width: '100%', padding: '8px', margin: '8px 0'}} /> */}
        <div style={{padding: '8px', minHeight: '100px', border: '1px solid rgba(60, 58, 68, 0.2)', cursor: 'text'}} onClick={this.focus}>
          <Editor
            editorState={textContent}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => { this.editor = element }}
          />
          <InlineToolbar />
        </div>
        <label style={{margin: '8px 0'}}>Tags</label>
        <div style={{marginBottom: '40px'}}>
          <div>
            <ReactTags autofocus={false} suggestions={this.state.suggestions} delimiters={[32, 13, 9]} inline={false} placeholder={'Add tags to get discovered by others'} tags={this.props.page.hashtags} handleDelete={(i, e) => this.handleHashtagDelete(i, e)} handleAddition={(tag) => this.handleHashtagAddition(tag)} />
          </div>
          {this.props.pages.activePostIndex === 'home' &&
          <div>
            <label style={{margin: '8px 0'}}>No. of Days</label>
            <input type='number' step={1} style={{width: '20%', padding: '8px', margin: '8px'}} min={0} value={days} onChange={(e) => this.props.updateActivePage('days', e.target.value)} />
          </div>}
        </div>
        <div style={{position: 'absolute', marginTop: '8px', bottom: '24px', right: '24px'}}>
          <button disabled={!changesMade} style={{opacity: changesMade ? '1.0' : '0.5'}} onClick={() => this.handleSave(this.props.page.type)}>Save Changes</button>
          <button disabled={!changesMade} style={{opacity: changesMade ? '1.0' : '0.5'}} onClick={() => this.discardChanges()}>Discard Changes</button>
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
    },
    initializeActivePage: (page) => {
      dispatch(initializeActivePage(page))
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
  graphql(getAllHashtags, { name: 'getAllHashtags' }),
  graphql(queryBlog, { ...{name: 'queryBlog'}, ...options }),
  graphql(updateBlog, { name: 'updateBlog' }),
  graphql(updatePost, { name: 'updatePost' }),
  graphql(updateMultiplePosts, { name: 'updateMultiplePosts' })
)(EditorTextContent))
