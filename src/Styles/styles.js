export const primaryColor = '#ed685a'
const mainFontColor = '#3C3A44'
const borderColor = 'rgba(60, 58, 68, 0.2)'
const secondaryFontColor = '#9FACBC'
const backgroundColor = '#FFFFFF'

// Planner Table dimensions
const tableWidth = 1274

// Create event form dimensions
const totalWidth = 1007
const totalHeight = 858
const leftPanelWidth = 535
// const totalWidth = 1415
// const totalHeight = 919
// const leftPanelWidth = 919
const rightPanelWidth = totalWidth - leftPanelWidth
  // updated form dimensions. 1415 x 919 for events, 1290 x 869 flights. left panel 919 x 919 for event, 494 x 868 flight
// PlannerPage.js styles
export const plannerPageStyles = {
  fontFamily: '\'Roboto\', sans-serif',
  color: mainFontColor,
  margin: '50px auto',
  width: '1274px',
  fontWeight: '300'
}

export const plannerStyle = {display: 'inline-block', width: '1274px', verticalAlign: 'top'}

// Planner.js styles
export const plannerContainerStyle = {
  width: '100%'
}

export const plannerHeaderContainerStyle = {marginLeft: '109px', width: tableWidth + 'px'}
export const itineraryNameStyle = {fontSize: '56px', fontWeight: '100', margin: '10px 2px 0 0', display: 'inline-block', maxWidth: '78%', verticalAlign: 'middle'}
export const itineraryDescStyle = {fontSize: '16px', color: mainFontColor, verticalAlign: 'middle', opacity: '0.7'}
export const itineraryDatesStyle = {
  display: 'inline-block',
  color: primaryColor,
  fontSize: '16px',
  margin: 0,
  position: 'relative',
  top: '-15px',
  padding: '8px',
  verticalAlign: 'bottom'
}
export const plannerHeaderIconsContainerStyle = {position: 'relative', height: '38px', margin: '0 0 32px 4px'}
export const userIconsContainerStyle = {position: 'absolute', left: '0', top: '0'}
export const userIconStyle = {height: '30px', width: '30px', margin: '4px', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}
export const plannerIconStyle = {
  fontSize: '24px',
  margin: '0 0 0 2vh',
  color: primaryColor,
  opacity: '0.6',
  cursor: 'pointer',
  ':hover': {
    opacity: '1'
  }
}
export const plannerHeaderRightBarIconStyle = {
  fontSize: '18px',
  color: 'white'
}
export const plannerHeaderRightBarIconContainerStyle = {backgroundColor: 'black', display: 'inline-block', marginLeft: '5px', height: '31px', padding: '6px', width: '31px', borderRadius: '3px', cursor: 'pointer', opacity: '0.8', ':hover': {opacity: '1.0'}}

// Date.js styles
export const timelineStyle = {
  width: '1.5px',
  height: '100%',
  display: 'inline-block',
  position: 'absolute',
  top: '0',
  left: '50%',
  bottom: '0',
  margin: '0 auto',
  backgroundColor: 'rgba(237, 104, 90, 0.28)'
}

