import { color } from "@coffeebeanslabs/react-native-form-builder/src/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Button, Divider, ListItem } from "react-native-elements";
import ColorPicker, {
  OpacitySlider,
  Panel5,
  PreviewText,
} from "reanimated-color-picker";
import Modal from "react-native-modal";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get("screen");

const ColorPickerList = (props) => {
  const { name, meta, value = {}, style, index, onChangeInputValue } = props;

  const [showModal, setShowModal] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const onColorPick = (color) => {
    setSelectedColor(color.hex);
  };

  const _onClose = () => {
    setShowModal(false);
  };

  const _showModal = (id = null) => {
    setActiveItemId(id);
    setShowModal(true);
  };

  const _updateColor = () => {
    if (activeItemId) {
      onChangeInputValue({
        ...value,
        [activeItemId]: selectedColor,
      });
    }
    setShowModal(false);
    setActiveItemId(null);
    setSelectedColor(null);
  };

  const _renderItem = ({ item }) => {
    return (
      <ListItem
        // bottomDivider
        pad={10}
        key={item.value}
        style={{ paddingVertical: 4 }}
        containerStyle={{
          padding: 6,
          borderRadius: 8,
          backgroundColor: "transparent",
        }}
        onPress={() => {
          _showModal(item.value);
        }}
      >
        <View
          style={[
            styles.colorCircle,
            {
              backgroundColor: value?.[item.value] || color.WHITE,
            },
            // style?.flatListItem
          ]}
        />

        <ListItem.Content>
          <ListItem.Title
            style={[{
              textTransform: "capitalize",
              fontSize: 20,
              color: color.WHITE,
            }, style?.flatListItemText ]}
          >
            {item.label}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <View key={name}>
      <ListItem.Title style={styles.text}>{`${meta.text}`}</ListItem.Title>

      <Modal
        isVisible={showModal}
        swipeDirection={["down"]}
        onSwipeComplete={_onClose}
        avoidKeyboard={true}
        propagateSwipe={true}
        onBackdropPress={_onClose}
        onModalHide={_onClose}
        style={styles.sheetStyle}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.sheetContent}>
            <ColorPicker
              sliderThickness={25}
              thumbSize={24}
              thumbShape="circle"
              onCompleteJS={onColorPick}
              onComplete={onColorPick}
              style={colorPickerStyle.picker}
            >
              <Panel5
                style={[colorPickerStyle.panelStyle, { borderRadius: 4 }]}
              />
              <OpacitySlider
                style={colorPickerStyle.sliderStyle}
                adaptSpectrum
              />
              <Divider />
              <PreviewText
                style={colorPickerStyle.previewTxt}
                colorFormat="hex"
              />
            </ColorPicker>

            <Button title="Select Color" onPress={_updateColor} />
          </View>
        </View>
      </Modal>

      <FlatList
        data={meta.data}
        renderItem={_renderItem}
        keyExtractor={(item) => `clr-${item.value}`}
        style={[{
          maxHeight: deviceHeight - 300,
          borderRadius: 8,
        }, style?.flatList ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    color: color.WHITE,
    marginBottom: 20,
  },
  sheetStyle: { padding: 0, margin: 0, justifyContent: "flex-end" },
  sheetContainer: {
    alignItems: "center",
    backgroundColor: color.WHITE,
    borderRadius: 16,
  },
  sheetContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: color.WHITE,
    paddingBottom: 40,
    maxWidth: 400,
    width: deviceWidth,
  },
  colorCircle: {
    height: 50,
    width: 50,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "#0003",
  },
});
export const colorPickerStyle = StyleSheet.create({
  picker: {
    gap: 20,
    paddingBottom: 25,
  },
  panelStyle: {
    borderRadius: 16,
  },
  sliderStyle: {
    borderRadius: 20,
    marginTop: 20,
  },
  previewTxt: {
    color: color.GREY,
    backgroundColor: color.WHITE,
    marginTop: 15,
    fontSize: 18,
  },
});

export default ColorPickerList;

ColorPickerList.propTypes = {
  name: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  value: PropTypes.object,
  style: PropTypes.object,
  onChangeInputValue: PropTypes.func.isRequired,
  text: PropTypes.string,
};
