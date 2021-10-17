class Animal {
   constructor(attack, health, level = 1, food = null) {
      this.attack = attack
      this.health = health
      this.level = level
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

   startBattle() {}

   toString() {
      return `[${this.constructor.name} ${this.attack}/${this.health}]`
   }
}

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
         mySquad.spawnUnit.bind(
            mySquad,
            myIndex,
            new DeadCricket(this.level, this.level)
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
      const target = enemySquad.getRandomTarget()
      actionQueue.push(
         target.hurt.bind(target, actionQueue, enemySquad, mySquad, this.level)
      )
   }
}

module.exports = { Ant, Beaver, Cricket, DeadCricket, Fish, Mosquito }

// const tier1s = [Ant, Beaver]
//
// let a = new Beaver()
// console.log(a instanceof Animal)
// let b = Object.assign(Object.create(Beaver.prototype), a)
// console.log(b)
// console.log(b instanceof Beaver)
