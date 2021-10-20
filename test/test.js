const Animals = require('../animals.js')
const { Squad, simulateBattle } = require('../sim.js')
const log = require('loglevel')
const expect = require('chai').expect
log.setLevel(log.levels.WARN)

describe('battle simulation', () => {
   it('two empty squads tie', () => {
      const squadA = new Squad()
      const squadB = new Squad()
      simulateBattle(squadA, squadB)
      expect(squadA).to.have.property('wins', 0)
      expect(squadA).to.have.property('losses', 0)
      expect(squadB).to.have.property('wins', 0)
      expect(squadB).to.have.property('losses', 0)
   })

   it('any team beats an empty team', () => {
      const squadA = new Squad([new Animals[1].Beaver()])
      const squadB = new Squad()

      simulateBattle(squadA, squadB)
      expect(squadA).to.have.property('wins', 1)
      expect(squadA).to.have.property('losses', 0)
      expect(squadB).to.have.property('wins', 0)
      expect(squadB).to.have.property('losses', 1)

      simulateBattle(squadB, squadA)
      expect(squadA).to.have.property('wins', 2)
      expect(squadA).to.have.property('losses', 0)
      expect(squadB).to.have.property('wins', 0)
      expect(squadB).to.have.property('losses', 2)
   })
})

describe('animals', () => {
   describe('crab', () => {
      it('gets health at start of battle', () => {
         const squad = new Squad([
            new Animals[1].Fish(5, 10),
            new Animals[2].Crab(),
         ])
         const [roster] = simulateBattle(squad, new Squad())
         expect(roster[0]).to.have.property('health', 10)
         expect(roster[1]).to.have.property('health', 10)
      })
   })

   describe('dodo', () => {
      it('gives attack to 2 ahead at level 2', () => {
         const squad = new Squad([
            new Animals[1].Duck(1, 1),
            new Animals[1].Cricket(1, 1),
            new Animals[1].Ant(1, 1),
            new Animals[2].Dodo(10, 4, 2),
         ])
         const [roster] = simulateBattle(squad, new Squad())
         expect(roster[0]).to.have.property('attack', 1)
         expect(roster[1]).to.have.property('attack', 11)
         expect(roster[2]).to.have.property('attack', 11)
         expect(roster[3]).to.have.property('attack', 10)
      })
   })
})
