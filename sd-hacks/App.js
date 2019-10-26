import React, { Component } from "react";
import {
  Text,
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight
} from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.flex_1}>
          <Camera style={styles.flex_1} type={this.state.type}>
            <View style={styles.flip_view}>
              <TouchableOpacity
                style={styles.flip_touch}
                onPress={this.flip_camera}
              >
                <Text style={styles.flip_btn}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
          {/* Translation Bar */}
          <View styles={styles.translate_bar}>
            <View
              style={{
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: 2,
                padding: 30,
                margin: 10,
                marginBottom: 0
              }}
            ></View>
            <Text style={styles.translate_btn_text}> Translate </Text>
          </View>
          {/* Translate Bar */}
          <View styles={styles.translate_bar}>
            <TouchableOpacity
              style={styles.translate_btn}
              onPress={() => {
                console.log("test pressed");
              }}
            >
              <Text style={styles.translate_btn_text}> Translate </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  flip_camera = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  };
}

const styles = StyleSheet.create({
  flex: {
    display: "flex"
  },
  flex_1: {
    flex: 1
  },
  translate_btn_text: {
    fontSize: 20,
    // marginBottom: 10,
    alignItems: "center",
    color: "white"
  },
  flip_touch: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  flip_view: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  flip_btn: {
    fontSize: 18,
    marginBottom: 10,
    color: "white"
  },
  translate_bar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  translate_btn: {
    backgroundColor: "#5fb2d9",
    opacity: 0.85,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 10,
    margin: 40,
    marginBottom: 20,
    borderRadius: 10
  }
});
