import { coreColors, coreFonts } from './cores.js'

// NEEDS RADIUM? YES.

/* ----------------------------- */
const mediaConsoleGrayTint = {
  backgroundColor: 'rgba(180, 180, 180, 0.5)',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  zIndex: 999,
  overflow: 'auto',
  maxHeight: '100vh',
  maxWidth: '100vw'
}

const mediaConsoleContainer = {
  marginLeft: 'calc((100vw - 1138px)/2)',
  top: '10vh',
  width: '1138px',
  height: '744px',
  background: coreColors.whiteSolid,
  boxSizing: 'border-box',
  boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)',
  display: 'inline-flex'
}

const closeConsoleIcon = {
  position: 'fixed',
  top: '10vh',
  left: 'calc((100vw - 1134px)/2 - 50px)',
  fontSize: '36px',
  cursor: 'pointer'
}
/* ----------------------------- */

const leftColumnContainer = {
  width: '274px',
  height: '100%',
  background: coreColors.greenSolid,
  paddingTop: '24px',
  paddingBottom: '24px',
  color: coreColors.whiteSolid
}

const topSectionContainer = {
  width: '274px',
  height: '324px',
  padding: 0,
  margin: 0
}

const albumListHeaderContainer = {
  display: 'flex',
  height: '29px',
  width: '100%',
  paddingLeft: '16px',
  marginBottom: '8px'
}

const albumListHeaderText = {
  ...coreFonts.robotoLight,
  fontSize: '24px',
  lineHeight: '29px'
}

const addAlbumIcon = {
  marginLeft: '10px',
  cursor: 'pointer',
  lineHeight: '29px'
}

/* ----------------------------- */

const albumListContainer = {
  width: 'calc(100% - 8px)',
  height: '287px',
  paddingRight: '16px', // 16px to right edge of column
  marginLeft: '8px', // 8px to left edge of column
  boxSizing: 'border-box',
  overflow: 'scroll',
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-start'
}

const unfocusedAlbumDiv = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  marginTop: '8px',
  marginBottom: '8px',
  paddingLeft: '4px',
  minHeight: '15px',
  borderLeft: '4px solid transparent'
}

const focusedAlbumDiv = {
  ...unfocusedAlbumDiv,
  borderLeft: `4px solid ${coreColors.whiteSolid}`
}

/* ----------------------------- */

const albumNameText = {
  ...coreFonts.robotoLight,
  fontSize: '13px',
  lineHeight: '15px',
  width: 'auto',
  padding: '0',
  margin: '0'
}

const albumNameLine = {
  flexGrow: '1',
  color: coreColors.white03,
  margin: '0 5px 0 5px'
}

/* ----------------------------- */

const leftColumnHorizontalRule = {
  margin: '0px 16px 0px 16px',
  color: coreColors.white03
}

const albumInfoContainer = {
  width: '100%',
  height: '372px',
  padding: '24px 16px 0 16px'
}

const albumInfoInputFieldLabel = {
  width: '100%',
  margin: 0,
  padding: 0
}

const albumInfoHeader = {
  ...coreFonts.robotoRegular,
  margin: 0,
  padding: 0,
  fontSize: '13px',
  lineHeight: '15px',
  color: coreColors.whiteSolid
}

const albumInfoInputField = {
  ...coreFonts.robotoLight,
  margin: '16px 0 16px 0',
  padding: '8px',
  fontSize: '13px',
  lineHeight: '15px',
  color: 'rgba(60, 58, 68, 0.7)',
  width: '100%',
  height: '31px'
}

const albumInfoTextArea = {
  ...coreFonts.robotoLight,
  color: coreColors.black07,
  margin: '16px 0 16px 0',
  padding: '8px',
  fontSize: '13px',
  width: '100%',
  height: '121px',
  lineHeight: '18px',
  resize: 'none'
}

const albumInfoButton = {
  ...coreFonts.robotoLight,
  fontSize: '13px',
  lineHeight: '15px',
  color: coreColors.white03,
  background: 'none',
  float: 'right',
  marginLeft: '8px',
  cursor: 'pointer',
  ':hover': {
    color: coreColors.whiteSolid
  }
}

/* ----------------------------- */
const rightColumnContainer = {
  width: '864px',
  height: '100%'
}

