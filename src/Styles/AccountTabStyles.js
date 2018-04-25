import { coreColors, coreFonts } from './cores.js'

const leftColumnContainer = {
  display: 'inline-block',
  width: '167px',
  height: 'calc(100vh - 110px)',
  paddingTop: '24px',
  paddingBottom: '24px',
  paddingLeft: '2px'
}
const leftColumnRightBorderDiv = {
  width: '100%',
  height: '100%',
  borderRight: `1px solid ${coreColors.black03}`
}

const rightColumnContainer = {
  display: 'inline-block',
  verticalAlign: 'top',
  width: 'calc(100% - 167px)',
  height: 'calc(100vh - 110px)',
  boxSizing: 'border-box',
  paddingLeft: '24px'
}

const unclickedTab = {
  ...coreFonts.garamondRegular,
  lineHeight: '23px',
  fontSize: '18px',
  cursor: 'pointer',
  margin: '0px 0px 24px 0px',
  paddingLeft: '4px',
  borderLeft: '4px solid transparent'
}
const clickedTab = {
  ...unclickedTab,
  borderLeft: `4px solid ${coreFonts.blackSolid}`
}

export const AccountTabStyles = {
  // left column
  leftColumnContainer,
  leftColumnRightBorderDiv,
  unclickedTab,
  clickedTab,
  // right column
  rightColumnContainer
}
