import PropTypes from "prop-types";
import React, { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ListItem } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { color } from "../styles";

const { height: deviceHeight } = Dimensions.get("screen");

const MultiCheckList = (props) => {
  const {
    name,
    meta,
    value = [], // Ensuring default is an array
    onChangeInputValue,
    style,
    inputStyle,
    isMandatory,
  } = props;

  const _listRef = useRef(null);

  const staticOptions = meta.data.map((item) => item.value || item.label);

  const customTextValue =
    value.find((v) => !staticOptions.includes(v) && v !== "other") || "";

  const [showInp, setShowInp] = useState(!!customTextValue);

  useEffect(() => {
    setShowInp(!!customTextValue);
  }, [name, customTextValue]);

  const _handleItemCheck = (val) => {
    if (val === "other" && meta.showInput) {
      const willShow = !showInp;
      setShowInp(willShow);

      if (!willShow) {
        const updatedValue = value.filter(
          (v) => staticOptions.includes(v) && v !== "other",
        );
        onChangeInputValue(updatedValue);
      } else {
        setTimeout(() => {
          _listRef.current?.scrollToEnd();
        }, 100);
      }
      return;
    }

    let _valToUpdate = [...value];
    if (_valToUpdate.includes(val)) {
      _valToUpdate = _valToUpdate.filter((e) => e !== val);
    } else {
      _valToUpdate.push(val);
    }
    onChangeInputValue(_valToUpdate);
  };

  const _handleCustomTextChange = (text) => {
    const selectedStaticOptions = value.filter(
      (v) => staticOptions.includes(v) && v !== "other",
    );

    if (text.trim() !== "") {
      onChangeInputValue([...selectedStaticOptions, text]);
    } else {
      onChangeInputValue(selectedStaticOptions);
    }
  };

  const _renderItem = ({ item }) => {
    const itemVal = item.value || item.label;

    return (
      <ListItem
        // bottomDivider
        pad={10}
        key={item.label}
        style={[{ paddingVertical: 0 }]}
        containerStyle={[
          {
            padding: 6,
            borderRadius: 8,
            alignItems: 'flex-start'
          },
          style?.flatListItem,
        ]}
        onPress={() => {
          _handleItemCheck(itemVal);
        }}
      >
        <ListItem.CheckBox
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checked={itemVal === "other" ? showInp : value.includes(itemVal)}
          onPress={() => {
            _handleItemCheck(itemVal);
          }}
          checkedColor={color.PINK}
        />

        <ListItem.Content>
          <ListItem.Title
            style={[{ textTransform: "capitalize" }, style?.flatListItemText]}
          >
            {item.label}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <View key={name}>
      <ListItem.Title style={styles.text}>
        {`${meta.text} ${isMandatory ? "*" : ""}`}
      </ListItem.Title>
      <KeyboardAwareScrollView
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        extraScrollHeight={170}
        // extraScrollHeight={(meta.data && meta.data.length >= 4) ? 170 : 20}
      >
        <FlatList
          ref={_listRef}
          data={meta.data}
          renderItem={_renderItem}
          keyExtractor={(item) => `opt-${item.label}`}
          style={[
            {
              maxHeight: showInp ? deviceHeight - 400 : deviceHeight - 300,
              borderRadius: 8,
            },
            style?.flatList,
          ]}
          contentContainerStyle={{ 
             paddingBottom: 20
          }}
        />

        {showInp ? (
          <View>
            <TextInput
              style={[styles.textBox, style, inputStyle]}
              value={customTextValue}
              underlineColorAndroid="transparent"
              onChangeText={_handleCustomTextChange}
              accessibilityLabel={`input-${meta.label}`}
              placeholder={meta.text}
              multiline={true}
              numberOfLines={2}
              placeholderTextColor={color.GREY_AE}
            />
          </View>
        ) : null}
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textBox: {
    height: 80,
    borderRadius: 8,
    marginVertical: 10,
    paddingLeft: 15,
    paddingTop: 15,
    backgroundColor: color.GREEN_DARK,
    borderWidth: 1,
    borderColor: color.GREY_AE,
  },
  yellowMainView: {
    flexDirection: "row",
  },
  text: {
    fontSize: 24,
    color: color.WHITE,
    marginBottom: 20,
  },
});

export default MultiCheckList;

MultiCheckList.propTypes = {
  name: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  value: PropTypes.array, // Changed this from string to array
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  onChangeInputValue: PropTypes.func.isRequired,
  text: PropTypes.string,
};
