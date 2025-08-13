import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
// import { Stack } from "expo-router";
import { Header } from "../../components/common";
import { SIZES } from "../../constants";
import { WebView } from "react-native-webview";
import useFetch from "../../hook/useFetch";
import Base from "../../utils/base";

export default function TermCondition(props) {
	var base = new Base()

  return (
    <>
      {/* <Stack.Screen
        options={{
          header: () => null,
        }}
      /> */}
      <View style={{ backgroundColor: "white" }}>
        <Header backButton title={"Syarat dan Ketentuan"} navigation={props.navigation}/>
      </View>
      <WebView
        originWhitelist={["*"]}
        source={{ uri: `${base.host}/term-condition` }}
      />
    </>
  );
}

const styles = StyleSheet.create({});
