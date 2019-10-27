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
import { RNS3 } from "react-native-aws3";
import * as ImageManipulator from "expo-image-manipulator";
const AWS = require("aws-sdk");

// Enter copied or downloaded access ID and secret key here
const ID = "AKIAXLKWWULHGWYUQZRE";
const SECRET = "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";

// The name of the bucket that you have created
const BUCKET_NAME = "spicyaslinput";

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

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
          {/* Camera */}
          <Camera
            style={styles.flex_1}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={styles.focus}></View>
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
          <View styles={styles.bottom_bar}>
            <View style={styles.translation_bar}></View>
          </View>
          {/* Translate Bar */}
          <View styles={styles.bottom_bar}>
            <TouchableOpacity
              style={styles.translate_btn}
              onPress={() => {
                this.translate_process();
              }}
            >
              <Text style={styles.translate_btn_text}> Translate </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  translate_process = () => {
    this.snap();
  };

  snap = async () => {
    if (this.camera) {
      options = { base64: true, skipProcessing: true };
      // takes picture and convert to base64
      let photo = await this.camera.takePictureAsync(options).then(response => {
        let obj = { encodedImage: response["base64"] };
        let base69 = response["base64"];
        this.upload_file_awsgw(base69); // upload process to AWS Gateway
      });
    }
  };

  // uploads base64 to AWS Gateway
  upload_file_awsgw = base64 => {
    let data = { encodedImage: base64 };
    let url = // url is AWS Gateway
      "https://k9fwxsk4a7.execute-api.us-west-1.amazonaws.com/prod/spicyASL";
    // POST request: give data to AWS Gateway
    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        // should get translation from AI through a neural network of sign hands
        // XGBoost Algorithm: https://docs.aws.amazon.com/sagemaker/latest/dg/xgboost.html
        console.log("response: ", json);
        console.log("json[body]: ", typeof json["body"]);
      });
  };

  //deprecated
  upload_file_s3 = passed_uri => {
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: passed_uri,
      name: "image.jpg",
      type: "image/jpg"
    };

    const options = {
      keyPrefix: "userUpload/",
      bucket: BUCKET_NAME,
      region: "us-west-1",
      accessKey: ID,
      secretKey: SECRET,
      successActionStatus: 201
    };

    RNS3.put(file, options).then(response => {
      console.log(response);
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
    });
  };

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
  flex_1: {
    flex: 1
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
  bottom_bar: {
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
  },
  translate_btn_text: {
    fontSize: 20,
    alignItems: "center",
    color: "white"
  },
  translation_bar: {
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 2,
    padding: 30,
    margin: 10,
    marginBottom: 0
  },
  focus: {
    borderColor: "orange",
    borderStyle: "solid",
    borderWidth: 5,
    padding: "30%",
    marginTop: "35%",
    marginLeft: "10%",
    marginRight: "10%"
  }
});
