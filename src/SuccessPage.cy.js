import React from 'react'
import SuccessPage from './SuccessPage'

describe('<SuccessPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SuccessPage />)
  })
})