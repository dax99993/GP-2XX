import { EffectUnitSysEx } from "@/constants/SysExMsg";
import { MIDIAccess, MIDIOutput, requestMIDIAccess } from "@motiz88/react-native-midi";
import { useEffect, useState } from "react";

function getInputDevice(access: MIDIAccess) {
    // Get GP-200 input and output
    for (const entry of access.inputs) {
        const input = entry[1];
        if (input.name.includes("GP-200")) {
            const midiInput = input;
            midiInput.onmidimessage = (e) => {
                console.log("Message", e.data);
            };

            return midiInput;
        }
    }

    return null;
}

function getOutputDevice(access: MIDIAccess) {
    // Get GP-200 output
    for (const entry of access.outputs) {
        const output = entry[1];
        if (output.name.includes("GP-200")) {
            return output;
        }
    }

    return null;
}

function useGP() { 
    const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
    const [midiOutput, setMidiOutput] = useState<MIDIOutput | null>(null);
    //const [midiChangeState, setMidiChangeState] = useState(false);

    //const [connected, setConnected] = useState(false);
    
    // Get MIDI access
    useEffect(() => {
        requestMIDIAccess({ software: false, sysex: true }).then((access) => {

        /*
        access.onstatechange = (e) => {
            console.log("State change: ", e);
            // console.log("change port: ", e.port?.name);
            // if (e.port?.name.includes("GP-200") && e.port?.state === "disconnected") {
            //     console.log("Reconnect GP-200");
            // }
            setMidiChangeState(true);
        }
        */
        setMidiAccess(access);
        console.log("Request midi access")
        console.log("midi access", '\n', access);

        });
    }, []);

    useEffect(() => {
        if (midiAccess) {
             //const input = getInputDevice(midiAccess);
            const output = getOutputDevice(midiAccess);
            if (output) {
                console.log("Found device!");
                console.log("Get output", output);
                setMidiOutput(output);
             }
            }
    }, [midiAccess]);

    useEffect(() => {
        if (midiOutput) {
            midiOutput.send(EffectUnitSysEx.enablePre);
        }
    }, [midiOutput]);

    // useEffect(() => {
    //     console.log("Some change:", midiAccess);
    // },[midiChangeState]);
    

    return midiOutput;
}

export default useGP;