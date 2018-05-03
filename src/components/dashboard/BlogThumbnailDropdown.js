import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Radium from 'radium'
import { BlogThumbnailDropdownStyles as styles } from '../../Styles/BlogThumbnailDropdownStyles'

class BlogThumbnailDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleClickOutside () {
    this.props.toggleBlogThumbnailDropdown()
  }

  onMenuSelect () {
    this.props.toggleBlogThumbnailDropdown()
  }

  render () {
    return (
      <div style={styles.dropdownContainer}>
        <div key={'dropdownOption1'} style={styles.dropdownOptionContainer} onClick={() => this.onMenuSelect()}>
          <span style={styles.dropdownOption}>OPTION 1</span>
        </div>
        <div key={'dropdownOption2'} style={styles.dropdownOptionContainer} onClick={() => this.onMenuSelect()}>
          <span style={styles.dropdownOption}>OPTION 2</span>
        </div>
        <div key={'dropdownOption3'} style={styles.dropdownOptionContainer} onClick={() => this.onMenuSelect()}>
          <span style={styles.dropdownOption}>OPTION 3</span>
        </div>
        <div key={'dropdownOption4'} style={styles.dropdownOptionContainer} onClick={() => this.onMenuSelect()}>
          <span style={styles.dropdownOption}>OPTION 4</span>
        </div>
      </div>
    )
  }
}

export default onClickOutside(Radium(BlogThumbnailDropdown))
