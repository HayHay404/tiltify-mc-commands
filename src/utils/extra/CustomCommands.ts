export default class CustomCommands {
  [key: string]: () => string[];

  summonFarmAnimals() {
    const animalList = [
      "axolotl",
      "bee",
      "camel",
      "cat",
      "chicken",
      "cow",
      "donkey",
      "fox",
      "frog",
      "goat",
      "horse",
      "llama",
      "mooshroom",
      "mule",
      "ocelot",
      "panda",
      "pig",
      "rabbit",
      "sheep",
      "sniffer",
      "strider",
      "tadpole",
      "trader_llama",
      "turtle",
      "wolf",
      "dolphin",
    ];

    // Select 10 random animals from the list
    const randomAnimals = animalList
      .sort(() => 0.5 - Math.random())
      .slice(0, 7);

    // Create the summon commands
    const summonCommands = randomAnimals.map((animal) => {
      return `/execute at hayhayisaloser run summon minecraft:${animal}`;
    });

    return ["/say Summoned some farm animals!", ...summonCommands];
  }

  randomSummon() {
    const entityList = [
      "lightning_bolt",
      "creeper ~ ~ ~ {powered:3}",
      "warden",
    ];

    const randomEntity =
      entityList[Math.floor(Math.random() * entityList.length)];

    return [
      `/broadcast §6§lParry this filthy casual`,
      `/execute at hayhayisaloser run summon minecraft:${randomEntity}`,
    ];
  }

  randomHeight() {
    const randomHeight = Math.floor(Math.random() * 150);

    return [`/execute as HayHayIsALoser at @p run tp ~ ~${randomHeight} ~`];
  }

  giveRandomPotionEffect() {
    const potionEffects = [
      "minecraft:bad_omen",
      "minecraft:blindness",
      "minecraft:haste",
      "minecraft:jump_boost",
      "minecraft:levitation",
      "minecraft:mining_fatigue",
      "minecraft:poison",
      "minecraft:regeneration",
      "minecraft:resistance",
      "minecraft:saturation",
      "minecraft:slow_falling",
      "minecraft:slowness",
      "minecraft:speed",
      "minecraft:strength",
      "minecraft:weakness",
      "minecraft:wither",
    ];

    const randomPotionEffect =
      potionEffects[Math.floor(Math.random() * potionEffects.length)];

    return [`/effect give @a ${randomPotionEffect} 30 1`];
  }
}
