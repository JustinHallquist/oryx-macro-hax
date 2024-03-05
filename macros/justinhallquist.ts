import { MacroBuilder } from "../src/MacroBuilder";

export function prepare(newMacro) {
    type DelayCommand = {
        type: "delay";
        ms: number;
    };
    type Input = {
        input: string;
        modifier?: "shift" | "ctrl";
    }
    type InputCommand = { type: "input" } & Input;
    type Command = InputCommand | DelayCommand;
    type Tick = Command[];
    type RsMacro = Tick[];

    function delay(ms: number): DelayCommand {
        return {
            type: "delay",
            ms
        };
    }

    function type(input: string, modifier?: "shift" | "ctrl"): InputCommand {
        return {
            type: "input",
            input,
            modifier
        };
    }

    function inputToBuilder(input: Input): MacroBuilder {
        return newMacro().typeAlphanumeric(input.input);
    }

    function inputCommand(macro: MacroBuilder, input: InputCommand): MacroBuilder {
        return macro.withModifier(inputToBuilder(input), input.modifier);
    }

    function delayCommand(macro: MacroBuilder, delay: DelayCommand): MacroBuilder {
        return macro.delay(delay.ms);
    }

    function executeMacro(macroSource: RsMacro): MacroBuilder {
        return macroSource.reduce((macro, tick) => {
            const m = tick.reduce((macro, command) => {
                if (command.type === "input") {
                    return inputCommand(macro, command);
                }
                else if (command.type === "delay") {
                    return delayCommand(macro, command);
                }
            }, macro);

            if (macroSource.length === 1) {
                return m;
            }

            return m.delay(900);
        }, newMacro());
    }

    const macroExtensions = {
        "zzros": newMacro()
            .tapKey("X_KC_8", 500)
            .tapKey("X_KC_LBRC", 500)
            .tapKey("X_KC_G", 500)
            .tapKey("X_KC_A", 500)
            .tapKey("X_KC_S", 500)
            .tapKey("X_KC_D", 500)
            .tapKey("X_KC_Q", 500)
            .tapKey("X_KC_W", 2000)
    };

    return { macroExtensions };
}
