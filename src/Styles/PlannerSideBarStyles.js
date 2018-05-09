import { coreColors, coreFonts } from './cores'

// sidebar container = tabs container (both bucket and event tab) + actual mainAreaContainer
const sidebarContainer = {
  zIndex: 2,
  height: '872px',
  // dont specify width. depends on whether sidebar is rendered or tabs only
  position: 'fixed',
  top: '52px',
  right: 0,
  display: 'flex'
}

/* ----------------------------- */

const tabsContainer = {
  zIndex: 2,
  width: '35px',
  height: '128px' // 2 tabs so 64x2
}

// only bucket tab should be visible if nothing has been clicked
// events tab only appears when event is clicked (always together with rest of sidebar) check redux.

const tabUnclicked = {
  zIndex: 1,
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
  zIndex: 3,
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
  zIndex: 1,
  width: '344px', // entire content bar width
  height: '872px',
  background: 'rgb(245, 245, 245)',
  border: `1px solid ${coreColors.blackSolid}`,
  padding: '8px'
}

const sectionDivider = {
  margin: '0 0 0 40px',
  border: `1px solid ${coreColors.black01}`
}

const minHeightSection = {
  width: '328px', // 344px - 16px
  height: '64px',
  display: 'flex'
}

const iconSection = {
  height: '100%',
  width: '40px',
  // border: '1px solid red',
  display: 'flex',
  justifyContent: 'center'
}

const icon = {
  width: '24px',
  height: '24px',
  marginTop: '8px'
}

// const locationSection = {
//   ...minHeightSection,
//
// }
/* ----------------------------- */

const inputSection = {
  width: '288px', // 344px
  height: '100%'
}

const labelContainer = {
  width: '288px',
  margin: 0
}

const inputField = {
  width: '288px',
  height: '40px',
  ...coreFonts.robotoLight,
  fontSize: '16px',
  color: coreColors.blackSolid,
  outline: 'none',
  background: 'rgb(245, 245, 245)'
}

const labelText = {
  display: 'block',
  ...coreFonts.robotoLight,
  fontSize: '13px',
  lineHeight: '24px',
  height: '24px',
  color: coreColors.black07
}

const attachFileLabelText = {
  display: 'block',
  ...coreFonts.robotoLight,
  fontSize: '16px',
  color: coreColors.blackSolid,
  lineHeight: '40px',
  height: '40px'
}
/* ----------------------------- */
export const PlannerSideBarStyles = {
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
  inputField,
  labelText,
  attachFileLabelText
}
