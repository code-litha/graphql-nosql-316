import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Button({
  onPress = () => {},
  stylesButton = {},
  text = "",
  stylesText = {},
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, stylesButton]}
    >
      <Text style={[styles.text, stylesText]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
    // backgroundColor: "red",
    borderWidth: 1,
  },
  text: {
    fontWeight: "500",
    fontSize: 18,
    textAlign: "center",
    // color: "white",
  },
});