export const dateTableStyle = {tableLayout: 'auto', width: '1152px'}
export const timelineColumnStyle = (clash, allDay) => {
  return {width: '110px', position: 'relative', borderTop: clash || allDay ? '1px hidden ' + backgroundColor : 'none', borderBottom: clash || allDay ? '1px hidden ' + backgroundColor : 'none', borderLeft: clash || allDay ? '1px hidden ' + backgroundColor : 'none', borderRight: clash ? '1px solid red' : (allDay ? '1px solid #438496' : 'none')}
}
export const timelineTitleStyle = headerSticky => {
  return {...{position: headerSticky ? 'fixed' : 'absolute', top: headerSticky ? '55px' : '-12px', textAlign: 'center', width: '110px', zIndex: 10, backgroundColor: backgroundColor}, ...headerSticky && {backfaceVisibility: 'hidden'}}
}
export const timelineTitleWordStyle = {fontSize: '16px', display: 'block', color: primaryColor, fontWeight: '300', borderBottom: '1px solid rgba(237, 104, 90, 0.28)', width: 'min-content', margin: '0 auto'}
export const dayTimelineStyle = sticky => {
  return {...{position: sticky ? 'fixed' : 'absolute', textAlign: 'center', width: 'inherit', top: sticky ? '110px' : '42px', zIndex: 1, padding: '32px 0 0 0'}, ...sticky && {backfaceVisibility: 'hidden'}}
}
export const dayTimelineContainerStyle = (isDateOnScreen, isOver) => {
  return {paddingLeft: '8px', height: '19px', display: 'inline-block', borderLeft: isDateOnScreen ? '4px solid ' + primaryColor : 0, marginLeft: isDateOnScreen ? '-12px' : '-8px', outline: isOver ? '1px solid ' + primaryColor : 'none'}
}
export const dayTimelineWordStyle = isDateOnScreen => {
  return {fontSize: '16px', color: primaryColor, display: 'inline-block', cursor: 'pointer', fontWeight: '300'}
}
export const addDayButtonStyle = {display: 'inline-block', cursor: 'pointer'}
export const addDayWordStyle = {fontSize: '24px', color: primaryColor, display: 'inline-block', opacity: '0.3'}
export const dateTableFirstHeaderStyle = {tableLayout: 'fixed', width: '366px', height: '43px', position: 'relative'}
export const headerDayStyle = {display: 'inline-block', margin: '0 0 0 16px', fontSize: '24px', fontWeight: '300'}
export const headerDateStyle = {fontSize: '16px', display: 'inline-block', position: 'relative', top: '-2px', marginLeft: '8px', fontWeight: '300'}
export const dateTableOtherHeaderStyle = {width: '214px'}
export const dateTableHorizontalLineStyle = isFirstDay => {
  return {marginBottom: '0', marginTop: isFirstDay ? '0' : '1vh', width: '100%', borderTop: '1px solid rgba(60, 58, 68, 0.2)'}
}

// PlannerActivity.js styles
export const eventBoxStyle = (draggable, activityId, clash, allDay) => {
  return {
    cursor: draggable ? 'move' : 'default',
    border: activityId ? (clash ? '1px solid red' : (allDay ? '1px solid #438496' : 'none')) : 'none',
    position: 'relative'
  }
}
export const eventBoxFirstColumnStyle = (activity, minHeight, draggedItem) => {
  return { lineHeight: '100%', padding: '0', minHeight: '80px', position: 'relative', border: !activity.id ? '1px dotted black' : (draggedItem.type === activity.type && draggedItem.id === activity.id ? 'none' : 'none') }
}
export const expandedEventPropStyle = {color: mainFontColor}
export const expandedEventValueStyle = {color: mainFontColor}
export const createEventTextStyle = {marginTop: 0, fontSize: '16px', color: primaryColor, display: 'inline-block', cursor: 'pointer'}
export const activityIconStyle = {
  fontSize: '19px',
  marginRight: '24px',
  WebkitTextStroke: '1px rgba(60, 58, 68, 0.7)',
  WebkitTextFillColor: '#FFFFFF',
  cursor: 'pointer',
  ':hover': {
    WebkitTextStroke: '1px ' + primaryColor
  }
}
export const createEventBoxStyle = {height: '80px', padding: '30px 0', marginLeft: '1px'}
export const createEventPickOneStyle = {fontSize: '13px', color: 'rgba(60, 58, 68, 0.7)', position: 'relative', top: '-4px'}
export const createEventBoxContainerStyle = {
  margin: '0 0 0 16px',
  width: '1007px',
  position: 'relative'
}
export const plannerBlurredBackgroundStyle = {position: 'fixed', bottom: 0, right: 0, top: 0, left: 0, backgroundColor: 'rgba(250, 250, 250, 1)', zIndex: 555}
// Expanded Event Styles
export const expandedEventIconsBoxStyle = {position: 'absolute', display: 'inline-block', right: '0', top: '0', margin: '10px 10px 0 0', color: secondaryFontColor, zIndex: 1}
export const expandedEventIconsStyle = {cursor: 'pointer', ':hover': {color: primaryColor}}
export const expandedEventBoxStyle = {width: '100%', height: '362px', boxShadow: '0px 2px 5px 2px rgba(0, 0, 0, .2)', overflow: 'auto', position: 'relative'}
export const expandedEventBoxImageContainerStyle = {display: 'inline-block', height: '220px', lineHeight: '220px', width: '330px', margin: 'calc(181px - 110px) 25px', backgroundColor: 'black', textAlign: 'center'}
export const expandedEventBoxImageStyle = {maxHeight: '100%', maxWidth: '100%'}
export const expandedEventBoxTextBoxStyle = {display: 'inline-block', verticalAlign: 'top', margin: '16px 0', width: 'calc(100% - 380px)', position: 'relative', fontSize: '13px'}

