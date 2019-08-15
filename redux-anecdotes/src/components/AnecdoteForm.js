import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {

  const addNootti = async(event) => {
    event.preventDefault()
    if(event.target.nootti.value === '') return
    const content = event.target.nootti.value
    event.target.nootti.value = ''
    props.createAnecdote(content)
    props.setNotification(`you added '${content}'`, 3)
  }
  
  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={(event) => addNootti(event)}>
        <div><input name="nootti"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default connect(
  null, { createAnecdote, setNotification }
)(AnecdoteForm)