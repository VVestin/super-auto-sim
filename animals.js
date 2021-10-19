class Animal {
   constructor(attack, health, level = 1, experience = 0, food = null) {
      this.attack = attack
      this.health = health
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
      console.log(this.toString(), 'takes', damage, 'damage')
      this.health -= damage
      if (this.health <= 0) this.faint(actionQueue, mySquad, enemySquad)
   }

   faint(actionQueue, mySquad, enemySquad) {
      console.log(this.toString(), 'has fainted')
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

// Tier 1 animals:
class Ant extends Animal {
   attack = 2
   health = 1

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
   attack = 2
   health = 2
}

class Cricket extends Animal {
   attack = 1
   health = 2

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

class Fish extends Animal {
   attack = 2
   health = 3
}

class Mosquito extends Animal {
   attack = 2
   health = 2

   startBattle(actionQueue, mySquad, enemySquad) {
      super.startBattle(actionQueue, mySquad, enemySquad)
      const target = enemySquad.getRandomTarget()
      actionQueue.push(
         target.hurt.bind(target, actionQueue, enemySquad, mySquad, this.level)
      )
   }
}

// Tier 2 animals:
class Crab extends Animal {
   attack = 3
   health = 3
}

class Dodo extends Animal {
   attack = 1
   health = 3
}

// organized into tiers (1 indexed for clarity)
module.exports = [
   null,
   { Ant, Beaver, Cricket, Fish, Mosquito },
   { Crab, Dodo },
]
