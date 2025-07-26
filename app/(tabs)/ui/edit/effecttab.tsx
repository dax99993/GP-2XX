import { Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ArrowDownToLineIcon, CircleArrowDownIcon, EllipsisVerticalIcon, FolderInputIcon, FolderOutputIcon, HomeIcon, Save } from 'lucide-react-native';


import EffectChain from '@/components/gp/effect/EffectChain';
import EffectEdit from '@/components/gp/effect/EffectEdit';
import TopBar from '@/components/topBar/TopBar';
import { Button, ButtonGroup, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { ChevronLeftIcon, ChevronRightIcon, Icon } from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import { Text } from '@/components/ui/text';
import { useState } from 'react';


function EditScreenTopBar() {
  const goHome = () => {
    console.log("Go Home");
  };

  const goChangePreset = () => {
    console.log("Go change preset");
  };

  const previousPreset = () => {
    console.log("Change to previous preset");
  }

  const nextPreset = () => {
    console.log("Change to next preset");
  }

  const savePreset = () => {
    console.log("save preset");
  }

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
    <TopBar>
      <TopBar.leftItems>
        <Button size="lg" className='rounded-xl px-3' onPress={goHome}>
          <ButtonIcon as={HomeIcon} />
        </Button>
      </TopBar.leftItems>
      <TopBar.centerItems >
        <TopBarPresetInfo/>
        <ButtonGroup style={{ flexDirection: 'row' }}>
          <Button size="lg" className='rounded-xl px-3' onPress={previousPreset}>
            <ButtonIcon as={ChevronLeftIcon} />
          </Button>
          <Button size="lg" className='rounded-xl px-3' onPress={nextPreset}>
            <ButtonIcon as={ChevronRightIcon} />
          </Button>
          <Button size="lg" className='rounded-xl px-3' onPress={savePreset}>
            <ButtonIcon as={Save} size='lg' />
          </Button>
        </ButtonGroup>
      </TopBar.centerItems>
      <TopBar.rightItems>
        <Menu 
          placement="bottom"
          trigger={({ ...triggerProps }) => {
            return (
              <Button size="lg" className='rounded-xl px-3' {...triggerProps}>
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
      </TopBar.rightItems>
    </TopBar>
  );
}

function TopBarPresetInfo() {
  return (
    <TouchableOpacity style={{flex:1, flexDirection: 'row'}}>
    <Center className='bg-secondary-300 px-2 rounded-md'>
        <Text>XX-A preset name</Text>
    </Center>
      </TouchableOpacity>
  );
}

function EditModeSelector() {
  const [isEditing, setIsEditing] = useState(true);

  const toggleState = () => {
    setIsEditing(!isEditing);
  }

  return (
    <Center className='bg-secondary-0 px-3 py-2' >
      <ButtonGroup space="xs" flexDirection='row' style={{ flex: 1 }} >
        <Button className='rounded-md '
          variant={isEditing ? 'solid' : 'outline'}
          action="primary"
          style={{ flex: 1 }}
          onPress={()=>(setIsEditing(true))}
        >
            <ButtonText>Edit</ButtonText>
        </Button>
        <Button 
          variant={!isEditing ? 'solid' : 'outline'}
          action="primary"
          style={{ flex: 1 }}
          onPress={()=>(setIsEditing(false))}
        >
          <ButtonText>Patch Settings</ButtonText>
        </Button>
      </ButtonGroup>
    </Center>
  )
}

export default function EditScreen() {

  return (
    <>
      <View style={styles.mainContainer}>
        <EffectChain/>
        <EffectEdit/>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    //gap: 8,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
});