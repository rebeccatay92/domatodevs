import { coreColors, coreFonts } from './cores.js'
// NEEDS RADIUM ?  YES

const navBarContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'fixed',
  top: '0',
  width: '100%',
  height: '52px',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${coreColors.black03}`,
  boxShadow: '0px -2px 5px 2px rgba(0, 0, 0, .2)',
  background: 'white',
  zIndex: '200',
  backfaceVisibility: 'hidden'
}

/* ----------------------------- */
const alignLeftContainer = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  marginLeft: '32px'
}

const hamburgerIcon = {
  fontSize: '32px',
  cursor: 'pointer',
  color: coreColors.black07,
  marginRight: '100px' // gap between hamburger and logo
}

const marcoLogo = {
  height: '32px',
  width: '32px',
  cursor: 'pointer'
}

const searchInputField = {
  ...coreFonts.robotoRegular,
  fontSize: '16px',
  lineHeight: '32px',
  padding: '8px',
  height: '32px',
  width: '300px',
  marginLeft: '32px',
  color: coreColors.black07,
  border: `1px solid ${coreColors.black03}`
}

const searchIconContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '32px',
  height: '32px',
  background: 'rgb(248, 248, 248)',
  border: 'none',
  outline: `1px solid ${coreColors.black03}`,
  ':hover': {
    background: 'rgb(240, 240, 240)'
  }
}

const searchIcon = {
  fontSize: '24px',
  cursor: 'pointer',
  color: coreColors.black07
}

/* ----------------------------- */
const alignRightContainer = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  marginRight: '32px'
}

const logInlogOutText = {
  ...coreFonts.robotoRegular,
  color: coreColors.black07,
  fontSize: '16px',
  cursor: 'pointer'
}

const profilePic = {
  width: '35px',
  height: '35px',
  background: 'black',
  borderRadius: '50%',
  marginLeft: '10px'
}

/* ----------------------------- */
export const NavBarStyles = {
  navBarContainer,
  // align left is hamburger icon, logo, search
  alignLeftContainer,
  hamburgerIcon,
  marcoLogo,
  searchInputField,
  searchIconContainer,
  searchIcon,
  // align right is profile pic, login/logout
  alignRightContainer,
  logInlogOutText,
  profilePic
}
