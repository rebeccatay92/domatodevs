// export const coreColors = {
//   whiteSolid: 'rgba(255, 255, 255, 1)',
//   white07: 'rgba(255, 255, 255, 0.7)',
//   white03: 'rgba(255, 255, 255, 0.3)',
//   blackSolid: 'rgba(60, 58, 68, 1)',
//   black07: 'rgba(60, 58, 68, 0.7)',
//   black03: 'rgba(60, 58, 68, 0.3)',
//   black01: 'rgba(60, 58, 68, 0.1)',
//   pinkSolid: 'rgba(223, 56, 107, 1)',
//   greenSolid: 'rgba(67, 132, 150, 1)'
// }

// export const coreFonts = {
//   robotoThin: {fontFamily: 'Roboto, sans-serif', fontWeight: '100'},
//   robotoLight: {fontFamily: 'Roboto, sans-serif', fontWeight: '300'},
//   robotoRegular: {fontFamily: 'Roboto, sans-serif', fontWeight: '400'},
//   garamondLight: {fontfamily: 'EB Garamond, serif', fontWeight: '300'},
//   garamondRegular: {fontFamily: 'EB Garamond, serif', fontWeight: '400'}
// }

import { coreColors, coreFonts } from './cores.js'
// NEEDS RADIUM? YES
/* ----------------------------- */
const unclickedTab = {
  ...coreFonts.robotoLight,
  color: coreColors.black03,
  cursor: 'pointer',
  height: '100%',
  fontSize: '24px',
  marginTop: '1px',
  marginRight: '40px',
  paddingTop: '16px',
  paddingBottom: '16px'
}
const clickedTab = {
  ...unclickedTab,
  color: coreColors.pinkSolid,
  borderBottom: `3px solid ${coreColors.pinkSolid}`
}
const tabsBarNonSticky = {
  boxSizing: 'border-box',
  borderBottom: `1px solid ${coreColors.black03}`,
  display: 'flex',
  justifyContent: 'flex-start',
  height: '56px',
  background: coreColors.whiteSolid,
  position: 'relative',
  top: '0',
  width: '100%'
}
const tabsBarSticky = {
  ...tabsBarNonSticky,
  position: 'fixed',
  top: '50px',
  width: '1265px'
}
/* ----------------------------- */
const profilePicContainer = {
  position: 'relative',
  width: '97px',
  height: '97px'
}
const profilePicTint = {
  background: coreColors.white03,
  width: '97px',
  height: '97px',
  borderRadius: '50%',
  position: 'absolute',
  top: '0',
  left: '0',
  textAlign: 'center',
  padding: '30px 0 30px 0',
  cursor: 'pointer',
  opacity: 0,
  ':hover': {opacity: '1'}
}
const profilePicTintText = {
  fontSize: '16px',
  textShadow: `2px 2px 0 ${coreColors.whiteSolid}`
}
const profilePic = {
  borderRadius: '50%',
  display: 'inline-block'
}
/* ----------------------------- */
const bioSectionContainer = {
  width: 'calc(100% - 97px)',
  height: '97px',
  padding: '0 20px 0 20px'
}
const username = {
  ...coreFonts.robotoThin,
  color: coreColors.black07,
  fontSize: '55px',
  lineHeight: '66px',
  margin: 0
}

const bioTextContainer = {display: 'inline-flex', justifyContent: 'flex-start', alignItems: 'center', width: 'auto'}

const bioText = {
  ...coreFonts.garamondRegular,
  color: coreColors.blackSolid,
  fontSize: '24px',
  lineHeight: '31px',
  margin: '0'
}

const bioTextAreaContainer = {display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}

const bioTextArea = {
  ...coreFonts.garamondRegular,
  color: coreColors.blackSolid,
  fontSize: '24px',
  lineHeight: '31px',
  height: '31px',
  margin: '0',
  padding: '0',
  width: '100%',
  resize: 'none'
}

/* ----------------------------- */
// EXPORT OBJ TO REDUCE NUMBER OF NAMED IMPORTS {FOO, BAR, ETC}
export const userDashboardStyles = {
  // HORIZONTAL MENU TABS
  tabsBarNonSticky,
  tabsBarSticky,
  unclickedTab,
  clickedTab,
  // PROFILE PIC CONTAINER, IMG, TINT
  profilePicContainer,
  profilePicTint,
  profilePicTintText,
  profilePic,
  // BIO SECTION
  bioSectionContainer, // container for username + bio
  username,
  bioTextContainer, // display version container
  bioText,
  bioTextAreaContainer, // editable textarea container
  bioTextArea
}
/* ----------------------------- */
