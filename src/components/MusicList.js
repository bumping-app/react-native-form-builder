import React from "react";
import { View, Image, StyleSheet, FlatList, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { ListItem } from "react-native-elements";
import { color } from "../styles";

const { height: deviceHeight } = Dimensions.get("screen");

const MusicList = (props) => {
  const { name, meta, value = {}, onChangeInputValue } = props;

  const _renderItem = ({ item }) => {
    return (
      <ListItem
        bottomDivider
        pad={10}
        key={item.label}
        style={{ paddingVertical: 4 }}
        containerStyle={{
          padding: 6,
          borderRadius: 8,
          backgroundColor: value.id === item.id ? color.PINK : color.WHITE,
        }}
        onPress={() => {
          onChangeInputValue({ id: item.id, url: item.url });
        }}
      >
        <Image
          style={{
            height: 55,
            width: 55,
            borderRadius: 9,
            marginRight: 15,
            marginLeft: 2,
          }}
          source={{
            uri: item.imgUrl,
          }}
        />

        <ListItem.Content>
          <ListItem.Title
            style={{
              textTransform: "capitalize",
              fontSize: 20,
              color: value.id === item.id ? color.WHITE : color.BLACK,
            }}
          >
            {item.name}
          </ListItem.Title>
          <ListItem.Title
            style={{
              textTransform: "capitalize",
              fontSize: 16,
              color: value.id === item.id ? color.WHITE : color.GREY,
            }}
          >
            {item.artist}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <View key={name}>
      <ListItem.Title style={styles.text}>{`${meta.text}`}</ListItem.Title>

      <FlatList
        data={meta.data}
        renderItem={_renderItem}
        keyExtractor={(item) => `clr-${item.id}`}
        style={{
          maxHeight: deviceHeight - 300,
          borderRadius: 8,
        }}
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
});

export default MusicList;

MusicList.propTypes = {
  name: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  value: PropTypes.object,
  style: PropTypes.object,
  onChangeInputValue: PropTypes.func.isRequired,
  text: PropTypes.string,
};
