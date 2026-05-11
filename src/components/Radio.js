import React, { useRef } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { radioButton } from "../constant";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { height: deviceHeight } = Dimensions.get("screen");

export default function Radio(props) {
  const {
    name,
    value,
    meta,
    onChangeInputValue,
    isMandatory,
    style,
    inputStyle,
  } = props;

  const scrollViewRef = useRef(null);

  const safeValue = typeof value === "string" ? value : "";
  const staticOptions = meta.data.map((item) => item.value || item.label);
  const isCustomText =
    safeValue !== "" &&
    !staticOptions.includes(safeValue) &&
    safeValue !== "other";
  const isOtherActive = safeValue === "other" || isCustomText;
  const displayCustomText = isCustomText ? safeValue : "";

  const onPress = (selectedValue) => () => {
    onChangeInputValue(selectedValue);

    if (selectedValue === "other" && meta.showInput) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleCustomTextChange = (text) => {
    if (text.trim() === "") {
      onChangeInputValue("other");
    } else {
      onChangeInputValue(text);
    }
  };

  const _renderItem = ({ item, index }) => {
    const itemVal = String(item.value || item.label);

    let isSelected = safeValue === itemVal;

    // Force the 'other' radio to show as selected if the user has typed custom text
    if (itemVal === "other" && isOtherActive) {
      isSelected = true;
    }

    return (
      <View key={index} style={styles.radioContainer}>
        <TouchableOpacity
          onPress={onPress(itemVal)}
          hitSlop={styles.slop}
          style={styles.buttonContainer}
          disabled={meta.disabled}
        >
          <Image
            accessibilityLabel={`choose-option-${item.label}`}
            style={styles.radioButtonImage}
            source={isSelected ? radioButton.selected : radioButton.unselected}
          />
          <Text style={[styles.text, meta.optionTextStyle]}>{item.label}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View key={name} style={[styles.container]}>
      <Text style={[styles.heading, meta.headingStyle]}>
        {`${meta.text} ${isMandatory ? "*" : ""}`}
      </Text>

      <View style={[style]}>
        <KeyboardAwareScrollView
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          extraScrollHeight={0}
          enableAutomaticScroll={meta.data && meta.data.length >= 4}
        >
          <FlatList
            ref={scrollViewRef}
            data={meta.data}
            renderItem={_renderItem}
            keyExtractor={(item) => `opt-${item.label}`}
            style={[
              {
                borderRadius: 8,
              },
              style?.flatList,
            ]}
            disabled={!meta.isScrollable}
            horizontal={meta.isHorizontal}
            showsHorizontalScrollIndicator={false}
            // style={{ borderWidth: 0, width: "100%" }}
            contentContainerStyle={{ width: "auto" }}
            keyboardShouldPersistTaps="handled"
          />

          {isOtherActive && meta.showInput && (
            <View>
              <TextInput
                style={[styles.textBox, inputStyle]}
                value={displayCustomText}
                onChangeText={handleCustomTextChange}
                placeholder={meta.text || "Please specify"}
                multiline={meta.multiline}
                numberOfLines={2}
                underlineColorAndroid="transparent"
              />
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  radioButtonImage: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  text: {
    paddingLeft: 10,
  },
  heading: {
    margin: 10,
  },
  slop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  radioContainer: {
    paddingVertical: 10,
    width: "auto",
    height: 40,
    paddingLeft: 10,
  },
  textBox: {
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 3,
    marginHorizontal: 10,
    marginTop: 5,
    paddingLeft: 10,
  },
});

Radio.propTypes = {
  name: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  value: PropTypes.string, // Strictly expecting a string
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  onChangeInputValue: PropTypes.func.isRequired,
  isMandatory: PropTypes.bool,
};
