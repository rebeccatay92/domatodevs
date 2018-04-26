import { coreColors, coreFonts } from './cores.js'

// NEEDS RADIUM ? YES
/* ----------------------------- */
const navSideBarContainer = {
  display: 'flex',
  flexFlow: 'column nowrap',
  position: 'fixed',
  top: '52px',
  width: '220px',
  height: 'calc(100vh - 52px)',
  zIndex: '200',
  background: 'rgb(250, 250, 250)',
  borderRight: `1px solid ${coreColors.black03}`,
  overflowY: 'scroll'
}
/* ----------------------------- */
const navSection = {
  padding: '12px 0 12px 0',
  width: '100%'
}

const navLinkContainer = {
  display: 'flex',
  padding: '12px 24px 12px 24px',
  cursor: 'pointer',
  ':hover': {
    background: 'rgb(240, 240, 240)'
  },
  height: '40px',
  alignItems: 'center'
}

const navLinkIcon = {
  fontSize: '20px',
  marginRight: '25px',
  color: coreColors.black07
}

const navLinkText = {
  ...coreFonts.robotoRegular,
  color: coreColors.blackSolid,
  fontSize: '14px',
  lineHeight: '21px'
}

/* ----------------------------- */
const sectionDivider = {
  margin: '0 24px 0 24px',
  padding: 0
}

/* ----------------------------- */
const middleItinerarySection = {
  width: '100%',
  margin: '12px 0 12px 0'
}

const itineraryHeaderText = {
  ...coreFonts.robotoMedium, // follow youtube
  color: coreColors.black07,
  fontSize: '14px',
  margin: '0 24px 0 24px',
  lineHeight: '40px'
}

// const fixedHeightItineraryList = {
//   height: '280px', // 320px of youtube - the show more (40px)
//   overflow: 'hidden'
// }
//
// const expandedItineraryList = {
//
// }

const itineraryName = {
  ...coreFonts.robotoRegular,
  color: coreColors.blackSolid,
  fontSize: '14px',
  lineHeight: '21px'
}

/* ----------------------------- */


/* ----------------------------- */
export const NavSideBarStyles = {
  navSideBarContainer,
  // top nav section consists of main nav links
  navSection,
  // container for 1 icon + text
  navLinkContainer, // has hover color change
  navLinkIcon,
  navLinkText,
  // hr for dividing sections
  sectionDivider,
  // itinerary section
  middleItinerarySection,
  itineraryHeaderText,
  itineraryName
}
