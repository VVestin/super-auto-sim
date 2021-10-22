const Animals = require('../animals')
const { Squad, simulateBattle } = require('../sim.js')
const log = require('loglevel')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-things'))

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

   it('a team with one member beats an empty team', () => {
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

describe('tier 1 animals', () => {
   describe('horse, cricket, ant', () => {
      it('works for a test turn 1', () => {
         const squad = new Squad()
         squad.startTurn()
         squad.animalSlots = [
            new Animals[1].Horse(),
            new Animals[1].Ant(),
            new Animals[1].Cricket(),
         ]
         expect(squad).to.have.property('gold', 10)
         squad.buyAnimal(0, 0)
         squad.buyAnimal(1, 0)
         squad.buyAnimal(2, 0)
         squad.endTurn()
         expect(squad.roster[0])
            .to.be.instanceOf(Animals[1].Cricket)
            .with.property('tempAttack', 1)
         expect(squad.roster[1])
            .to.be.instanceOf(Animals[1].Ant)
            .with.property('tempAttack', 1)
         expect(squad.roster[2])
            .to.be.instanceOf(Animals[1].Horse)
            .with.property('tempAttack', 0)
         const [roster] = simulateBattle(
            squad,
            new Squad([
               new Animals[1].Duck(),
               new Animals[1].Duck(),
               new Animals[1].Duck(),
               new Animals[1].Duck(),
            ])
         )
         expect(squad).to.have.property('wins', 1)
         expect(squad).to.have.property('losses', 0)
         expect(roster[0]).to.be.instanceOf(Animals[1].Horse)
         expect(roster[0]).to.have.property('attack', 3)
         expect(roster[0]).to.have.property('health', 2)
         squad.startTurn()
         expect(squad.roster[0])
            .to.be.instanceOf(Animals[1].Cricket)
            .with.property('attack', 1)
         expect(squad.roster[1])
            .to.be.instanceOf(Animals[1].Ant)
            .with.property('attack', 2)
      })
   })

   describe('pig', () => {
      it('gives extra gold on sell', () => {
         const squad = new Squad([new Animals[1].Pig()])
         squad.startTurn()
         expect(squad.gold).to.equal(10)
         squad.sell(0)
         expect(squad.gold).to.equal(12)
         expect(squad.roster).have.lengthOf(5).and.to.all.equal(null)
      })
   })

   describe('otter', () => {
      it('buffs correctly on buy', () => {
         const squad = new Squad()
         squad.startTurn()
         squad.animalSlots[0] = new Animals[1].Otter()
         squad.animalSlots[1] = new Animals[1].Otter()
         squad.animalSlots[2] = new Animals[1].Fish()
         squad.buyAnimal(0, 0)
         expect(squad.roster[0]).to.be.instanceOf(Animals[1].Otter)
         expect(squad.roster[0]).to.have.property('attack', 1)
         expect(squad.roster[0]).to.have.property('health', 2)
         squad.buyAnimal(2, 1)
         const prevAttack = squad.roster[1].attack
         const prevHealth = squad.roster[1].health
         squad.buyAnimal(1, 0)
         expect(squad.roster[1]).to.have.property('attack', prevAttack + 1)
         expect(squad.roster[1]).to.have.property('health', prevHealth + 1)
         expect(squad).to.have.property('gold', 1)
      })
   })

   describe('duck', () => {
      it('buffs shop animals on sell', () => {
         const squad = new Squad([new Animals[1].Duck(1, 2, 2)])
         squad.startTurn()
         const attack1 = squad.animalSlots[0].attack
         const health1 = squad.animalSlots[0].health
         const attack2 = squad.animalSlots[1].attack
         const health2 = squad.animalSlots[1].health
         squad.sell(0)
         log.warn(squad.animalSlots.map(a => a && a.constructor.name))
         expect(squad.animalSlots[0]).to.have.property('attack', attack1 + 2)
         expect(squad.animalSlots[0]).to.have.property('health', health1 + 2)
         expect(squad.animalSlots[1]).to.have.property('attack', attack2 + 2)
         expect(squad.animalSlots[1]).to.have.property('health', health2 + 2)
      })
   })
})

describe('tier 2 animals', () => {
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

   describe('dog', () => {
      it('gets buffed in shop', () => {
         const squad = new Squad([new Animals[2].Dog()])
         squad.startTurn()
         squad.animalSlots[0] = new Animals[1].Fish()
         squad.buyAnimal(0, 1)
         expect([squad.roster[0].attack, squad.roster[0].health])
            .to.include.one.that.equals(3)
            .and.include.one.that.equals(2)
      })
   })
})
