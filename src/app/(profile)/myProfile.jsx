import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import React, { useState, useEffect, useCallback } from "react";
// import { Stack, useRouter } from "expo-router";
import { COLORS, SIZES } from "../../constants";
import { Button, Header, TextField, HeaderBack, } from "../../components/common";
// import { MaterialIcons } from "@expo/vector-icons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useFetch from "../../hook/useFetch";
// import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import "moment/locale/id";
import { LocalSvg } from "react-native-svg/css";
import { svg_avatar } from "../../assets";
import Base from "../../utils/base";

export default function MyProfile(props) {
	var base = new Base()
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [image, setImage] = useState(null);
  const [apiImage, setApiImage] = useState(null);

  // const router = useRouter();

  const getProfile = useFetch("GET", "auth/profile", "");
  const postProfile = useFetch(
    "POST",
    "auth/change-profile",
    {
      email: email,
      name: name,
      phone: phone,
      image: image ? image.assets[0].base64 : null,
    },
    false
  );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibrary({
      includeBase64: true,
    });

    if (!result.canceled) {
      setImage(result);
    }
  };

  const handleButton = () => {
    postProfile.fetchData();
  };

  useEffect(() => {
    setName(getProfile.data.data?.name);
    setEmail(getProfile.data.data?.email);
    setPhone(getProfile.data.data?.phone);
  }, [getProfile.data]);

  useEffect(() => {
    postProfile.data.status == "success"
      ? Alert.alert("Update Profil", "Berhasil", [
          { text: "OK", onPress: () => props.navigation.replace('Home', {screen: 'Profile', params: {}}) },
        ])
      : postProfile.data.status == "error"
      ? alert(postProfile.data.status)
      : null;
  }, [postProfile.data]);

  useEffect(() => {
    setApiImage(
      `${base.host}/image/user?file_name=${
        getProfile.data.data?.file_name
      }&rnd=${moment().format("YYYYMMDDHHmmss")}`
    );
  }, [getProfile.isLoading]);

  return (
    <>
      {/* <Stack.Screen
        options={{
          header: () => null,
        }}
      /> */}
      <View style={{ backgroundColor: "white" }}>
        <Header backButton title={"Profil"} navigation={props.navigation}/>
      </View>
      {getProfile.isLoading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      ) : (
        <>
          <ScrollView
            style={{
              backgroundColor: "white",
              paddingHorizontal: SIZES.xLarge,
            }}
          >
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <View
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getProfile.data.data?.file_name == null && (
                    <LocalSvg asset={svg_avatar} width={100} height={100} />
                  )}
                  {getProfile.data.data?.file_name && (
                    <Image
                      source={{ uri: apiImage }}
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                  {image && (
                    <Image
                      source={{ uri: image.assets[0].uri }}
                      style={{
                        width: 100,
                        height: 100,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                      }}
                    />
                  )}
                </View>
                <TouchableOpacity
                  style={styles.changeAvatarTouchable}
                  onPress={pickImage}
                >
                  <View style={styles.changeAvatarButtonContainer}>
                    <MaterialIcons
                      name="edit"
                      size={SIZES.xLarge}
                      color={COLORS.white}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TextField
              containerStyle={{ marginTop: 8 }}
              keyboardType={"default"}
              label={"Nama"}
              placeholder={"nama"}
              onChangeText={(text) => setName(text)}
              value={name}
            />
            <TextField
              containerStyle={{ marginTop: 8 }}
              keyboardType={"default"}
              label={"Email"}
              placeholder={"Email"}
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <TextField
              editable={false}
              containerStyle={{ marginTop: 8 }}
              keyboardType={"phone-pad"}
              label={"No. Telepon"}
              placeholder={"No. Telepon"}
              onChangeText={(text) => setPhone(text)}
              value={phone}
            />
          </ScrollView>
          <View style={{ backgroundColor: "white", padding: SIZES.medium }}>
            {postProfile.isLoading ? (
              <ActivityIndicator size={"large"} color={COLORS.primary} />
            ) : (
              <Button title={"Simpan"} onPress={handleButton} />
            )}
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.medium * 3,
  },
  avatarContainer: {
    width: SIZES.xSmall * 10,
    height: SIZES.xSmall * 10,
    // backgroundColor: COLORS.primary,
    borderRadius: SIZES.xSmall * 10,
  },
  changeAvatarTouchable: {
    position: "absolute",
    bottom: 0,
    right: -8,
  },
  changeAvatarButtonContainer: {
    width: SIZES.xSmall * 4,
    height: SIZES.xSmall * 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.xSmall * 4,
    zIndex: 999,
  },
});
