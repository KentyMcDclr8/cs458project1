describe('template spec', () => {
  it('Entering to the Sun Page and Enable to GPS', () => {
    cy.visit('http://localhost:3000')
    cy.get("#email").type("name@mail.com")
    cy.get("#password").type("password")
    cy.get("#login").click()
  })
})

describe('template spec', () => {
  it('Invalid lat and lon', () => {
    cy.visit('http://localhost:3000')
    cy.get("#email").type("name@mail.com")
    cy.get("#password").type("password")
    cy.get("#login").click()
    cy.get("#sunCal").click()
    cy.get("#lat").type("500")
    cy.get("#lon").type("500")
    cy.get("#sunCal").click()
    cy.wait(5000)
  })
})

describe('template spec', () => {
  it('Valid lat and lon', () => {
    cy.visit('http://localhost:3000')
    cy.get("#email").type("name@mail.com")
    cy.get("#password").type("password")
    cy.get("#login").click()
    cy.get("#lat").type("50")
    cy.get("#lon").type("50")
    cy.get("#sunCal").click()
    cy.wait(5000)
  })
})

describe('template spec', () => {
  it('Mobile phones', () => {
    cy.visit('http://localhost:3000')
    cy.viewport("iphone-6")
    cy.get("#email").type("name@mail.com")
    cy.get("#password").type("password")
    cy.wait(5000)
    cy.get("#login").click()
    cy.viewport("samsung-s10")
    cy.get("#lat").type("50")
    cy.get("#lon").type("50")
    cy.get("#sunCal").click()
    cy.wait(5000)
  })
})

describe('template spec', () => {
  it('different Screen sizes', () => {
    cy.visit('http://localhost:3000')
    cy.viewport(300,300)
    cy.get("#email").type("name@mail.com")
    cy.get("#password").type("password")
    cy.wait(5000)
    cy.get("#login").click()
    cy.viewport(250,800)
    cy.get("#lat").type("50")
    cy.get("#lon").type("50")
    cy.get("#sunCal").click()
    cy.wait(5000)
  })
})