const thumbnailsSectionContainer = {
  display: 'inline-flex',
  flexFlow: 'row wrap',
  alignContent: 'flex-start',
  width: '100%',
  height: '696px',
  boxSizing: 'border-box',
  paddingLeft: '12px', // half of 24px gutter
  paddingTop: '12px',
  overflowY: 'scroll'
}

const addMediumContainer = {
  position: 'relative',
  width: '256px',
  height: '144px',
  margin: '12px',
  display: 'flex',
  justifyContent: 'space-between'
}

const addMediumButton = {
  width: '45%',
  height: '100%',
  border: `2px solid ${coreColors.black03}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  ':hover': {
    border: `2px solid ${coreColors.black07}`
  }
}

const addMediumIcon = {
  color: coreColors.black07,
  fontSize: '32px'
}

const addMediumButtonText = {
  ...coreFonts.robotoRegular,
  color: coreColors.black07,
  height: '30px',
  lineHeight: '15px',
  fontSize: '13px',
  width: '100%'
}

/* ----------------------------- */
const addYoutubeContainer = {
  position: 'relative',
  width: '256px',
  height: '144px',
  margin: '12px',
  border: `2px solid ${coreColors.black03}`
}

/* ----------------------------- */

const thumbnailContainer = {
  position: 'relative',
  width: '256px',
  height: '144px',
  margin: '12px'
}

const imageThumbnail = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
}

const checkboxContainer = {
  position: 'absolute',
  right: '8px',
  top: '8px',
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  background: coreColors.black07,
  border: `2px solid ${coreColors.whiteSolid}`,
  cursor: 'pointer'
}

const checkboxTicked = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: coreColors.greenSolid,
  opacity: '1'
}

const checkboxUnticked = {
  ...checkboxTicked,
  opacity: 0
}
/* ----------------------------- */

const actionBarContainer = {
  width: '100%',
  height: '47px',
  padding: '0 24px 0 24px'
}

const actionBar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  padding: '0 8px 0 8px',
  borderTop: `2px solid ${coreColors.black03}`
}

const actionBarLeftButtons = {
  ...coreFonts.robotoLight,
  color: coreColors.black07,
  fontSize: '13px',
  padding: 0,
  border: 'none',
  outline: 'none',
  marginRight: '24px',
  ':hover': {
    color: coreColors.blackSolid
  }
}
const actionBarRightButtons = {
  ...actionBarLeftButtons,
  marginRight: 0,
  marginLeft: '24px'
}

/* ----------------------------- */
const shiftAlbumDropdown = {
  position: 'absolute',
  bottom: '30px',
  width: '200px',
  height: '200px',
  overflowY: 'scroll',
  background: coreColors.whiteSolid,
  border: `1px solid ${coreColors.black07}`
}
/* ----------------------------- */
export const MediaConsoleStyles = {
  mediaConsoleGrayTint, // gray tint which cover entire screen
  mediaConsoleContainer,
  closeConsoleIcon,
  // left column
  leftColumnContainer,
  // top section is album list header + list
  topSectionContainer,
  albumListHeaderContainer,
  albumListHeaderText,
  addAlbumIcon,
  // albums list
  albumListContainer,
  unfocusedAlbumDiv, // has borderleft line
  focusedAlbumDiv,
  albumNameText,
  albumNameLine,
  // hr divides top n bottom sections
  leftColumnHorizontalRule,
  // bottom section  - album info
  albumInfoContainer,
  albumInfoInputFieldLabel,
  albumInfoHeader,
  albumInfoInputField,
  albumInfoTextArea,
  albumInfoButton,
  // right column
  rightColumnContainer,
  // thumbnails section
  thumbnailsSectionContainer,
  addMediumContainer, // container for 2 buttons
  addMediumButton,
  addMediumIcon,
  addMediumButtonText,
  addYoutubeContainer,
  // thumbnail and checkbox
  thumbnailContainer,
  imageThumbnail,
  checkboxContainer,
  checkboxTicked,
  checkboxUnticked,
  // action bar
  actionBarContainer, // has padding
  actionBar,
  actionBarLeftButtons,
  actionBarRightButtons,
  // shift album dropdown
  shiftAlbumDropdown
}
