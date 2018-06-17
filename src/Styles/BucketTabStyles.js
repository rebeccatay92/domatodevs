import { coreColors, coreFonts } from './cores'

const bucketTabContainer = {
  width: '100%',
  height: 'calc(100vh - 108px)',
  boxSizing: 'border-box'
}

/* ----------------------------- */

const leftColumnNonSticky = {
  display: 'inline-block',
  width: '265px',
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
  top: '108px', // 52px nav + 56px horizontal tabs
  left: 'calc((100vw - 1265px)/2)'
}

const countryListHeaderText = {
  ...coreFonts.garamondRegular,
  fontSize: '24px',
  lineHeight: '24px',
  paddingLeft: '8px', // 4px borderLeft line + 4px paddingLeft before text,
  margin: 0
}

const countryListContainer = {
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
  display: 'inline-block',
  verticalAlign: 'top',
  width: 'calc(100% - 265px)',
  // height: '100%', // 100% of mediaTabContainer
  height: 'calc(100vh - 52px - 56px)', // minus height of nav bar + horizontal tabs bar
  boxSizing: 'border-box'
}

const bucketContainer = {
  width: '100%',
  height: '100px',
  display: 'flex',
  alignItems: 'center'
}

export const BucketTabStyles = {
  bucketTabContainer,
  // left column
  leftColumnNonSticky,
  leftColumnSticky,
  countryListHeaderText,
  countryListContainer,
  unclickedTab,
  clickedTab,
  // main area
  rightColumn,
  bucketContainer
}
