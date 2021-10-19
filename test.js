const Animals = require('./animals.js')
const { Squad, simulateBattle } = require('./sim.js')

test('two empty teams tie', () => {
   const squadA = new Squad()
   const squadB = new Squad()
   simulateBattle(squadA, squadB)
   expect(squadA.wins).toBe(0)
   expect(squadA.losses).toBe(0)
   expect(squadB.wins).toBe(0)
   expect(squadB.losses).toBe(0)
})
