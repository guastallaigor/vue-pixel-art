// https://docs.cypress.io/api/introduction/api.html

describe('When we go to the page and wants to paint a pikachu', () => {
  it('should be able to paint a pikachu', () => {
    const paint = (arrayPaint) => {
      for (var i = 1; i <= 256; i++) {
        if (arrayPaint.includes(i)) {
          cy.get(`${item}${i})`).click()
        }
      }
    }

    cy.viewport(1980, 1000)
    cy.visit('/')
    cy
      .title()
      .should('include', 'Vue Pixel Art')
    cy
      .get('#app')
      .should('be.visible')
    cy.contains('h1', 'Vue Pixel Art')
    cy
      .get('#size')
      .first()
      .clear()
      .type('16')
    cy
      .get('.color')
      .first()
      .clear()
      .type('#000')

    cy
      .get('.draw')
      .first()
      .should('be.visible')

    const item = '.draw > :nth-child('
    const arrayPaintBlack = [11, 12, 24, 25, 26, 27, 28, 29, 30, 31, 32,
      37, 38, 39, 42, 43, 44, 48, 52, 59, 63, 67, 74, 75, 78, 83, 90,
      93, 98, 101, 107, 109, 110, 111, 114, 123, 124, 127, 131, 140, 142,
      147, 149, 156, 159, 163, 165, 166, 172, 174, 179, 180, 187, 188,
      189, 194, 197, 202, 203, 205, 211, 212, 214, 215, 216, 217, 220,
      234, 235]

    paint(arrayPaintBlack)

    cy
      .get('.color')
      .first()
      .clear()
      .type('#f2ee44')

    const arrayPaintYellow = [40, 41, 45, 46, 47, 53, 54, 55, 56, 57,
      58, 60, 61, 62, 68, 69, 70, 71, 72, 73, 76, 77, 84, 85, 86, 87,
      88, 89, 91, 92, 99, 100, 102, 103, 104, 105, 106, 108, 115, 116,
      117, 118, 120, 121, 122, 125, 126, 132, 133, 134, 135, 136, 148,
      150, 151, 152, 153, 154, 155, 164, 167, 168, 181, 182, 183, 184,
      185, 186, 195, 196, 198, 199, 200, 201, 204, 218, 219]

    paint(arrayPaintYellow)

    cy
      .get('.color')
      .clear()
      .type('#603312')

      const arrayPaintBrown = [137, 138, 139, 141, 157, 158, 169, 170,
        171, 173]

    paint(arrayPaintBrown)

    cy
      .get('.color')
      .first()
      .clear()
      .type('#e72328')

    cy
      .get(`${item}119)`)
      .click()
  })
})
