const {
  GET_SESSION_PENDING,
  GET_SESSION_SUCCESSFUL,
  GET_SESSION_ERROR,
  POST_SESSION_PENDING,
  POST_SESSION_SUCCESSFUL,
  POST_SESSION_ERROR,
  DELETE_SESSION_PENDING,
  DELETE_SESSION_SUCCESSFUL,
  DELETE_SESSION_ERROR
} = require('./constants')

const initialState = {
  data: {},
  id: window.localStorage.sessionId || null,
  isLoading: false,
  wasLoadedSuccessfully: false,
  isDeleting: false,
  getErrors: null,
  postErrors: {},
  deleteErrors: null
}

module.exports = function session (state = initialState, action) {
  switch (action.type) {

  case DELETE_SESSION_PENDING:
    window.localStorage.removeItem('sessionId')
    return Object.assign({}, state, {
      data: {},
      isDeleting: true,
      deleteErrors: null
    })

  case DELETE_SESSION_SUCCESSFUL:
    return Object.assign({}, state, {
      data: {},
      isDeleting: false,
      deleteErrors: null
    })

  case DELETE_SESSION_ERROR:
    return Object.assign({}, state, {
      data: {},
      isDeleting: false,
      deleteErrors: action.errors
    })

  case GET_SESSION_PENDING:
    return Object.assign({}, state, {
      data: {},
      isLoading: true,
      wasLoadedSuccessfully: false,
      getErrors: null
    })

  case GET_SESSION_SUCCESSFUL:
    return Object.assign({}, state, {
      data: action.data,
      id: action.data.id,
      isLoading: false,
      wasLoadedSuccessfully: true,
      getErrors: null
    })

  case GET_SESSION_ERROR:
    window.localStorage.clear()
    return Object.assign({}, state, {
      data: {},
      id: null,
      isLoading: false,
      wasLoadedSuccessfully: false,
      getErrors: action.errors
    })

  case POST_SESSION_PENDING:
    return Object.assign({}, state, {
      data: {},
      isLoading: true,
      wasLoadedSuccessfully: false,
      postErrors: {}
    })

  case POST_SESSION_SUCCESSFUL:
    window.localStorage.sessionId = action.response.data.id
    return Object.assign({}, state, {
      data: action.response.data,
      id: action.response.data.id,
      isLoading: false,
      wasLoadedSuccessfully: true,
      postErrors: {}
    })

  case POST_SESSION_ERROR:
    return Object.assign({}, state, {
      data: {},
      id: null,
      isLoading: false,
      wasLoadedSuccessfully: false,
      postErrors: action.response.errors
    })

  default:
    return state
  }
}
