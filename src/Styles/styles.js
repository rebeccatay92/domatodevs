export const primaryColor = '#ed685a'
const mainFontColor = '#3C3A44'
const secondaryFontColor = '#9FACBC'
const backgroundColor = '#FAFAFA'

// Planner Table dimensions
const tableWidth = 962

// Create event form dimensions
const totalWidth = 1221
const totalHeight = 755
const leftPanelWidth = 755
// const totalWidth = 1415
// const totalHeight = 919
// const leftPanelWidth = 919
const rightPanelWidth = totalWidth - leftPanelWidth
  // updated form dimensions. 1415 x 919 for events, 1290 x 869 flights. left panel 919 x 919 for event, 494 x 868 flight
// PlannerPage.js styles
export const plannerPageStyles = {
  fontFamily: '\'Roboto\', sans-serif',
  color: mainFontColor,
  margin: '50px auto 0 auto',
  width: '1300px',
  fontWeight: '300'
}

export const plannerStyle = {display: 'inline-block', width: '1106px', verticalAlign: 'top'}
export const bucketStyle = {display: 'inline-block', width: '335px', verticalAlign: 'top', padding: '14px 0 0 14px'}
export const bucketTitleStyle = {textAlign: 'left', fontSize: '24px'}

// Planner.js styles
export const plannerContainerStyle = {
  width: '100%',
  borderRight: '1px solid rgba(159, 172, 188, 0.5)'
}

export const plannerHeaderContainerStyle = {marginLeft: '89px'}
export const itineraryNameStyle = {fontSize: '56px', fontWeight: '100', margin: '10px 10px -20px 0', display: 'inline-block', maxWidth: '50%'}
export const itineraryDescStyle = {fontSize: '16px', fontWeight: '100', color: secondaryFontColor, marginBottom: '15px'}
export const itineraryDatesStyle = {
  display: 'inline-block',
  color: primaryColor,
  fontSize: '16px',
  margin: 0,
  position: 'relative',
  top: '-5px'
}
export const plannerHeaderIconsContainerStyle = {position: 'relative', height: '6vh', margin: '10px 0 2vh 0'}
export const userIconsContainerStyle = {position: 'absolute', left: '0', top: '0'}
export const userIconStyle = {height: '30px', width: '30px', margin: '0 0 10px 10px'}
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
  fontSize: '20px',
  color: 'white'
}
export const plannerHeaderRightBarIconContainerStyle = {backgroundColor: 'black', display: 'inline-block', marginLeft: '5px', height: '28px', padding: '4px', width: '28px', borderRadius: '15%', cursor: 'pointer', opacity: '0.8', ':hover': {opacity: '1.0'}}

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
  backgroundColor: primaryColor
}

