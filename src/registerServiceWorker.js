/* eslint-disable no-console */

// const BASE_URL = "http://localhost:3000" 
// const BASE_URL = "https://data-analysis-1.bioacoustics.ai"
// const BASE_URL = "https://clinic.bioacoustics.ai"

const BASE_URL = "https://ade.bioacoustics.ai"

import { register } from 'register-service-worker'

// if (process.env.NODE_ENV === 'production') {
  
  register(`${BASE_URL}/service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
// }

