const Animal = require('./animal')
const log = require('loglevel')

class Crab extends Animal {
   static baseAttack = 3
   static baseHealth = 3

   startBattle(actionQueue, mySquad, enemySquad) {
      super.startBattle(actionQueue, mySquad, enemySquad)
      const target = mySquad.getAnimalRelative(this, -1)
      if (target) this.buff(0, target.health - this.health)
   }
}

class Dodo extends Animal {
   static baseAttack = 1
   static baseHealth = 3
   startBattle(actionQueue, mySquad, enemySquad) {
      super.startBattle(actionQueue, mySquad, enemySquad)
      // TODO change this when dodo gets nerfed
      for (let i = 1; i <= this.level; i++) {
         const target = mySquad.getAnimalRelative(this, -i)
         if (target) target.buff(this.attack, 0)
      }
   }
}

class Dog extends Animal {
   static baseAttack = 2
   static baseHealth = 2

   friendSummoned(friend, actionQueue, mySquad, enemySquad) {
      super.friendSummoned(friend, actionQueue, mySquad, enemySquad)
      if (Math.random() > 0.5) this.buff(this.level, 0)
      else this.buff(0, this.level)
   }
}

class Peacock extends Animal {
   static baseAttack = 1
   static baseHealth = 5

   hurt(actionQueue, mySquad, enemySquad, damage) {
      super.hurt(actionQueue, mySquad, enemySquad, damage)
      if (this.health > 0)
         actionQueue.push(this.buff.bind(this, this.level * 2, 0))
   }
}

module.exports = { Crab, Dodo, Dog, Peacock }
