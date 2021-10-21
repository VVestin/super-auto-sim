const log = require('loglevel')

module.exports = class Animal {
   constructor(attack, health, level = 1, experience = 0, food = null) {
      this.attack = attack || this.constructor.baseAttack
      this.health = health || this.constructor.baseHealth
      this.level = level
      this.experience = experience
      this.food = food
   }

   attackFront(actionQueue, mySquad, enemySquad) {
      actionQueue.push(
         enemySquad.roster[0].hurt.bind(
            enemySquad.roster[0],
            actionQueue,
            enemySquad,
            mySquad,
            this.attack
         )
      )
   }

   hurt(actionQueue, mySquad, enemySquad, damage) {
      log.trace(this.toString(), 'takes', damage, 'damage')
      this.health -= damage
      if (this.health <= 0) this.faint(actionQueue, mySquad, enemySquad)
   }

   faint(actionQueue, mySquad, enemySquad) {
      log.trace(this.toString(), 'has fainted')
      mySquad.roster[mySquad.roster.indexOf(this)] = null
   }

   combine(animal, mySquad) {
      // make sure the bugger animal absorbs the smaller animal
      if ([this.level, this.experience] < [animal.level, animal.experience])
         return animal.combine(this, mySquad)

      this.experience += animal.experience
      if (animal.level == 1) this.experience += 1
      else if (animal.level == 2) this.experience += 3

      if (this.experience > this.level) {
         this.level++
         this.experience -= this.level

         this.levelUp(mySquad)
      }

      this.attack = 1 + Math.max(this.attack, animal.attack)
      this.health = 1 + Math.max(this.health, animal.health)

      return this
   }

   // TODO should these start with 'on'? like onBuy, onSell, etc.
   startBattle(actionQueue, mySquad, enemySquad) {}
   startTurn(mySquad) {}
   buy(mySquad) {}
   sell(mySquad) {}
   friendSummoned(actionQueue, mySquad, enemySquad) {}
   levelUp(mySquad) {}

   toString() {
      return `[L${this.level + 0.1 * this.experience} ${
         this.constructor.name
      } ${this.attack}/${this.health}]`
   }
}
