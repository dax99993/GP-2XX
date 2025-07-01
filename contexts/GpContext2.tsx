import { createContext, useContext } from "react";

import { MIDIOutput } from "@motiz88/react-native-midi";

export type GPMidi = {
    //midiAccess: MIDIAccess;
    midiOutput: MIDIOutput | null;
    //setMidiAccess: (m: MIDIAccess) => void;
    setMidiiOutput: (m: MIDIOutput) => void;
}


export const GPContext = createContext<GPMidi | null>(null);

export const useGPContext = () => useContext(GPContext);
