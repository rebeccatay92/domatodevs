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
  border: `1px solid transparent`,
  background: 'rgb(245, 245, 245)',
  boxShadow: '-2px 3px 10px rgba(0, 0 , 0, 0.16)'
}

const tabClicked = {
  ...tabUnclicked,
  width: '36px',
  zIndex: 12,
  border: `1px solid ${coreColors.black03}`,
  borderRight: '1px rgb(245, 245, 245)',
  position: 'relative'
}

const tabText = {
  ...coreFonts.robotoLight,
  color: coreColors.blackSolid,
  fontSize: '16px',
  margin: 0,
  transform: 'rotate(-90deg)'
}

/* ----------------------------- */
export const PlannerRightBarStyles = {
  sidebarContainer,
  tabsContainer,
  tabUnclicked,
  tabClicked,
  tabText
}
