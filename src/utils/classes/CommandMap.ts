import commandsJson from "../../commands.json";
import CustomCommands from "../extra/CustomCommands";

class CommandMap {
  commands: Command[];
  commandMap: Map<number, Command> | null;
  customCommands: CustomCommands;
  constructor() {
    this.commands = commandsJson["commands"] as Command[];
    this.commandMap = this.createCommandMapRange();
    this.customCommands = new CustomCommands();
  }

  createCommandMapRange() {
    if (!this.commands) {
      throw new Error("ERROR: Commands have not been loaded.");
    }

    const commandMapRange = new Map<number, Command>();
    for (const command of this.commands) {
      if (command.function === true) {
        if (!this.validateFunctionCommand(command.command)) {
          continue;
        }
      }
      commandMapRange.set(command.value, command);
    }

    const commandMapRangeSorted = new Map(
      [...commandMapRange.entries()].sort((b, a) => b[0] - a[0])
    );

    return commandMapRangeSorted;
  }

  validateFunctionCommand(command: string) {
    try {
      return typeof this.customCommands[command] === "function";
    } catch (e) {
      console.log(`ERROR: Custom command ${command} is not a function.`);
      return false;
    }
  }

  getCommandByValue(value: number) {
    if (!this.commandMap) {
      throw new Error("ERROR: Command map has not been loaded.");
    }

    if (!this.commandMap.has(value)) {
      const sortedKeys = [...this.commandMap.keys()].sort((a, b) => a - b);
      const closestKey = sortedKeys.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );
      return this.commandMap.get(closestKey)!["command"];
    }

    return this.commandMap.get(value)!["command"];
  }
}

type Command = {
  value: number;
  command: string;
  function: boolean;
};

export default CommandMap;
