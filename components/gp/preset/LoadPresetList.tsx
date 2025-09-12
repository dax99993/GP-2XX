import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox";
import { HStack } from "@/components/ui/hstack";
import { store } from "@/models/store";
import { FlashList } from "@shopify/flash-list";
import { CheckIcon } from "lucide-react-native";
import { useCallback, useState } from "react";


function LoadPresetList() {
    const CURRENT_PRESETS_DATA = store.gp200.presets.map(p => {
        return {name: p.name, number: p.number, bankCode: p.bankCode}
    })

    const LOAD_PRESET_DATA = store.presetImporter.presets.map(p => {
        return {name: p.name, number: p.number}
    })

    const startSavingPosition = store.gp200.currentPresetNumber ? store.gp200.currentPresetNumber : 0;

    // states
    // currently selected positions
    const [savePositions, setSavePositions] = useState(
        Array.from({ length: LOAD_PRESET_DATA.length }, (_, i) =>  startSavingPosition + i)
        );

    const isDisabled = useCallback((positionNumber: number)=> {
        console.log("Current positions", savePositions);
        return !savePositions.includes(-1) && !savePositions.includes(positionNumber);
    }, [ savePositions ])

    return (
            <HStack style={{ flex: 0, justifyContent: 'center' }}>
                <FlashList
                    data={CURRENT_PRESETS_DATA}
                    estimatedItemSize={21}
                    renderItem={(item) =>
                        <HStack>
                            <Checkbox
                                isDisabled={isDisabled(item.item.number)}
                                value={item.item.number.toString()}
                                defaultIsChecked={savePositions.includes(item.item.number)}
                                onChange={(v: boolean) => {
                                    console.log(item.item.name, "State change to", v);
                                    if (v == false) {
                                        // setSavePositions(prevPositions => prevPositions.filter(n => n != item.item.number));
                                        setSavePositions(prevPositions => {
                                            const index = prevPositions.findIndex(n => n == item.item.number);
                                            prevPositions[index] = -1;

                                            console.log(index, prevPositions);

                                            return [...prevPositions];
                                        });
                                    } else {
                                        // setSavePositions(prevPositions => [...prevPositions, item.item.number]);
                                        setSavePositions(prevPositions => {
                                            // Get available positions
                                            const availableIndexPositions: number[] = [];
                                            prevPositions.forEach((value, index)=> {
                                                if (value === -1) {
                                                    availableIndexPositions.push(index);
                                                }
                                            })
                                            console.log("Available Index Positions", availableIndexPositions);



                                            return prevPositions;
                                        })
                                    }
                                }}
                            >
                                <CheckboxIndicator>
                                    <CheckboxIcon as={CheckIcon} />
                                </CheckboxIndicator>
                                <CheckboxLabel>{item.item.bankCode + ' ' + item.item.name}</CheckboxLabel>
                            </Checkbox>
                        </HStack>
                    }
                />
                {/* <FlashList
                    data={LOAD_PRESET_DATA}
                    renderItem={(item) =>
                        <HStack>
                            <Checkbox
                                isDisabled={true}
                                value={item.item.number.toString()}
                                isChecked={savePositions[item.index] !== -1}
                            >
                                <CheckboxIndicator>
                                    <CheckboxIcon as={CheckIcon} />
                                </CheckboxIndicator>
                                <CheckboxLabel>{item.item.name}</CheckboxLabel>
                            </Checkbox>
                        </HStack>
                    }
                /> */}
            </HStack>

    );
}

export default LoadPresetList;