import { coreColors, coreFonts } from './cores.js'

const accountTabContainer = {
  width: '100%',
  height: 'calc(100vh - 108px)',
  boxSizing: 'border-box'
}

const leftColumnContainer = {
  display: 'inline-block',
  width: '167px',
  height: 'calc(100vh - 108px)',
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
  height: 'calc(100vh - 108px)',
  boxSizing: 'border-box',
  paddingLeft: '24px'
}

/* ----------------------------- */

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
  borderLeft: `4px solid ${coreColors.blackSolid}`
}

/* ----------------------------- */
const headerText = {
  ...coreFonts.garamondRegular,
  color: coreColors.blackSolid,
  fontSize: '18px',
  margin: '24px 0 0 0'
}

const nameInputField = {
  ...coreFonts.garamondRegular,
  color: coreColors.blackSolid,
  fontSize: '18px',
  lineHeight: '41px',
  height: '41px',
  width: '340px',
  padding: '8px',
  marginTop: '8px'
}

const countryDropdown = {
  ...coreFonts.garamondRegular,
  color: coreColors.blackSolid,
  background: coreColors.whiteSolid,
  fontSize: '18px',
  lineHeight: '41px',
  height: '41px',
  width: '340px',
  border: 'none',
  outline: `1px solid ${coreColors.black03}`,
  padding: '8px',
  marginTop: '8px'
}

/* ----------------------------- */

const saveButton = {
  ...coreFonts.garamondRegular,
  fontSize: '18px',
  background: coreColors.whiteSolid,
  marginTop: '24px',
  display: 'block'
}

const deleteButton = {
  ...saveButton
}

const changePasswordButton = {
  ...coreFonts.garamondRegular,
  fontSize: '18px',
  lineHeight: '41px',
  height: '41px',
  marginTop: '8px',
  border: 'none',
  outline: `1px solid ${coreColors.black03}`,
  background: 'rgb(185, 255, 131)'
}

/* ----------------------------- */
export const AccountTabStyles = {
  accountTabContainer,
  // left column
  leftColumnContainer,
  leftColumnRightBorderDiv,
  unclickedTab,
  clickedTab,
  // right column
  rightColumnContainer,
  headerText,
  nameInputField,
  countryDropdown,
  saveButton,
  deleteButton,
  changePasswordButton
}
