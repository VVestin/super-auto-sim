# shop notes:
turn 1:
tier 1, 3 animal slots, 1 food slot

turn 3:
tier 2, 3 animal slots, 2 food slots

turn 5:
tier 3, 4 animal slots

turn 7:
tier 4


# goat squad
```js
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
```

Animal list (updated Oct 20, 2021)
## Tier 1
- [x] Ant 2/1 - Faint (give friend +1/+2)
- [x] Beaver 2/2 - Sell (give 2 friends +1 health)
- [x] Cricket 1/2 - Faint (summon +1/+1 friend)
- [x] Duck 1/2 - Sell (give shop animals +1/+1)
- [x] Fish 2/3 - Level up (give all friends +1/+1)
- [x] Horse 1/1 - Friend summoned (give them +1 attack)
- [x] Mosquito 2/2 - Battle start (deal 1 damage to random enemy)
- [x] Otter 1/2 - Buy (give friend +1/+1)
- [x] Pig 2/2 - Sell (gain 1 extra gold)

## Tier 2
- [x] Crab 3/3 - Battle start (copy health from friend ahead)
- [x] Dodo 1/3 - Battle start (give attack to friend ahead)
- [x] Dog 2/2 - Friend summoned (gain +1 health or +1 attack)
- [ ] Elephant 3/5 - Before attack (deal 1 damage to friend behind)
- [ ] Flamingo 1/3 - Faint (give +1/+1 to friend behind)
- [ ] Peacock 1/5 - Hurt (gain +2 attack)
- [ ] Rat 4/5 - Faint (summon a 1/1 dirty rat on opponents side)
- [ ] Shrimp 2/1 - Friend sold (give friend +1 health)
- [ ] Spider 2/2 - Faint (summon one tier 3 animal as a 2/2)
- [ ] Swan 3/4 - Start turn (gain 1 gold)

## Tier 3
- [ ] Badger 5/4 - Faint (deal attack damage to adjacent animals)
- [ ] Blowfish 3/5 - Hurt (deal 2 damage to a random enemy)
- [ ] Camel 2/5 - Hurt (give friend behind +1/+2)
- [ ] Giraffe 1/3 - End turn (give friend ahead +1/+1)
- [ ] Kangaroo 2/3 - Friend ahead attacks (gain +2/+2)
- [ ] Ox 1/4 - Friend ahead faints (gain melon armor and +2 attack)
- [ ] Rabbit 3/2 - Friend eats shop food (give them +1 health)
- [ ] Sheep 2/2 - Faint (summon two 2/2 rams)
- [ ] Snail 2/2 - Faint (give friend behind melon armor)
- [ ] Whale 2/6 - Start battle (swallow friend ahead and release it as level 1 after fainting)

## Tier 4
- [ ] Bison 6/6 - End turn (gain +2/+2 if there is a tier 3 friend)
- [ ] Deer 1/1 - Faint (summon a 5/5 bus with splash attack)
- [ ] Dolphin - Start battle (deal 5 damage to the lowest health enemy)
- [ ] Hippo 4/7 - Knock out (gain +2/+2)
- [ ] Monkey 3/3 - End turn (give +2/+2 to right-most friend)
- [ ] Penguin 1/2 - End turn (give +1/+1 to other level 2+ friends)
- [ ] Rooster 3/3 - Faint (summon a chick with same attack)
- [ ] Skunk 3/5 - Start battle (reduce highest enemy health by 33%)
- [ ] Squirrel 2/2 - Buy (clear and fill shops with food)
- [ ] Worm 1/1 - Eat food (gain +1/+1)
