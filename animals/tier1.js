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
            target.buff(2 * this.level, this.level)
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

class Horse extends Animal {
   static baseAttack = 1
   static baseHealth = 1

   friendSummoned(friend, mySquad, enemySquad) {
      friend.tempAttack += 1
   }
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

class Pig extends Animal {
   static baseAttack = 2
   static baseHealth = 2

   sell(mySquad) {
      super.sell(mySquad)
      mySquad.gold += this.level
   }
}

module.exports = {
   Ant,
   Beaver,
   Cricket,
   DeadCricket,
   Duck,
   Fish,
   Horse,
   Mosquito,
   Pig,
}
