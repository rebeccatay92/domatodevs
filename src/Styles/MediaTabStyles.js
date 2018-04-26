import { coreColors, coreFonts } from './cores.js'

const mediaTabContainer = {
  width: '100%',
  height: 'calc(100vh - 270px)',
  boxSizing: 'border-box'
}

const leftColumnNonSticky = {
  display: 'inline-block',
  width: '265px',
  // height: 'calc(100vh - 110px)',
  height: 'calc(100vh - 52px - 56px)', // minus navbar and horizontal tabs
  verticalAlign: 'top',
  paddingTop: '24px',
  paddingBottom: '24px',
  paddingLeft: '2px',
  background: coreColors.whiteSolid,
  position: 'relative',
  top: '0',
  left: '0'
}

const leftColumnSticky = {
  ...leftColumnNonSticky,
  position: 'fixed',
  // top: '106px' // original
  top: '108px', // 52px nav + 56px horizontal tabs
  left: 'calc((100vw - 1265px)/2)'
}

// div that holds the tabs and right border line
const leftColumnRightBorderDiv = {
  height: '100%',
  width: '100%',
  borderRight: `1px solid ${coreColors.black03}`
}
/* ----------------------------- */

const albumListHeaderContainer = {
  display: 'flex',
  alignItems: 'center',
  height: '24px',
  cursor: 'pointer'
}

const albumListHeaderText = {
  ...coreFonts.garamondRegular,
  fontSize: '24px',
  lineHeight: '24px',
  paddingLeft: '8px' // 4px borderLeft line + 4px paddingLeft before text
}

const albumListHeaderIcon = {
  color: coreColors.black03,
  marginLeft: '10px'
}

/* ----------------------------- */

const albumListContainer = {
  width: '100%',
  height: 'calc(100% - 24px)',
  overflow: 'scroll'
}

const unclickedTab = {
  ...coreFonts.garamondRegular,
  color: coreColors.blackSolid,
  fontSize: '16px',
  lineHeight: '21px',
  height: '21px',
  paddingLeft: '4px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginTop: '24px',
  borderLeft: '4px solid transparent'
}
const clickedTab = {
  ...unclickedTab,
  borderLeft: `4px solid ${coreColors.blackSolid}`
}
/* ----------------------------- */
const rightColumn = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignContent: 'flex-start',
  verticalAlign: 'top',
  width: 'calc(100% - 265px)',
  // height: '100%', // 100% of mediaTabContainer
  height: 'calc(100vh - 52px - 56px)', // minus height of nav bar + horizontal tabs bar
  boxSizing: 'border-box',
  paddingLeft: '24px',
  paddingTop: '24px'
}

const mediaThumbnailContainer = {
  width: '256px',
  height: '144px',
  margin: '0 24px 24px 0'
}

const imageThumbnail = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
}
/* ----------------------------- */

export const MediaTabStyles = {
  mediaTabContainer,
  // normal vs sticky left sidebar
  leftColumnNonSticky,
  leftColumnSticky,
  // div that holds the album names, and right border line. 2px away from left edge
  leftColumnRightBorderDiv,
  // album list header that clicks to open media console
  albumListHeaderContainer,
  albumListHeaderText,
  albumListHeaderIcon,
  // albums list
  albumListContainer,
  unclickedTab,
  clickedTab,
  // right column
  rightColumn,
  mediaThumbnailContainer,
  imageThumbnail
}
