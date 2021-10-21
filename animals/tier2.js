const Animal = require('./animal')

class Crab extends Animal {
   static baseAttack = 3
   static baseHealth = 3

   startBattle(actionQueue, mySquad, enemySquad) {
      super.startBattle(actionQueue, mySquad, enemySquad)
      const target = mySquad.getAnimalRelative(this, -1)
      if (target) this.health = target.health
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
         if (target) target.attack += this.attack
      }
   }
}

module.exports = { Crab, Dodo }
