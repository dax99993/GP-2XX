import { Image, StyleSheet } from "react-native";

const unitONImages = {
    PRE: require("@/assets/images/GP200Icons/PRE_on.png"),
    WAH: require("@/assets/images/GP200Icons/WAH_on.png"),
    DST: require("@/assets/images/GP200Icons/DST_on.png"),
    AMP: require("@/assets/images/GP200Icons/AMP_on.png"),
    NR: require("@/assets/images/GP200Icons/NR_on.png"),
    CAB: require("@/assets/images/GP200Icons/CAB_on.png"),
    EQ: require("@/assets/images/GP200Icons/EQ_on.png"),
    MOD: require("@/assets/images/GP200Icons/MOD_on.png"),
    DLY: require("@/assets/images/GP200Icons/DLY_on.png"),
    RVB: require("@/assets/images/GP200Icons/RVB_on.png"),
    VOL: require("@/assets/images/GP200Icons/VOL_on.png"),

    // Preset Settings
    SET: require("@/assets/images/GP200Icons/SET_on.png"),
}

const unitOFFImages = {
    PRE: require("@/assets/images/GP200Icons/PRE_off.png"),
    WAH: require("@/assets/images/GP200Icons/WAH_off.png"),
    DST: require("@/assets/images/GP200Icons/DST_off.png"),
    AMP: require("@/assets/images/GP200Icons/AMP_off.png"),
    NR: require("@/assets/images/GP200Icons/NR_off.png"),
    CAB: require("@/assets/images/GP200Icons/CAB_off.png"),
    EQ: require("@/assets/images/GP200Icons/EQ_off.png"),
    MOD: require("@/assets/images/GP200Icons/MOD_off.png"),
    DLY: require("@/assets/images/GP200Icons/DLY_off.png"),
    RVB: require("@/assets/images/GP200Icons/RVB_off.png"),
    VOL: require("@/assets/images/GP200Icons/VOL_off.png"),

    // Preset Settings
    SET: require("@/assets/images/GP200Icons/SET_off.png"),
}

const unitONSelectedImages = {
    PRE: require("@/assets/images/GP200Icons/PRE_on_selected.png"),
    WAH: require("@/assets/images/GP200Icons/WAH_on_selected.png"),
    DST: require("@/assets/images/GP200Icons/DST_on_selected.png"),
    AMP: require("@/assets/images/GP200Icons/AMP_on_selected.png"),
    NR: require("@/assets/images/GP200Icons/NR_on_selected.png"),
    CAB: require("@/assets/images/GP200Icons/CAB_on_selected.png"),
    EQ: require("@/assets/images/GP200Icons/EQ_on_selected.png"),
    MOD: require("@/assets/images/GP200Icons/MOD_on_selected.png"),
    DLY: require("@/assets/images/GP200Icons/DLY_on_selected.png"),
    RVB: require("@/assets/images/GP200Icons/RVB_on_selected.png"),
    VOL: require("@/assets/images/GP200Icons/VOL_on_selected.png"),

    // Preset Settings
    SET: require("@/assets/images/GP200Icons/SET_on_selected.png"),
}

const unitOFFSelectedImages = {
    PRE: require("@/assets/images/GP200Icons/PRE_off_selected.png"),
    WAH: require("@/assets/images/GP200Icons/WAH_off_selected.png"),
    DST: require("@/assets/images/GP200Icons/DST_off_selected.png"),
    AMP: require("@/assets/images/GP200Icons/AMP_off_selected.png"),
    NR: require("@/assets/images/GP200Icons/NR_off_selected.png"),
    CAB: require("@/assets/images/GP200Icons/CAB_off_selected.png"),
    EQ: require("@/assets/images/GP200Icons/EQ_off_selected.png"),
    MOD: require("@/assets/images/GP200Icons/MOD_off_selected.png"),
    DLY: require("@/assets/images/GP200Icons/DLY_off_selected.png"),
    RVB: require("@/assets/images/GP200Icons/RVB_off_selected.png"),
    VOL: require("@/assets/images/GP200Icons/VOL_off_selected.png"),

    // Preset Settings
    SET: require("@/assets/images/GP200Icons/SET_off_selected.png"),
}

interface ChainUnitImageProps {
    type: string,
    state: boolean,
    selected?: boolean,
}

function GetImage(type: string, state: boolean, selected?:boolean) {
  if (state && selected) {
    return unitONSelectedImages[type as keyof typeof unitONSelectedImages];
  } else if (state && !selected) {
    return unitONImages[type as keyof typeof unitONImages];
  } else if (!state && selected) {
    return unitOFFSelectedImages[type as keyof typeof unitOFFSelectedImages];
  } else {
    return unitOFFImages[type as keyof typeof unitOFFImages];
  }
}

function ChainUnitImage({type, state, selected}: ChainUnitImageProps) {

  const image = GetImage(type, state, selected ?? false);

    return (
      <Image
        source={image}
        resizeMode="cover"
        style={selected ? styles.selectedImage : styles.nonSelectedImage}
      />
    );
}

const styles = StyleSheet.create({
  nonSelectedImage: {
    width: '75%',
    height: '75%'
  },
  selectedImage: {
    width: '100%',
    height: '100%'
  }
});

export default ChainUnitImage;