// PlannerColumnHeader.js styles
export const tableDropdownStyle = {
  display: 'inline-block',
  fontSize: '16px',
  color: mainFontColor,
  cursor: 'pointer',
  height: '35px',
  margin: '8px 0 0 0',
  padding: '8px 0',
  fontWeight: '300'
}

export const tableOptionStyle = {
  display: 'block',
  fontSize: '16px',
  textAlign: 'center',
  color: mainFontColor,
  padding: '8px 0',
  cursor: 'pointer',
  fontWeight: '300',
  width: '100%'
}

export const tableHeadingStyle = {
  width: '214px',
  textAlign: 'center',
  position: 'relative',
  backgroundColor: backgroundColor,
  ':hover': {
    backgroundColor: 'rgba(245, 245, 245, 0.6)'
  }
}

// PlannerColumnValue.js styles
export const columnValueContainerStyle = (columnType) => {
  return {position: 'relative', textAlign: columnType === 'Notes' ? 'left' : 'center', color: mainFontColor, fontSize: '16px', width: '214px'}
}

export const expandEventIconStyle = {color: 'rgba(60, 58, 68, 0.7)', cursor: 'pointer', position: 'absolute', right: '0px', top: '28px', height: '14px', ':hover': {color: primaryColor}}

export const createEventFormContainerStyle = {display: 'block', width: totalWidth + 'px', height: totalHeight + 'px', color: 'white', margin: `calc(50vh - ${totalHeight / 2}px) auto`}

export const createFlightFormContainerStyle = {display: 'block', width: '1290px', height: '869px', color: 'white', margin: `calc(50vh - ${869 / 2}px) auto`}

