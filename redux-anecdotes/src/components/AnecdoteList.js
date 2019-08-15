import React from 'react'
import { connect } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const doFiltering = (anecd, myfilter) => {
  console.log('doFiltering: '+anecd+' filter: '+myfilter)

  return myfilter==='' ? true : anecd.toLowerCase().includes(myfilter.toLowerCase())
}

const AnecdoteList = (props) => {

  const voteme = (anecdote) => {
  props.vote(anecdote)
  props.setNotification(`you voted '${anecdote.content}'`, 10)
}

  return(
    <div>
      {props.anecdotesToShow.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => voteme(anecdote)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

const notesToShow = ({ anecdotes, filter }) => {
  return anecdotes
    .filter(anecd => doFiltering(anecd.content, filter))
    .sort((a, b) => b.votes-a.votes)
}

const mapStateToProps = (state) => {
  return {
    anecdotesToShow: notesToShow(state),
  }
}

const mapDispatchToProps = {
  vote, setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)
