import { coreColors, coreFonts } from './cores'

const popupContainer = {
  width: '300px'
}

/* ----------------------------- */

const popupCloseIcon = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  fontSize: '18px',
  cursor: 'pointer'
}

/* ----------------------------- */

const popupContentContainer = {
  width: '300px',
  border: `1px solid ${coreColors.pinkSolid}`,
  padding: '16px 16px 0 16px'
}

const popupContentHeader = {
  margin: '0 0 5px 0',
  ...coreFonts.robotoRegular,
  fontSize: '16px',
  color: coreColors.blackSolid
}

const popupContentText = {
  margin: '0 0 16px 0',
  ...coreFonts.robotoLight,
  fontSize: '16px',
  lineHeight: '24px',
  color: coreColors.blackSolid
}

/* ----------------------------- */

const popupSingleButtonWidthContainer = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '150px',
  height: '35px',
  border: `1px solid ${coreColors.pinkSolid}`,
  cursor: 'pointer'
}

const popupDoubleButtonWidthContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '300px',
  height: '35px',
  border: `1px solid ${coreColors.pinkSolid}`,
  cursor: 'pointer'
}

const popupButtonText = {
  ...coreFonts.robotoRegular,
  fontSize: '16px',
  color: coreColors.blackSolid
}

/* ----------------------------- */

export const PopupTemplateStyles = {
  popupContainer,
  popupCloseIcon,
  popupContentContainer,
  popupContentHeader,
  popupContentText,
  // popup action buttons
  popupSingleButtonWidthContainer,
  popupDoubleButtonWidthContainer,
  popupButtonText
}
