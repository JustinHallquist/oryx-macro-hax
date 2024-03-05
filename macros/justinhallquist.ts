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

    function skipTick(): DelayCommand {
        return {
            type: "delay",
            ms: 600
        };
    }

    function skipGcd(): DelayCommand {
        return {
            type: "delay",
            ms: 600 * 3
        };
    }

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
        "zzros": executeMacro([
            // [type("8"), delay(512)],
            // [type("["), delay(512), type("g"), delay(512),],
            [type("a"), delay(512), type("s"), delay(512), type("d"), delay(512)],
            [type("q"), delay(512), type("w"), delay(2010)],
            // [type("q"), delay(512), type("w"), delay(2010)],
            // [type("q"), delay(512), type("w"), delay(2010)],
            // [type("q"), delay(512), type("w"), delay(2010)],
            // [type("q"), delay(512), type("w"), delay(2010)]
        ]),
        // "fivem": executeMacro([
        //     [type("["), delay(512), type("g"), delay(512),],
        // ]),
        // "thirtym": executeMacro([
        //     [type("a"), delay(512), type("s"), delay(512), type("d"), delay(512)],
        // ]),
        // "skills": executeMacro([
        //     [type("q"), delay(512), type("w"), delay(2010)]
        // ]),
    };

    return { macroExtensions };
}
