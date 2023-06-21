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
}
