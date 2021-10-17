const Animals = require('./animals')

goat_squad = {
   wins: 10,
   hearts: 1,
   turn: 16,
   roster: [
      { animal: 'dodo', attack: 32, health: 34, level: 3 },
      { animal: 'tiger', attack: 8, health: 7, level: 1 },
      { animal: 'leopard', attack: 17, health: 15, level: 3 },
      { animal: 'turtle', attack: 13, health: 15, level: 1.5, food: 'steak' },
      { animal: 'monkey', attack: 37, health: 37, level: 2, food: 'melon' },
   ],
}

class Squad {
   constructor(roster, wins = 0, hearts = 4, turn = 1) {
      this.roster = roster
      this.wins = wins
      this.hearts = hearts
      this.turn = turn
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
   if (lSquad.roster.length && !rSquad.roster.length)
      console.log('Left Wins :)')
   else if (!lSquad.roster.length && rSquad.roster.length)
      console.log('Right Wins :(')
   else console.log('Tie :|')
}

const exSquad1 = new Squad([new Animals.Fish()])
const exSquad2 = new Squad([new Animals.Cricket()])
simulateBattle(exSquad1, exSquad2)
