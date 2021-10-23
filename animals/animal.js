const log = require('loglevel')

module.exports = class Animal {
   constructor(attack, health, level = 1, experience = 0, food = null) {
      this._attack = attack || this.constructor.baseAttack
      this._health = health || this.constructor.baseHealth
      this.level = level
      this.experience = experience
      this.food = food
      this.tempAttack = 0
      this.tempHealth = 0
   }

   get attack() {
      return this._attack + this.tempAttack
   }

   get health() {
      return this._health + this.tempHealth
   }

   tempBuff(attackBuff, healthBuff) {
      this.tempAttack += attackBuff
      this.tempHealth += healthBuff
   }

   buff(attackBuff, healthBuff) {
      this._attack += attackBuff
      this._health += healthBuff
   }

   attackFront(actionQueue, mySquad, enemySquad) {
      log.info(this.toString(), 'attacking with damage', this.attack)
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
      log.info(this.toString(), 'takes', damage, 'damage')
      this._health -= damage
      if (this.health <= 0) this.faint(actionQueue, mySquad, enemySquad)
   }

   faint(actionQueue, mySquad, enemySquad) {
      log.info(this.toString(), 'has fainted')
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

      this._attack = Math.max(this.attack, animal.attack)
      this._health = Math.max(this.health, animal.health)
      this.buff(1, 1)

      return this
   }

   startTurn(mySquad) {
      this.tempAttack = 0
      this.tempHealth = 0
   }

   // TODO should these start with 'on'? like onBuy, onSell, etc.
   endTurn() {}
   startBattle(actionQueue, mySquad, enemySquad) {}
   buy(mySquad) {}
   sell(mySquad) {}
   friendSummoned(friend, actionQueue, mySquad, enemySquad) {} // change this argument order to be better?
   levelUp(mySquad) {}

   toString() {
      return `[L${this.level + 0.1 * this.experience} ${
         this.constructor.name
      } ${this.attack}/${this.health}]`
   }
}
