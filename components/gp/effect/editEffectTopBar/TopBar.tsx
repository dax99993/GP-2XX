import TopBar from "@/components/topBar/TopBar";
import { Button, ButtonGroup, ButtonIcon } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import useOrientation from "@/hooks/useOrientation";
import { store } from "@/models/store";
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
  const {isLandscape, isTablet} = useOrientation();

  const onClickImport = async () => {
      const status = await store.presetImporter.LoadFiles();
      if (status) {
        const presetsInfo = store.presetImporter.decodeFiles();

        // Get memory positions to load presets
        // Open Modal with selection
        console.log("Open modal");
        store.modals.openModal("loadPresetsModal");

        // Load to GP200 memory
        presetsInfo.forEach(p => {
          console.log("\nPreset INFO: ", p);
        })
      }
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
          store.gpActions.PrevBank();
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
          store.gpActions.NextBank();
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
          store.gpActions.PreviousPreset();
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
          store.gpActions.NextPreset();
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
              store.modals.openModal("loadPresetsModal");
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
  //if (store.gp200.currentPreset == undefined) {return null};

  const router = useRouter();

  const bankCode = store.gp200.currentPreset ? store.gp200.currentPreset.bankCode : "YY-XX";
  let presetName = store.gp200.currentPreset ? store.gp200.currentPreset.name : "a".repeat(12);
  // presetName = presetName.length > 10 ? 
  //   presetName.slice(0, 10 - 3) + '...' : presetName

  const goChangePreset = () => {
    console.log("Go change preset");
        router.push("/ui/edit/select_preset");
  };

  return (
    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} onPress={goChangePreset}>
      {/* <VStack className='bg-secondary-300 mx-2 px-2 rounded-md' style={{ flex: 1, minWidth: 50, justifyContent: 'center' }}>
        <Text numberOfLines={1} size="xl" bold={true}>{bankCode + ' ' + presetName}</Text>
      </VStack> */}
      <Center className='bg-secondary-300 mx-2 px-2 rounded-md' style={{ flex: 1, minWidth: 50 }}>
        <Text numberOfLines={1} size="xl" bold={true}>{bankCode}</Text>
        <Text numberOfLines={1} size="md">{presetName}</Text>
      </Center>
    </TouchableOpacity>
  );
});

export default EditEffectTopBar;