export const dateTableStyle = {width: '1052px'}
export const timelineColumnStyle = (clash, allDay) => {
  return {width: '89px', position: 'relative', borderTop: clash || allDay ? '1px hidden ' + backgroundColor : 'none', borderBottom: clash || allDay ? '1px hidden ' + backgroundColor : 'none', borderLeft: clash || allDay ? '1px hidden ' + backgroundColor : 'none', borderRight: clash ? '1px solid red' : (allDay ? '1px solid #438496' : 'none')}
}
export const timelineTitleStyle = headerSticky => {
  return {...{position: headerSticky ? 'fixed' : 'absolute', top: headerSticky ? '55px' : '0px', textAlign: 'center', width: 'inherit', zIndex: 10, backgroundColor: backgroundColor}, ...headerSticky && {backfaceVisibility: 'hidden'}}
}
export const timelineTitleWordStyle = {fontSize: '16px', display: 'block', color: primaryColor}
export const dayTimelineStyle = sticky => {
  return {...{position: sticky ? 'fixed' : 'absolute', textAlign: 'center', width: 'inherit', top: sticky ? '110px' : '60px', zIndex: 1, padding: '20px 0'}, ...sticky && {backfaceVisibility: 'hidden'}}
}
export const dayTimelineContainerStyle = (isDateOnScreen, isOver) => {
  return {paddingLeft: '5px', display: 'inline-block', borderLeft: isDateOnScreen ? '5px solid ' + primaryColor : 0, marginLeft: isDateOnScreen ? '-10px' : '-5px', outline: isOver ? '1px solid ' + primaryColor : 'none'}
}
export const dayTimelineWordStyle = isDateOnScreen => {
  return {fontSize: '16px', color: primaryColor, display: 'inline-block', cursor: 'pointer'}
}
export const addDayButtonStyle = {padding: '1px 3px', display: 'inline-block', marginTop: '10px', cursor: 'pointer'}
export const addDayWordStyle = {fontSize: '24px', color: primaryColor, display: 'inline-block'}
export const dateTableFirstHeaderStyle = {width: `${0.4 * tableWidth}px`}
export const headerDayStyle = {display: 'inline-block', margin: '0 0 0 15px', fontSize: '24px', fontWeight: '300'}
export const headerDateStyle = {fontSize: '16px', display: 'inline-block', position: 'relative', top: '-2px', marginLeft: '8px', fontWeight: '300'}
export const dateTableOtherHeaderStyle = {width: `${0.2 * tableWidth}px`}
export const dateTableHorizontalLineStyle = isFirstDay => {
  return {marginBottom: '2vh', marginTop: isFirstDay ? '0' : '1vh', width: tableWidth + 'px', height: '8px', boxShadow: '0 8px 10px -10px #86919f inset'}
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
  return { lineHeight: '100%', padding: '1vh 0', minHeight: '12vh', position: 'relative', border: !activity.modelId ? '1px dotted black' : (draggedItem.type === activity.type && draggedItem.modelId === activity.modelId ? 'none' : 'none') }
}
export const expandedEventPropStyle = {color: mainFontColor}
export const expandedEventValueStyle = {color: mainFontColor}
export const createEventTextStyle = {marginTop: 0, fontSize: '16px', color: primaryColor, display: 'inline-block'}
export const activityIconStyle = {
  fontSize: '24px',
  marginRight: '1vw',
  WebkitTextStroke: '1px ' + secondaryFontColor,
  WebkitTextFillColor: '#FAFAFA',
  cursor: 'pointer',
  ':hover': {
    WebkitTextStroke: '1px ' + primaryColor
  }
}
export const createEventBoxStyle = {}
export const createEventPickOneStyle = {fontSize: '16px', color: secondaryFontColor, position: 'relative', top: '-6px'}
export const createEventBoxContainerStyle = {
  margin: '3vh 0 3vh 1vw',
  height: '50px',
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
  padding: '1vh'
}

export const tableOptionStyle = {
  display: 'block',
  fontSize: '16px',
  textAlign: 'left',
  color: mainFontColor,
  margin: '1vh 0',
  cursor: 'pointer'
}

export const tableHeadingStyle = {
  width: `${0.2 * 962}px`,
  textAlign: 'center',
  position: 'relative',
  backgroundColor: backgroundColor,
  ':hover': {
    backgroundColor: '#f0f0f0'
  }
}

// PlannerColumnValue.js styles
export const columnValueContainerStyle = (columnType) => {
  return {position: 'relative', textAlign: columnType === 'Notes' ? 'left' : 'center', verticalAlign: 'top', color: mainFontColor, fontSize: '16px', paddingTop: '12px', width: `${0.2 * 962}px`}
}

export const expandEventIconStyle = {position: 'absolute', right: '0px', top: '10px', ':hover': {color: primaryColor}}

// Create Event Form Styles
export const createEventFormContainerStyle = {backgroundColor: 'transparent', position: 'fixed', left: `calc(50% - ${totalWidth / 2}px)`, top: `calc(50% - ${totalHeight / 2}px)`, width: totalWidth + 'px', height: totalHeight + 'px', zIndex: 999, color: 'white'}

