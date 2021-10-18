const Animals = require('./animals')

class Squad {
   animalSlots = []
   foodSlots = []

   constructor(roster, wins = 0, losses = 0, turn = 1) {
      this.roster = roster
      this.wins = wins
      this.losses = losses
      this.turn = turn
   }

   rollShop() {
      const maxTier = Math.min(6, Math.floor((this.turn + 1) / 2))
      const possibleAnimals = Animals.slice(1, maxTier + 1)
         .map(Object.values)
         .flat()

      this.animalSlots.length = this.turn < 5 ? 3 : 4
      for (let i = 0; i < this.animalSlots.length; i++)
         if (!this.animalSlots[i] || !this.animalSlots[i].frozen)
            this.animalSlots[i] =
               possibleAnimals[
                  Math.floor(Math.random() * possibleAnimals.length)
               ]

      console.log(this.animalSlots)
   }

   getRandomTarget() {
      const eligible = this.roster.filter(a => a)
      if (eligible.length == 0) return null
      return eligible[Math.floor(Math.random() * eligible.length)]
   }

   spawnUnit(index, spawn) {
      if (this.roster.length < 5) this.roster.splice(index, 0, spawn)
   }

   toString() {
      return this.roster.map(String).join(' ')
   }
}

const printSquads = (lSquad, rSquad) => {
   console.log(
      '{',
      lSquad.roster.map(String).reverse().join(' '),
      '} vs {',
      rSquad.roster.map(String).join(' '),
      '}'
   )
}

const clone = o => Object.assign(Object.create(Object.getPrototypeOf(o)), o)

const simulateBattle = (lSquad, rSquad) => {
   const lSavedRoster = lSquad.roster.map(clone)
   const rSavedRoster = rSquad.roster.map(clone)
   printSquads(lSquad, rSquad)
   const actionQueue = []
   // execute start of battle powers
   lSquad.roster.forEach(a => a && a.startBattle(actionQueue, lSquad, rSquad))
   rSquad.roster.forEach(a => a && a.startBattle(actionQueue, rSquad, lSquad))

   let turnCount = 0
   do {
      console.log(`\nturn ${turnCount++}`)
      printSquads(lSquad, rSquad)

      let a
      while ((a = actionQueue.shift())) {
         console.log('executing', a)
         a()
      }

      lSquad.roster = lSquad.roster.filter(x => x)
      rSquad.roster = rSquad.roster.filter(x => x)
      if (lSquad.roster.length == 0 || rSquad.roster.length == 0) continue

      lSquad.roster[0].attackFront(actionQueue, lSquad, rSquad)
      rSquad.roster[0].attackFront(actionQueue, rSquad, lSquad)
   } while (actionQueue.length > 0)

   console.log()
   console.log('The Final Squads are:')
   printSquads(lSquad, rSquad)
   console.log('The Outcome is:')
   if (lSquad.roster.length && !rSquad.roster.length) {
      lSquad.wins++
      rSquad.losses++
      console.log('Left Wins :)')
   } else if (!lSquad.roster.length && rSquad.roster.length) {
      rSquad.wins++
      lSquad.losses++
      console.log('Right Wins :(')
   } else console.log('Tie :|')

   lSquad.turn++
   rSquad.turn++

   lSquad.roster = lSavedRoster
   rSquad.roster = rSavedRoster
}

const s = new Squad([], 0, 0, 5)
s.rollShop()

// const exSquad1 = new Squad([new Animals[1].Fish()])
// const exSquad2 = new Squad([new Animals[1].Cricket()])
// simulateBattle(exSquad1, exSquad2)
// simulateBattle(exSquad1, exSquad2)
// console.log(exSquad1)
// console.log(exSquad2)
