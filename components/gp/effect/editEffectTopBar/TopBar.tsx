import TopBar from "@/components/topBar/TopBar";
import { Button, ButtonGroup, ButtonIcon } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import { store } from "@/models/store";
import { useRouter } from "expo-router";
import { ArrowDownToLineIcon, ChevronLeftIcon, ChevronRightIcon, CircleArrowDownIcon, EllipsisVerticalIcon, FolderInputIcon, FolderOutputIcon, HomeIcon, SaveIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";




function EditEffectTopBar() {

  return (
    <TopBar>
      <TopBar.leftItems>
        <TopBarLeft/>
      </TopBar.leftItems>
      <TopBar.centerItems>
        <TopBarCenter/>
      </TopBar.centerItems>
      <TopBar.rightItems>
        <TopBarRightMenu/>
      </TopBar.rightItems>
    </TopBar>
  );
}

function TopBarLeft() {
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

function TopBarCenter() {
  const previousPreset = () => {
    console.log("Change to previous preset");
    store.gpActions.PreviousPreset();
  }

  const nextPreset = () => {
    console.log("Change to next preset");
    store.gpActions.NextPreset();
  }

  const savePreset = () => {
    console.log("save preset");
  }

  return (
    <>
    <TopBarPresetInfo/>
    <ButtonGroup style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Button size="lg" action="secondary" className='rounded-xl px-3' onPress={previousPreset}>
        <ButtonIcon as={ChevronLeftIcon} />
      </Button>
      <Button size="lg" action="secondary" className='rounded-xl px-3' onPress={nextPreset}>
        <ButtonIcon as={ChevronRightIcon} />
      </Button>
      <Button size="lg" action="secondary" className='rounded-xl px-3' onPress={savePreset}>
        <ButtonIcon as={SaveIcon} size='lg' />
      </Button>
    </ButtonGroup>
    </>
  );
}

function TopBarRightMenu() {
  const importPreset = () => {
    console.log("import preset");
  }

  const exportPreset = () => {
    console.log("export preset");
  }
  const loadIR = () => {
    console.log("Load IR");
  }
  const loadNAM = () => {
    console.log("Load NAM");
  }

  return (
    <Menu
      placement="bottom"
      trigger={({ ...triggerProps }) => {
        return (
          <Button size="lg" action="secondary" className='rounded-xl px-3' {...triggerProps}>
            <ButtonIcon as={EllipsisVerticalIcon} />
          </Button>
        )
      }}
    >
      <MenuItem key="Import preset" textValue="Import preset" onPress={importPreset}>
        <Icon as={FolderInputIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">Import preset</MenuItemLabel>
      </MenuItem>
      <MenuItem key="Export preset" textValue="Export preset" onPress={exportPreset}>
        <Icon as={FolderOutputIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">Export preset</MenuItemLabel>
      </MenuItem>
      <MenuSeparator />
      <MenuItem key="Load IR" textValue="Load IR" onPress={loadIR}>
        <Icon as={ArrowDownToLineIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">Load IR</MenuItemLabel>
      </MenuItem>
      <MenuItem key="Load NAM" textValue="Load NAM" onPress={loadNAM}>
        <Icon as={CircleArrowDownIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">Load NAM</MenuItemLabel>
      </MenuItem>
    </Menu>
  );

}

function TopBarPresetInfo() {
  const goChangePreset = () => {
    console.log("Go change preset");
  };

  return (
    <TouchableOpacity style={{flex:1, flexDirection: 'row'}} onPress={goChangePreset}>
    <Center className='bg-secondary-300 px-2 rounded-md'>
        <Text>XX-A</Text>
        <Text>preset name</Text>
    </Center>
      </TouchableOpacity>
  );
}

export default EditEffectTopBar;