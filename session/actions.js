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
const { dispatch, getState } = require('../store')
const page = require('page')

exports.destroySession = function () {
  dispatch({
    type: DELETE_SESSION_PENDING
  })

  const sessionId = getState().session.id
  if (!sessionId) {
    return false
  }

  fetch(`/api/sessions/${sessionId}`, {
    method: 'delete',
    headers: {
      'Accept': 'application/json'
    }
  }).then(function (response) {
    if (response.ok) {
      dispatch({
        type: DELETE_SESSION_SUCCESSFUL
      })
      page('/login')
    }
  }).catch(function (error) {
    console.error('parsing failed', error)
    dispatch({
      type: DELETE_SESSION_ERROR,
      error
    })
  })
}

exports.loadSession = function (data) {
  const sessionId = getState().session.id
  if (!sessionId) {
    return false
  }

  dispatch({
    type: GET_SESSION_PENDING
  })

  fetch(`/api/sessions/${sessionId}`, {
    headers: {
      'Accept': 'application/json'
    //   'x-session-id': getState().session.id
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    if (response.ok) {
      response.json().then((json) => {
        dispatch({
          type: GET_SESSION_SUCCESSFUL,
          data: json.data
        })
      })
    } else {
      throw new Error('Session not found')
    }
  }).catch(function (error) {
    page('/login')
    dispatch({
      type: GET_SESSION_ERROR,
      error
    })
  })
}

exports.postSession = function (data) {
  dispatch({
    type: POST_SESSION_PENDING
  })

  fetch('/api/sessions', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    response.json().then((json) => {
      if (response.ok) {
        dispatch({
          type: POST_SESSION_SUCCESSFUL,
          response: json
        })
        page('/')
      } else {
        dispatch({
          type: POST_SESSION_ERROR,
          response: json
        })
      }
    })
  }).catch(function (error) {
    console.error('parsing failed', error)
  })
}
