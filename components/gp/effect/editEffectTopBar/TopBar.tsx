import { EXPORT_PRESETS_MODAL_ID } from "@/components/Modals/ExportPresetsModal";
import { IMPORT_PRESET_MODAL_ID } from "@/components/Modals/ImportPresetModal";
import TopBar from "@/components/topBar/TopBar";
import { Button, ButtonGroup, ButtonIcon } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import useOrientation from "@/hooks/useOrientation";
import { useStore } from "@/hooks/useStore";
import { createHandleToast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { ArrowDownToLineIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, EllipsisVerticalIcon, FolderInputIcon, FolderOutputIcon, HomeIcon, SaveIcon } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import { TouchableOpacity } from "react-native";




function EditEffectTopBar() {

  return (
    <TopBar>
      <TopBar.leftItems>
        <GoHomeButton/>
      </TopBar.leftItems>
      <TopBar.rightItems>
        <RightElements/>
      </TopBar.rightItems>
    </TopBar>
  );
}

function GoHomeButton() {
  const router = useRouter();

  const goHome = () => {
    console.log("Go Home");
    router.replace("/");
  };

    return (
        <Button size="lg" action="secondary" className='rounded-xl px-3' onPress={goHome}>
          <ButtonIcon as={HomeIcon} />
        </Button>
    )
}


function RightElements() {
  const store = useStore();
  const handleToast = createHandleToast({
    // "LoadIRToast",
    title: "Dear user",
    description: "This features has not been implemented yet!.",
    duration: 3000
  });

  const {isLandscape, isTablet} = useOrientation();

  const onClickImport = async () => {
      const status = await store.presetImporter.LoadFiles();
      if (status) {
        // Should change this function to return error when file is not a valid .prst
        // add a try catch block to handle erroneous files
        const presetsInfo = store.presetImporter.decodeFiles();

        // Update default selected preset to import
        console.log("Presets info lenght", presetsInfo.length);
        const selectedPresets = Array.from({ length: presetsInfo.length }, (_, i) => (store.gp200.currentPresetNumber ?? 0) + i);
        console.log("Default import selected presets", selectedPresets);
        store.presetImporter.SetSelectedPresets(selectedPresets);

        // Get memory positions to load presets
        store.modals.openModal(IMPORT_PRESET_MODAL_ID);
      }
  }

  const onClickExport = async () => {
        // Update default selected preset to import
        if (store.gp200.currentPresetNumber != undefined) {
          store.presetExporter.SetSelectedPresets([store.gp200.currentPresetNumber]);
        }

        // Open Modal
        console.log("Open modal");
        store.modals.openModal(EXPORT_PRESETS_MODAL_ID);
  }

  return (
    <>
    <PresetInfo/>
    <ButtonGroup style={{ flexDirection: 'row', alignItems: 'center' }} space={isLandscape ? "sm" : "xs"}>
      { ((isLandscape  && !isTablet) || isTablet) &&
      <>
      <Button
        size="lg"
        action="secondary"
        className='rounded-xl px-3'
        onPress={() => {
          console.log("Change to previous bank");
          store.gpMidiEncoder.PrevBank();
        }}
      >
        <ButtonIcon as={ChevronsLeftIcon} />
      </Button>
      <Button
        size="lg"
        action="secondary"
        className='rounded-xl px-3'
        onPress={() => {
          console.log("Change to next bank");
          store.gpMidiEncoder.NextBank();
        }}
      >
        <ButtonIcon as={ChevronsRightIcon} />
      </Button>
      </>
      }
      <Button
        size="lg"
        action="secondary"
        className='rounded-xl px-3'
        onPress={() => {
          console.log("Change to previous preset");
          store.gpMidiEncoder.PreviousPreset();
        }}
      >
        <ButtonIcon as={ChevronLeftIcon} />
      </Button>
      <Button
        size="lg"
        action="secondary"
        className='rounded-xl px-3'
        onPress={() => {
          console.log("Change to next preset");
          store.gpMidiEncoder.NextPreset();
        }}
      >
        <ButtonIcon as={ChevronRightIcon} />
      </Button>
      <Button
        size="lg"
        action="secondary"
        className='rounded-xl px-3'
        onPress={()=> {
          console.log("save preset");
          store.modals.openModal("savePresetModal");
        }}
      >
        <ButtonIcon as={SaveIcon} size='lg' />
      </Button>
        <Menu
          placement="bottom right"
          style={{marginTop: isTablet ? 20 : 10}}
          trigger={({ ...triggerProps }) => {
            return (
              <Button size="lg" action="secondary" className='rounded-xl px-3' {...triggerProps}>
                <ButtonIcon as={EllipsisVerticalIcon} />
              </Button>
            )
          }}
        >
          <MenuItem
            key="Import preset"
            textValue="Import preset"
            onPress={() => {
              console.log("import preset");
              onClickImport();
            }}
          >
            <Icon as={FolderInputIcon} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Import preset</MenuItemLabel>
          </MenuItem>
          <MenuItem
            key="Export preset"
            textValue="Export preset"
            onPress={() => {
              console.log("export preset");
              onClickExport();
            }}
          >
            <Icon as={FolderOutputIcon} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Export preset</MenuItemLabel>
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            key="Load IR"
            textValue="Load IR"
            onPress={() => {
              console.log("Load IR");
              handleToast();
            }}
          >
            <Icon as={ArrowDownToLineIcon} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Load IR</MenuItemLabel>
          </MenuItem>
        </Menu>
    </ButtonGroup>
  </>
  );
}



const PresetInfo = observer(() => {
  const store = useStore();
  //if (store.gp200.currentPreset == undefined) {return null};

  const router = useRouter();

  const bankCode = store.gp200.currentPreset ? store.gp200.currentPreset.bankCode : "YY-XX";
  let presetName = store.gp200.currentPreset ? store.gp200.currentPreset.name : "z".repeat(16);

  const goChangePreset = () => {
    console.log("Go change preset");
        router.push("/ui/edit/select_preset");
  };

  return (
    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} onPress={goChangePreset}>
      <Center className='bg-secondary-300 mx-2 px-2 rounded-md' style={{ flex: 1, minWidth: 50 }}>
        <Text numberOfLines={1} size="xl" bold={true}>{bankCode}</Text>
        <Text numberOfLines={1} size="md">{presetName}</Text>
      </Center>
    </TouchableOpacity>
  );
});

export default EditEffectTopBar;