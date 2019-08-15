import anecdoteService from '../services/anecdotes'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const objectify = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(objectify)

export const vote = (anecdote) => {
  console.log('vote '+ anecdote.content)
  anecdote.votes++
  return async dispatch => {
    const newAnecdote = await anecdoteService.update(anecdote.id, anecdote)

    dispatch({
      type: 'VOTE',
      data: anecdote.id
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'IMPORT',
      data: newAnecdote,
    })
  }
}

const anecdoteReducer = (state = [], action) => {
  console.log('anecdote state now: ', state)
  console.log('anecdote action', JSON.stringify(action))

  switch(action.type) {
  case 'VOTE':
    return state
  case 'CREATE':
    return [...state, objectify(action.data)]
  case 'IMPORT':
    return [...state, action.data]
  case 'IMPORT_ALL':
    return action.data
  default:
    return state
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'IMPORT_ALL',
      data: anecdotes,
    })
  }
}

export default anecdoteReducer