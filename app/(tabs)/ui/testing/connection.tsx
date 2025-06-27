import { Button, Text, View } from "react-native";

import { EffectUnitSysEx } from "@/constants/SysExMsg";
import { MIDIAccess, MIDIOutput, requestMIDIAccess } from "@motiz88/react-native-midi";
import { useEffect, useState } from "react";

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

export default function ConnectionScreen() {

    const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
    const [midiOutput, setMidiOutput] = useState<MIDIOutput | null>(null);
    //const [midiDeviceConnected, setMidiDeviceConnected] = useState(false);

    useEffect(() => {
        console.log('component loaded');
        if (!midiAccess) {
            console.log('Request for permission');
            requestMIDIAccess({ software: false, sysex: true }).then(
                (access) => {
                    console.log('permission granted!');
                    // Add event listener
                    access.addEventListener("statechange", (e) => {
                        console.log("Midi event occured", e);
                    });

                    setMidiAccess(access);
                },
                () => {console.log('permission denied!')}
            );
        }
    }, []);

    useEffect(() => {
        if (midiAccess) {
            console.log("MidiAccess assigned : ", midiAccess);
            if (true) {
                console.log("Try to get GP-200");
                const output = getOutputDevice(midiAccess);
                if (!output) {
                    console.log("No GP-200 device found!");
                } else {
                    console.log("GP-200 device found!");
                    output.onstatechange = (e) => {
                        console.log('event on: ', e.port);
                        if (e.port?.state === "disconnected") {
                            setMidiOutput(null);
                            console.log("GP-200 disconnected");
                        }
                    }

                    setMidiOutput(output);
                }
            }
        }
    }, [midiAccess]);

    useEffect(() => {
        console.log('output change', midiOutput);
    }, [midiOutput]);

    const reconnect = () => {
        console.log("midiOutput: ", midiOutput);
            requestMIDIAccess({ software: false, sysex: true }).then(
                (access) => {
                    console.log('permission granted!');
                    setMidiAccess(access);
                },
                () => {console.log('permission denied!')}
            );
    }

    return (
        <>
        <View style={{backgroundColor: 'white', flex: 1}}>
            <Text>ASD</Text>
            <Button title={"send message 1"} onPress={(e)=>{
                const msg = EffectUnitSysEx.enablePre;
                midiOutput?.send(msg);
            }}></Button>
            <Button title={"send message 2"} onPress={(e)=>{
                const msg = EffectUnitSysEx.disablePre;
                midiOutput?.send(msg);
            }}></Button>
            <Button color="#ff00ff" title={"reconnect"} onPress={reconnect}></Button>
        </View>
        </>
    );
}