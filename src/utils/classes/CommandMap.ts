import commandsJson from "../../commands.json";
import CustomCommands from "../extra/CustomCommands";

class CommandMap {
  commands: Command[];
  commandMap: Map<number, Command> | null;
  customCommands: CustomCommands;
  constructor() {
    this.customCommands = new CustomCommands();
    this.commands = commandsJson["commands"] as Command[];
    this.commandMap = this.createCommandMapRange();
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
      return typeof this.customCommands[command]() === "object";
    } catch (e) {
      console.log(`ERROR: Custom command ${command} is not a function.`);
      return false;
    }
  }

  getCommandByValue(value: number): Array<string> {
    if (!this.commandMap) {
      throw new Error("ERROR: Command map has not been loaded.");
    }

    if (value < 0) {
      throw new Error("ERROR: Value must be greater than 0.");
    }

    value = Math.floor(value);

    let commandParams = this.commandMap.get(value);

    if (!commandParams) {
      this.commandMap.forEach((command) => {
        while (command.value <= value) {
          commandParams = command;
        }
      });
    }

    if (!commandParams) {
      throw new Error("ERROR: Command not found.");
    }

    if (commandParams.function === true) {
      return this.customCommands[commandParams.command]();
    }

    console.log(`Running command: ${commandParams.command}`);

    return [commandParams.command];
  }
}

type Command = {
  value: number;
  command: string;
  function: boolean;
};

export default CommandMap;
