import type { MIDIInput, MIDIOutput } from "@motiz88/react-native-midi";
import * as React from "react";

import { useMidiIoSetup } from "@/hooks/useMidiIoSetup";
import { MidiIoContext } from "./MidiIoContext";

export const MidiIoSetupContext = React.createContext<{
  midiIoContext: {
    inputPort: MIDIInput | null | undefined;
    outputPort: MIDIOutput | null | undefined;
  };
  inputs: ReadonlyMap<string, MIDIInput>;
  outputs: ReadonlyMap<string, MIDIOutput>;
  currentInputId: string | undefined;
  currentOutputId: string | undefined;
  setCurrentInputId: (id: string) => void;
  setCurrentOutputId: (id: string) => void;
}>({
  midiIoContext: {
    inputPort: null,
    outputPort: null,
  },
  inputs: new Map(),
  outputs: new Map(),
  currentInputId: undefined,
  currentOutputId: undefined,
  setCurrentInputId: () => {},
  setCurrentOutputId: () => {},
});

export function MidiIoSetupContainer({ children }: { children?: React.ReactNode }) {
  const midiIoSetupState = useMidiIoSetup();
  return (
    <MidiIoSetupContext.Provider value={midiIoSetupState}>
      <MidiIoContext.Provider value={midiIoSetupState.midiIoContext}>
        {children}
      </MidiIoContext.Provider>
    </MidiIoSetupContext.Provider>
  );
}