// export const createEventFormBoxShadow = {boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)', height: '90%'}
// height 100% since attachments is no longer at bottom
export const createEventFormBoxShadow = {boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)', height: '100%'}
export const createEventFormLeftPanelStyle = (url, type) => {
  return {backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: type === 'flight' ? rightPanelWidth + 'px' : leftPanelWidth + 'px', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative'}
}
export const createEventFormRightPanelStyle = (type) => {
  return {width: type === 'flight' ? leftPanelWidth + 'px' : rightPanelWidth + 'px', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative', color: mainFontColor}
}
export const greyTintStyle = {position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, background: '#6D6A7A', opacity: '0.75'}
export const eventDescriptionStyle = (bgImage) => {
  return {background: bgImage ? 'none' : 'inherit', outline: 'none', border: 'none', textAlign: 'center', fontSize: '24px', fontWeight: '300', width: 'fit-content', minWidth: '100px', position: 'relative', ':hover': { boxShadow: '0 1px 0 #FFF' }}
}

export const eventWarningStyle = (bgImage) => {
  return {background: bgImage ? 'none' : 'inherit', outline: 'none', border: 'none', textAlign: 'center', fontSize: '24px', fontWeight: '300', width: 'fit-content', minWidth: '100px', position: 'relative'}
}

export const foodTypeStyle = (bgImage) => {
  return {background: bgImage ? 'none' : 'inherit', outline: 'none', border: 'none', textAlign: 'center', fontSize: '24px', fontWeight: '300', width: '150px', position: 'relative', ':hover': { boxShadow: '0 1px 0 #FFF' }}
}
export const eventDescContainerStyle = {margin: '0 auto', width: 'fit-content'}
export const foodTypeContainerStyle = {width: '150px', margin: '0 auto'}
export const attachmentsStyle = {width: '100%', background: 'transparent', display: 'inline-block', marginTop: '5px'}

export const bookingNotesContainerStyle = {width: '100%', height: '100%', background: 'white', padding: '5%'}

// LocationSelection.js styles
export const locationSelectionInputStyle = (marginTop, type) => {
  return {fontSize: '48px', textAlign: 'center', width: type === 'flight' ? '' : leftPanelWidth / 2 + 'px', background: 'inherit', border: 'none', outline: 'none', fontWeight: '100', resize: 'none', marginTop: marginTop + 'px', maxHeight: '195px', ':hover': { boxShadow: '0 1px 0 #FFF' }}
}
export const locationDropdownStyle = {width: leftPanelWidth / 2 + 'px', maxHeight: '250px', overflowY: 'auto', background: 'white', position: 'absolute', zIndex: '2', left: `calc(50% - ${(leftPanelWidth / 2) / 2}px)`}

export const locationMapContainerStyle = {backgroundColor: 'white', position: 'fixed', left: `calc(50% - ${totalWidth / 2}px)`, top: `calc(50% - ${totalHeight / 2}px)`, width: leftPanelWidth + 'px', height: (0.9 * totalHeight) + 'px', zIndex: 999, color: 'black'}

// POSITION FIXED, MOVE FURTHER RIGHT
export const flightMapContainerStyle = {backgroundColor: 'white', position: 'fixed', right: 'calc(50% - 610.5px)', top: `calc(50% - ${totalHeight / 2}px)`, width: leftPanelWidth + 'px', height: (0.9 * totalHeight) + 'px', zIndex: 999, color: 'black'}

// DateTimePicker.js styles
export const dateTimePickerContainerStyle = {width: '415px', margin: '45px auto 0 auto', textAlign: 'center', height: '131px', position: 'relative', whiteSpace: 'noWrap'}

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
export const createFlightButtonStyle = {backgroundColor: primaryColor, border: 'none'}

// FlightSearchResults.js styles
export const searchResultsTableStyle = {width: '100%', color: secondaryFontColor, fontSize: '16px', cursor: 'default'}

// AirportResults.js styles
export const intuitiveDropdownStyle = {width: '282.5px', maxHeight: '250px', overflowY: 'auto', background: 'white', position: 'absolute', zIndex: '2', display: 'block'}

// mapPlanner/SideBarDate.js styles
export const mapPlannerDateTableHorizontalLineStyle = isFirstDay => {
  return {marginLeft: '10px', marginBottom: '2vh', marginTop: isFirstDay ? '0' : '1vh', width: 'calc(93% - 20px)', height: '8px', boxShadow: '0 8px 10px -10px #86919f inset'}
}

// mapPlanner/SideBarEvent.js styles
export const mapPlannerEventBoxStyle = (activity, minHeight, draggedItem) => {
  return { lineHeight: '100%', marginRight: '7%', padding: '1vh 0', minHeight: '12vh', position: 'relative', border: !activity.modelId ? '1px dotted black' : (draggedItem.type === activity.type && draggedItem.modelId === activity.modelId ? 'none' : 'none') }
}