export const createEventFormBoxShadow = {boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)', height: '100%'}
export const createEventFormLeftPanelStyle = (url, type) => {
  return {backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: type === 'flight' ? '494px' : leftPanelWidth + 'px', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative', padding: '32px'}
}
export const createEventFormRightPanelStyle = (type) => {
  return {width: type === 'flight' ? '796px' : rightPanelWidth + 'px', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative', color: mainFontColor}
}
export const greyTintStyle = {position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, background: '#3C3A44', opacity: '0.7'}
export const eventDescriptionStyle = (bgImage) => {
  return {background: bgImage ? 'rgba(245, 245, 245, 0.1)' : 'inherit', outline: 'none', border: 'none', fontSize: '16px', fontWeight: '300', width: '471px', position: 'relative', height: '35px', padding: '8px', borderRadius: '2px', borderBottom: '1px solid white'}
}

export const eventWarningStyle = (bgImage) => {
  return {background: bgImage ? 'none' : 'inherit', outline: 'none', border: 'none', textAlign: 'center', fontSize: '24px', fontWeight: '300', width: 'fit-content', minWidth: '100px', position: 'relative'}
}

export const foodTypeStyle = (bgImage) => {
  return {background: bgImage ? 'none' : 'inherit', outline: 'none', border: 'none', textAlign: 'center', fontSize: '24px', fontWeight: '300', width: '150px', position: 'relative', ':hover': { boxShadow: '0 1px 0 #FFF' }}
}
export const eventDescContainerStyle = {width: 'fit-content', marginTop: '16px', position: 'relative'}
export const foodTypeContainerStyle = {width: '150px', margin: '0 auto'}
export const attachmentsStyle = {width: '100%', background: 'transparent', display: 'inline-block', marginTop: '5px'}

export const bookingNotesContainerStyle = {width: '100%', height: '100%', background: 'white', padding: '24px'}

// LocationSelection.js styles
export const locationSelectionInputStyle = (marginTop, type) => {
  return {fontSize: '16px', width: type === 'flight' ? '100%' : '471px', background: 'rgba(245, 245, 245, 0.1)', border: 'none', borderBottom: '1px solid white', outline: 'none', height: '35px', padding: '8px', fontWeight: '300', borderRadius: '2px'}
}
export const locationDropdownStyle = {width: '471px', maxHeight: '250px', overflowY: 'auto', background: 'white', position: 'absolute', zIndex: '2'}

// export const locationMapContainerStyle = {backgroundColor: 'white', position: 'fixed', left: `calc(50% - ${totalWidth / 2}px)`, top: `calc(50% - ${totalHeight / 2}px)`, width: leftPanelWidth + 'px', height: totalHeight + 'px', zIndex: 999, color: 'black'}

export const locationMapContainerStyle = {position: 'absolute', width: leftPanelWidth + 'px', height: totalHeight + 'px', color: 'black'}

// POSITION FIXED, MOVE FURTHER RIGHT
// export const flightMapContainerStyle = {backgroundColor: 'white', position: 'fixed', right: 'calc(50% - 398px - 247px)', top: `calc(50% - 434.5px)`, width: '796px', height: '869px', zIndex: 999, color: 'black'}

export const flightMapContainerStyle = {position: 'absolute', width: '796px', height: '869px', color: 'black', zIndex: '1000', left: 494 - 32 + 'px', top: '-221.67px'}

// DateTimePicker.js styles
export const dateTimePickerContainerStyle = {position: 'relative', whiteSpace: 'noWrap', marginTop: '16px'}

// BookingDetails.js styles
export const labelStyle = {
  fontSize: '13px',
  display: 'block',
  margin: '5px',
  lineHeight: '26px'
}

// Attachments.js styles
export const attachmentStyle = {margin: '1px 6px 0 0', verticalAlign: 'top', display: 'inline-block', position: 'relative', ':hover': {color: primaryColor}, border: '1px solid ' + secondaryFontColor, height: '50px', cursor: 'pointer', borderRadius: '5px', width: '15%', backgroundColor: backgroundColor}
// export const addAttachmentBtnStyle = {color: secondaryFontColor, margin: '10px 5px 0 0', cursor: 'pointer', fontSize: '30px', ':hover': {color: primaryColor}}
export const addAttachmentBtnStyle = {color: secondaryFontColor, margin: '10px 5px 0 0', cursor: 'pointer', fontSize: '30px', ':hover': {color: primaryColor}}
export const attachmentNameStyle = {fontSize: '13px', color: secondaryFontColor, fontWeight: 'bold', position: 'relative', top: '-6px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}
export const attachmentSizeStyle = {fontSize: '13px', color: secondaryFontColor, fontWeight: 'bold', position: 'relative', top: '-10px'}
export const attachmentDeleteBtnStyle = (hovering, i) => {
  return {color: secondaryFontColor, cursor: 'pointer', opacity: hovering === i ? '1.0' : 0, ':hover': {color: primaryColor}}
}
export const pdfLogoStyle = {color: 'rgb(237, 15, 135)', fontSize: '50px', marginRight: '2px'}
export const imageLogoStyle = {color: 'rgb(43, 201, 217)', fontSize: '50px'}

// Create Flight Form Button
export const createFlightButtonStyle = {backgroundColor: '#df386b', border: '1px solid #df386b', color: 'white', height: '35px', width: '72px', fontSize: '16px', textAlign: 'center', borderRadius: '2px', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)', fontWeight: 300}

// FlightSearchResults.js styles
export const searchResultsTableStyle = {width: '749px', color: mainFontColor, fontSize: '16px', cursor: 'default', borderCollapse: 'separate', borderSpacing: '0 8px', padding: '0 0px 0 2px', tableLayout: 'fixed', fontWeight: 300}

// AirportResults.js styles
export const intuitiveDropdownStyle = {width: '282.5px', maxHeight: '250px', overflowY: 'auto', background: 'white', position: 'absolute', zIndex: '2', display: 'block', border: '1px solid ' + borderColor, borderTop: 'none', top: '42px'}

// mapPlanner/SideBarDate.js styles
export const mapPlannerDateTableHorizontalLineStyle = isFirstDay => {
  return {marginLeft: '10px', marginBottom: '2vh', marginTop: isFirstDay ? '0' : '1vh', width: 'calc(93% - 20px)', height: '8px', boxShadow: '0 8px 10px -10px #86919f inset'}
}

// mapPlanner/SideBarEvent.js styles
export const mapPlannerEventBoxStyle = (activity, minHeight, draggedItem) => {
  return { lineHeight: '100%', marginRight: '7%', padding: '0', minHeight: '80px', position: 'relative', border: !activity.modelId ? '1px dotted black' : (draggedItem.type === activity.type && draggedItem.modelId === activity.modelId ? 'none' : 'none') }
}

// ReadPage.js styles
export const readPageStyle = {
  fontFamily: '\'EB Garamond\', serif',
  color: mainFontColor,
  width: '1920px',
  fontWeight: '400'
  // marginTop: '55px'
}
