const Animals = require('./animals')
const log = require('loglevel')

class Squad {
   animalSlots = []
   foodSlots = []
   gold = 0

   constructor(roster = new Array(5).fill(null), wins, losses, turn) {
      this.roster = roster
      while (roster.length < 5) roster.push(null)

      this.wins = wins || 0
      this.losses = losses || 0
      this.turn = turn || 0
   }

   startTurn() {
      this.turn++
      this.rollShop()
      this.gold = 10
      this.roster.forEach(a => a && a.startTurn(this))
   }

   endTurn() {
      this.roster.forEach(a => a && a.endTurn(this))
   }

   startBattle(actionQueue, enemySquad) {
      this.roster.forEach(
         a => a && a.startBattle(actionQueue, this, enemySquad)
      )
   }

   rollShop() {
      this.gold--

      const maxTier = Math.min(6, Math.floor((this.turn + 1) / 2))
      const possibleAnimals = Animals.slice(1, maxTier + 1)
         .map(Object.values)
         .flat()

      this.animalSlots.length = this.turn < 5 ? 3 : 4
      for (let i = 0; i < this.animalSlots.length; i++)
         if (!this.animalSlots[i] || !this.animalSlots[i].frozen)
            this.animalSlots[i] = new possibleAnimals[
               Math.floor(Math.random() * possibleAnimals.length)
            ]()

      log.info('rolled animal slots', this.animalSlots.map(String))
   }

   buyAnimal(shopIndex, rosterIndex) {
      if (this.gold < 3) throw 'not enough gold to buy an animal'
      this.gold -= 3

      const shopAnimal = this.animalSlots[shopIndex]
      this.animalSlots[shopIndex] = null
      const rosterAnimal = this.roster[rosterIndex]
      if (
         rosterAnimal &&
         shopAnimal instanceof rosterAnimal.constructor &&
         rosterAnimal.level < 3
      ) {
         this.roster[rosterIndex] = rosterAnimal.combine(shopAnimal, this)
      } else {
         this.summonAnimal(rosterIndex, shopAnimal)
      }
      this.roster[rosterIndex].buy(this) // should be rosterAnimal so that the correct level buy ability is triggered
   }

   sell(rosterIndex) {
      const animal = this.roster[rosterIndex]
      this.gold += animal.level
      this.roster[rosterIndex] = null
      animal.sell(this)
   }

   getAnimalRelative(animal, offset) {
      const index = this.roster.indexOf(animal)
      if (index == -1 || !this.roster[index + offset]) return null
      return this.roster[index + offset]
   }

   getRandomTarget(ineligible) {
      const eligible = this.roster.filter(a => a && a != ineligible)
      if (eligible.length == 0) return null
      return eligible[Math.floor(Math.random() * eligible.length)]
   }

   summonAnimal(index, animal) {
      if (!this.roster.includes(null))
         return log.warn(animal, 'could not be summoned (no space)')
      this.roster.splice(index, 0, animal)
      this.roster.splice(this.roster.indexOf(null), 1)
      for (let a of this.roster)
         if (a && a != animal) a.friendSummoned(animal, [], this)
   }

   // guarentees there is an animal in slot 0 (if there are still any animals left on the roster)
   advanceRoster() {
      if (this.roster.every(x => x == null)) return
      while (this.roster[0] == null) this.roster.push(this.roster.shift())
      for (let i = 1; i < this.roster.length; i++)
         if (this.roster[i] != null && this.roster[i - 1] == null)
            this.roster.push(...this.roster.splice(i - 1, 1))
   }

   toString() {
      return '{' + this.roster.map(String).join(', ') + '}'
   }
}

const printSquads = (lSquad, rSquad) => {
   log.info(
      '{',
      lSquad.roster
         .filter(a => a)
         .map(String)
         .reverse()
         .join(' '),
      '} vs {',
      rSquad.roster
         .filter(a => a)
         .map(String)
         .join(' '),
      '}'
   )
}

const clone = o =>
   o && Object.assign(Object.create(Object.getPrototypeOf(o)), o)

const simulateBattle = (lSquad, rSquad) => {
   const lSavedRoster = lSquad.roster.map(clone)
   const rSavedRoster = rSquad.roster.map(clone)
   printSquads(lSquad, rSquad)
   const actionQueue = []
   // execute start of battle powers
   lSquad.startBattle(actionQueue, rSquad)
   rSquad.startBattle(actionQueue, lSquad)

   let turnCount = 0
   do {
      log.info(`\nturn ${turnCount++}`)
      printSquads(lSquad, rSquad)

      let a
      while ((a = actionQueue.shift())) {
         log.info('executing', a)
         a()
      }

      lSquad.advanceRoster()
      rSquad.advanceRoster()
      if (lSquad.roster[0] == null || rSquad.roster[0] == null) continue

      lSquad.roster[0].attackFront(actionQueue, lSquad, rSquad)
      rSquad.roster[0].attackFront(actionQueue, rSquad, lSquad)
   } while (actionQueue.length > 0)

   log.info()
   log.info('The Final Squads are:')
   printSquads(lSquad, rSquad)
   log.info('The Outcome is:')
   if (lSquad.roster[0] && !rSquad.roster[0]) {
      lSquad.wins++
      rSquad.losses++
      log.info('Left Wins :)')
   } else if (!lSquad.roster[0] && rSquad.roster[0]) {
      rSquad.wins++
      lSquad.losses++
      log.info('Right Wins :(')
   } else log.info('Tie :|')

   const lRet = lSquad.roster
   const rRet = rSquad.roster

   lSquad.roster = lSavedRoster
   rSquad.roster = rSavedRoster

   return [lRet, rRet]
}

if (!module.parent) {
   log.setLevel(log.levels.TRACE)

   const s = new Squad()
   s.startTurn()
   s.buyAnimal(1, 0)
   log.info()
   log.info('squad', s.toString())
   log.info('shop', s.animalSlots.map(String))

   s.buyAnimal(0, 0)
   log.info()
   log.info('squad', s.toString())
   log.info('shop', s.animalSlots.map(String))
}

module.exports = { Squad, simulateBattle }
// const exSquad1 = new Squad([new Animals[1].Fish()])
// const exSquad2 = new Squad([new Animals[1].Cricket()])
// simulateBattle(exSquad1, exSquad2)
// simulateBattle(exSquad1, exSquad2)
// console.log(exSquad1)
// console.log(exSquad2)
