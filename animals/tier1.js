const Animal = require('./animal')

class Ant extends Animal {
   static baseAttack = 2
   static baseHealth = 1

   faint(actionQueue, mySquad, enemySquad) {
      super.faint(actionQueue, mySquad, enemySquad)
      // someday buffFriend should be available elsewhere?
      const buffFriend = () => {
         const target = mySquad.getRandomTarget()
         if (target != null) {
            target.attack += 2 * this.level
            target.health += this.level
         }
      }
      actionQueue.push(buffFriend)
   }
}

class Beaver extends Animal {
   static baseAttack = 2
   static baseHealth = 2
}

class Cricket extends Animal {
   static baseAttack = 1
   static baseHealth = 2

   faint(actionQueue, mySquad, enemySquad) {
      const myIndex = mySquad.roster.indexOf(this)
      super.faint(actionQueue, mySquad, enemySquad)
      actionQueue.push(
         mySquad.summonAnimal.bind(
            mySquad,
            myIndex,
            new DeadCricket(this.level, this.level, this.level)
         )
      )
   }
}

class DeadCricket extends Animal {}

class Duck extends Animal {
   static baseAttack = 1
   static baseHealth = 2
}

class Fish extends Animal {
   static baseAttack = 2
   static baseHealth = 3
}

class Mosquito extends Animal {
   static baseAttack = 2
   static baseHealth = 2

   startBattle(actionQueue, mySquad, enemySquad) {
      super.startBattle(actionQueue, mySquad, enemySquad)
      const target = enemySquad.getRandomTarget()
      actionQueue.push(
         target.hurt.bind(target, actionQueue, enemySquad, mySquad, this.level)
      )
   }
}

module.exports = { Ant, Beaver, Cricket, Duck, Fish, Mosquito }
