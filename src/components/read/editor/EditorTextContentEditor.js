import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'

import Editor from 'draft-js-plugins-editor'
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'
import { EditorState, convertToRaw } from 'draft-js'
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton
} from 'draft-js-buttons'

import { updateActivePage } from '../../../actions/blogEditorActivePageActions'

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

class EditorTextContentEditor extends Component {
  constructor (props) {
    super(props)

    // this.state = {
    //   editorState: EditorState.createEmpty()
    // }

    this.onChange = (editorState) => {
      // console.log(convertToRaw(editorState.getCurrentContent()))
      this.props.updateActivePage('textContent', editorState)
      // this.setState({editorState: editorState})
    }

    this.focus = () => {
      this.editor.focus()
    }
  }

  render () {
    const { textContent } = this.props.page
    return (
      <div style={{padding: '8px', minHeight: '100px', border: '1px solid rgba(60, 58, 68, 0.2)', cursor: 'text'}} onClick={this.focus}>
        <Editor
          editorState={textContent}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.editor = element }}
        />
        <InlineToolbar />
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorTextContentEditor)
