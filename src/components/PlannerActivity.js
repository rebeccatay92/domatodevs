import React, { Component } from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, addActivity, plannerActivityHoverOverActivity } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { gql, graphql } from 'react-apollo'

let mousePosition = {y: 0}

const plannerActivitySource = {
  beginDrag (props) {
    return {
      id: props.activity.id,
      name: props.activity.name,
      location: props.activity.location,
      draggable: props.draggable
    }
  },
  endDrag (props, monitor) {
    if (!monitor.didDrop()) {
      props.addActivityToBucket(props.activity)
    }
  },
  canDrag (props) {
    if (props.draggable) return true
    else return false
  }
}

const plannerActivityTarget = {
  hover (props, monitor, component) {
    // Check whether object is dragging down or up
    const clientOffset = monitor.getClientOffset()
    let lastActivity
    lastActivity = clientOffset.y > mousePosition.y ? -1 : props.index - 1
    mousePosition = clientOffset
    if (monitor.getItemType() === 'activity') props.hoverOverActivity(props.isLast && props.index > 0 ? lastActivity : props.index, props.activity.date)
    else if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(props.isLast && props.index > 0 ? lastActivity : props.index, monitor.getItem(), props.activity.date)
  },
  drop (props, monitor) {
    let newActivity = Object.assign(monitor.getItem(), {date: props.activity.date})
    props.addActivity(newActivity, (props.index + 1) ? props.index : 'none')
    if (monitor.getItemType() === 'activity') {
      props.deleteActivityFromBucket(monitor.getItem())
    }
  }
}

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  }
}

class PlannerActivity extends Component {
  constructor (props) {
    super(props)

    this.state = {
      creatingActivity: false,
      name: '',
      LocationId: ''
    }
  }
  render () {
    const { connectDropTarget, connectDragSource, isOver } = this.props
    let dragBox = (
      <h4 style={{textAlign: 'center', fontStyle: 'italic'}}>Drag Activities Here or Click to Add new Activity</h4>
    )
    if (this.state.creatingActivity) {
      dragBox = (
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <label style={{display: 'inline-block', width: '14%'}}>Activity Name: </label>
          <input style={{width: '85%'}} value={this.state.activityName} onChange={(e) => this.handleChange(e)} name='name' />
          <label style={{display: 'inline-block', width: '14%'}}>Location: </label>
          <input style={{width: '85%'}} value={this.state.activityLocation} onChange={(e) => this.handleChange(e)} name='LocationId' />
          <input type='submit' value='submit' />
          <button onClick={(e) => {
            e.preventDefault()
            this.setState({creatingActivity: false})
          }}>cancel</button>
        </form>
      )
    }
    if (!(this.props.index + 1)) {
      return connectDropTarget(
        <div onClick={() => this.state.creatingActivity || this.setState({creatingActivity: true})} style={{border: '1px dashed black', height: '10vh', backgroundColor: isOver ? 'yellow' : 'white'}}>
          {dragBox}
        </div>
      )
    }
    return connectDragSource(connectDropTarget(<div style={{ cursor: this.props.draggable ? 'move' : 'default', height: '10vh', border: this.props.activity.id ? '1px solid white' : '1px dashed black', backgroundColor: this.props.activity.id ? 'white' : 'yellow', lineHeight: '0.5em' }} key={this.props.activity.id}>
      <h4>{this.props.activity.name}</h4>
      <p>{this.props.activity.location.name}</p>
      {/* {
        !this.props.activity.id ||
        <button style={{marginBottom: '1vh'}} onClick={() => this.props.handleClick(this.props.activity)}>Remove</button>
      } */}
    </div>))
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({
      creatingActivity: false
    })
    this.props.mutate({
      variables: {
        name: this.state.name,
        date: this.props.activity.date,
        LocationId: this.state.LocationId,
        ItineraryId: this.props.itineraryId
      },
      refetchQueries: [{
        query: gql`
          query queryItinerary($id: ID!) {
            findItinerary(id: $id){
              startDate
              endDate
              name
              activities {
                id
                name
                location {
                  name
                }
                date
              }
            }
          }`,
        variables: { id: this.props.itineraryId }
      }]
    })
  }

  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hoverOverActivity: (index, date) => {
      dispatch(hoverOverActivity(index, date))
    },
    addActivity: (activity, index) => {
      dispatch(addActivity(activity, index))
    },
    deleteActivityFromBucket: (activity) => {
      dispatch(deleteActivityFromBucket(activity))
    },
    plannerActivityHoverOverActivity: (index, activity, date) => {
      dispatch(plannerActivityHoverOverActivity(index, activity, date))
    },
    addActivityToBucket: (activity) => {
      dispatch(addActivityToBucket(activity))
    }
  }
}

const createActivity = gql`
  mutation createActivity($name: String!, $date: Int!, $LocationId: ID!, $ItineraryId: ID!) {
    createActivity(name: $name, date: $date, LocationId: $LocationId, ItineraryId: $ItineraryId) {
      id
    }
  }
`

export default connect(null, mapDispatchToProps)(graphql(createActivity)(DragSource('plannerActivity', plannerActivitySource, collectSource)(DropTarget(['activity', 'plannerActivity'], plannerActivityTarget, collectTarget)(PlannerActivity))))