// REWRITE VALIDATION. ONLY VALIDATE, DO NOT FIND ERROR ROWS

function createEventTimelineValidation (eventsArr, newEvent) {
  // from eventsArr, create an arr of ranges
  // activity/food/transport => <start time ---- end time>
  // lodging <start time - start time> <end time - end time> treated as 2 point events
  // flight => for each instance <start time --- end time>
  // start time / end time is relative to day 1 (eg day 2 is day 1 unix + day 1 time)
}

export default createEventTimelineValidation
