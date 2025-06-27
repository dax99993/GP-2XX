import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ActionButtonProps, ActionButtonType } from './types';

function getButtonTypeStyle(type: ActionButtonType) {
  let style;
  switch (type) {
    case ActionButtonType.ControlOn:
      style = styles.buttonTypeControlOn;
      break;
    case ActionButtonType.ControlOff:
      style = styles.buttonTypeControlOff;
      break;
    case ActionButtonType.Patch:
      style = styles.buttonTypePatch;
      break;
    case ActionButtonType.Tap:
      style = styles.buttonTypeTap;
      break;
    default:
      style = styles.buttonTypeTap;
      break;
    }

    return style;
}

const ActionButton= (props: ActionButtonProps) => {
  const buttonTypeStyle = getButtonTypeStyle(props.type);
  return (
    <TouchableOpacity style={[styles.buttonContainer, buttonTypeStyle]} onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: '#007bff', // Example background color
    paddingVertical: 25,
    paddingHorizontal: 5,
    borderRadius: 15, // Adjust for desired roundness
    borderWidth: 5, // Add border
    borderColor: '#0056b3', // Border color
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    //minWidth: 80,
  },
  buttonText: {
    color: '#ffffff', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTypeControlOff: {
    backgroundColor: '#B5A642', // brass color
    borderColor: '#FFDE21',
  },
  buttonTypeControlOn: {
    backgroundColor: '#780606', // blood color
    borderColor: '#CD1C18',
  },
  buttonTypePatch: {
    backgroundColor: '#6D8196', // slate gray color
    borderColor: '#F2F0EF', // off-white
  },
  buttonTypeTap: {
    backgroundColor: '#182E6F', // blue color
    borderColor: '#305CDE',
  },
});

export default ActionButton;