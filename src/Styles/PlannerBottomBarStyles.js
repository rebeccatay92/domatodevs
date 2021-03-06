import { coreColors, coreFonts } from './cores'

// NEEDS RADIUM ?  YES. ON HOVER
const plannerBottomBarContainer = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100vw',
  height: '51px',
  background: 'rgb(245, 245, 245)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backfaceVisibility: 'hidden'
}

const tabContainer = {
  position: 'relative',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...coreFonts.robotoRegular,
  color: coreColors.blackSolid,
  fontSize: '16px',
  padding: '0 20px',
  cursor: 'pointer',
  ':hover': {
    // fontWeight: 700,
    background: 'rgb(230, 230, 230)'
  }
}

export const PlannerBottomBarStyles = {
  plannerBottomBarContainer,
  tabContainer
}
