import { coreColors, coreFonts } from './cores'

// sidebar container = tabs container (both bucket and event tab) + actual mainAreaContainer
const sidebarContainer = {
  zIndex: 11,
  // height depends on view height (mac is higher)
  height: 'calc(100vh - 52px - 51px)',
  // dont specify width. depends on whether sidebar is rendered or tabs only
  position: 'fixed',
  top: '52px',
  right: 0,
  display: 'flex'
}

/* ----------------------------- */

const tabsContainer = {
  position: 'fixed',
  right: 0, // or 344px
  top: '52px',
  zIndex: 12,
  width: '35px',
  height: '128px' // 2 tabs so 64x2
}

// only bucket tab should be visible if nothing has been clicked
// events tab only appears when event is clicked (always together with rest of sidebar) check redux.

const tabUnclicked = {
  zIndex: 10,
  width: '35px',
  height: '64px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  border: `1px solid ${coreColors.black03}`,
  background: 'rgb(245, 245, 245)'
}

const tabClicked = {
  ...tabUnclicked,
  zIndex: 12,
  border: '1px solid black',
  borderRight: '1px rgb(245, 245, 245)',
  position: 'relative',
  left: '1px'
}

const tabText = {
  ...coreFonts.robotoLight,
  color: coreColors.blackSolid,
  fontSize: '16px',
  margin: 0,
  transform: 'rotate(-90deg)'
}
/* ----------------------------- */

const mainAreaContainer = {
  zIndex: 11,
  width: '344px',
  height: '100%',
  background: 'rgb(245, 245, 245)',
  border: `1px solid ${coreColors.blackSolid}`,
  padding: '16px' // more padding else too close to edge
}

const sectionDivider = {
  margin: '8px 0 8px 0',
  border: `1px solid ${coreColors.black01}`
}

const minHeightSection = {
  width: '312px', // 320px - (16px padding *2)
  minHeight: '60px', // 25px label + 35px input field
  display: 'flex'
}

const iconSection = {
  height: '100%',
  width: '40px',
  display: 'flex',
  justifyContent: 'center'
}

const icon = {
  width: '24px',
  height: '24px',
  marginRight: '16px'
}

/* ----------------------------- */

const inputSection = {
  width: '272px', // 312px - 24px - 16px marginRight
  height: '100%'
}

const labelContainer = {
  width: '272px',
  margin: 0
}

const inputField = {
  width: '272px',
  height: '35px',
  ...coreFonts.robotoLight,
  fontSize: '16px',
  lineHeight: '24px',
  color: coreColors.blackSolid,
  outline: 'none',
  background: 'rgb(245, 245, 245)'
}

const dayDropdown = {
  width: '100px',
  height: '35px',
  ...coreFonts.robotoLight,
  fontSize: '16px',
  color: coreColors.blackSolid,
  background: 'rgb(245, 245, 245)',
  border: 'none',
  marginLeft: '-7px'
}

const timeInput = {
  height: '35px',
  ...coreFonts.robotoLight,
  fontSize: '16px',
  color: coreColors.blackSolid,
  background: 'rgb(245,245,245)',
  outline: 'none',
  margin: 0
}

const labelText = {
  display: 'block',
  ...coreFonts.robotoLight,
  fontSize: '14px',
  lineHeight: '24px',
  height: '24px',
  color: coreColors.black07
}

const addressText = {
  display: 'block',
  ...coreFonts.robotoLight,
  color: coreColors.blackSolid,
  fontSize: '16px',
  lineHeight: '24px'
}

// const attachFileLabelText = {
//   display: 'block',
//   ...coreFonts.robotoLight,
//   fontSize: '16px',
//   color: coreColors.blackSolid,
//   lineHeight: '24px',
//   height: '24px',
//   margin: 0
// }

/* ----------------------------- */
export const PlannerRightBarStyles = {
  sidebarContainer,
  tabsContainer,
  tabUnclicked,
  tabClicked,
  tabText,
  mainAreaContainer,
  sectionDivider,
  minHeightSection,
  iconSection,
  icon,
  inputSection,
  labelContainer,
  dayDropdown,
  timeInput,
  inputField,
  labelText,
  addressText
  // attachFileLabelText
}
