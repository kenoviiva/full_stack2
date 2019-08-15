const notificationReducer = (state = 'Simple test', action) => {

  switch (action.type) {
    case 'SET_MSG':
      return action.message
    default:
      return state
  }
}

export const setNotification = (message, seconds) => {
  console.log('setNotification '+message)
  return async dispatch => {
    dispatch({
      type: 'SET_MSG',
      message: message,
    })

    setTimeout(() => {
      dispatch({
        type: 'SET_MSG',
        message: '',
      })  
    }, seconds*1000)

}}

export default notificationReducer