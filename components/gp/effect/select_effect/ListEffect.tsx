import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EffectsInfo } from "@/constants/Effects";
import { IChangeEffect } from "@/models/effect/changeEffect/IChangeEffects";
import { EffectType } from "@/models/effect/effect";
import { useRouter } from "expo-router";
import { TrashIcon } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useMemo, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";

import SearchBar from "@/components/core/SearchBar";
import { useStore } from "@/hooks/useStore";
import { createHandleToast } from "@/utils/toast";
import { FlashList } from "@shopify/flash-list";

export const ListEffect = observer(() => {
  const router = useRouter();
  const listRef = useRef<FlashList<any>>(null);
  const [changeName, setChangeName] = useState(false);

  const store = useStore();
  const IRNames = store.gp200.irNames;
  const currentEffect = store.gp200.currentEffect;

  const effectType = currentEffect ? currentEffect.type : EffectType.PRE;

  const DATA = useMemo(() => {
    console.log("Change in IR Names");
    // return ChangeEffectsInfo[EffectType[effectType] as keyof typeof ChangeEffectsInfo];
    const effectsInfo =
      EffectsInfo[EffectType[effectType] as keyof typeof EffectsInfo];
    // Map default User IR names to actual IR names
    if (effectType == EffectType.CAB) {
      const offset = effectsInfo.length - 20;
      for (let i = 0; i < 20; i++) {
        effectsInfo[i + offset].name = IRNames[i];
      }
    }

    return effectsInfo;
  }, [changeName]);

  // const DATA = (() => {
  //     console.log("Change in IR Names");
  //     // return ChangeEffectsInfo[EffectType[effectType] as keyof typeof ChangeEffectsInfo];
  //     const effectsInfo = ChangeEffectsInfo[EffectType[effectType] as keyof typeof ChangeEffectsInfo];
  //     // Map default User IR names to actual IR names
  //     if (effectType == EffectType.CAB) {
  //         const offset = effectsInfo.length - 20
  //         for(let i = 0; i < 20; i++) {
  //             effectsInfo[i+offset].name = IRNames[i];
  //         }
  //     }

  //     return effectsInfo;
  // });

  const ID = store.gp200.currentEffect
    ? store.gp200.currentEffect.ID
    : DATA[10].ID;

  const [filteredData, setFilteredData] = useState<IChangeEffect[]>(DATA);

  // AMP
  // 251658240, 251658241, 251658242, 251658243, 251658244,
  // DST
  // 251658245, 251658246, 251658247, 251658248, 251658249,
  const isNAM = (ID: number) => ID >= 251658240 && ID <= 251658249;
  const isIR = (ID: number) => ID >= 168820736 && ID <= 168820755;
  const getIRIndex = (ID: number) => ID - 168820736;

  const onSelectEffect = (id: number) => {
    store.gpMidiEncoder.ChangeEffect(id);
    // go back to edit screen
    router.back();
  };

  const onSearchChange = (q: string) => {
    if (q === "") {
      setFilteredData(DATA);
    } else {
      const data = DATA.filter((e) =>
        e.name.toLocaleLowerCase().includes(q.toLocaleLowerCase()),
      );
      setFilteredData(data);
    }
  };

  const notifyToast = createHandleToast(
    {
      title: "IR Deleted",
      description: `The IR has been deleted!.`,
      duration: 3000,
    },
    "bottom",
  );

  const unimplementedToast = createHandleToast(
    {
      title: "Dear user",
      description: "This features has not been implemented yet!.",
      duration: 3000,
    },
    "bottom",
  );

  // console.log("Current effect", store.gp200.currentEffect?.name, current_index);

  return (
    <VStack style={{ flex: 1 }} className="bg-secondary-0">
      <SearchBar placeholder="Search effect" onChange={onSearchChange} />
      <FlashList
        ref={listRef}
        initialScrollIndex={filteredData.findIndex((e) => e.ID === ID)}
        drawDistance={1500}
        estimatedItemSize={60}
        data={filteredData}
        // keyExtractor={item => item.name + item.index}
        keyExtractor={(item) => item.ID}
        extraData={changeName}
        renderItem={(item) => (
          <ListEffectItem
            // name={isIR(item.item.ID) ? IRNames[getIRIndex(item.item.ID)] : item.item.name}
            name={item.item.name}
            selected={item.item.ID === ID}
            onSelectEffect={() => onSelectEffect(item.item.ID)}
            description={item.item.description}
            isDeletable={isIR(item.item.ID) || isNAM(item.item.ID)}
            onDelete={() => {
              // Show toast Not implemented yet
              if (isIR(item.item.ID)) {
                const IRNumber = getIRIndex(item.item.ID);
                console.log(
                  "Delete IR on",
                  item.item.name,
                  item.item.ID,
                  IRNumber,
                );
                store.gpMidiEncoder.DeleteIR(IRNumber);
                notifyToast();
                setChangeName((v) => !v);
              } else if (isNAM(item.item.ID)) {
                unimplementedToast();
                return console.log(
                  "Delete NAM on",
                  item.item.name,
                  item.item.ID,
                );
              }
            }}
          />
        )}
      />
    </VStack>
  );
});

// List item
type ListEffectItemProps = {
  name: string;
  selected: boolean;
  description: string;
  isDeletable: boolean;
  onDelete: () => void;
  onSelectEffect: () => void;
};

const ListEffectItem = (props: ListEffectItemProps) => {
  const [showFullDescription, setShowFullDescription] = useState(1);

  return (
    <Box
      className={`${props.selected ? "bg-info-300" : "bg-secondary-300"} mx-1 mb-1`}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", justifyContent: "space-between" }}
        onPress={props.onSelectEffect}
        onLongPress={() => setShowFullDescription(1 - showFullDescription)}
      >
        <VStack className="px-2 py-2">
          <Text size="md" bold={true}>
            {props.name}
          </Text>
          <Text numberOfLines={showFullDescription}>{props.description}</Text>
        </VStack>
        {props.isDeletable && <DeleteItem onPress={props.onDelete} />}
      </TouchableOpacity>
    </Box>
  );
};

interface DeleteItemProps {
  onPress: () => void;
}

const DeleteItem: React.FC<DeleteItemProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={{ justifyContent: "center", alignItems: "center" }}
      onPress={onPress}
    >
      <Center className="bg-secondary-500 px-3" style={{ flex: 1 }}>
        <Text>Delete</Text>
        <Icon size="xl" as={TrashIcon} />
      </Center>
    </TouchableOpacity>
  );
};
