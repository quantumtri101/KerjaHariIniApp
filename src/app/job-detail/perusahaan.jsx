import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { COLORS, FONTSTYLES, SIZES } from "../../constants";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GalleryComponent from "../../components/common/Gallery";
import { Skeleton } from "../../components/common/";

import Base from "../../utils/base";

export default function Perusahaan({ onStateChange, data, isLoading, navigation, }) {
	var base = new Base()

  const [images, setImages] = useState([]);

  const [conHeight, setConHeight] = useState(0);

  const find_dimensions = (layout) => {
    const { x, y, width, height } = layout;
    setConHeight(height);
    onStateChange(height);
  };
  const kualifikasi = [
    "Lorem ipsum dolor sit amet,",
    "Lorem ipsum dolor sit amet,",
    "Lorem ipsum dolor sit amet,",
    "Lorem ipsum dolor sit amet,",
    "Lorem ipsum dolor sit amet,",
  ];
  const isFocused = useIsFocused();

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    var arr = []
    for(let image of data.image)
      arr.push(image.image_url)
    setImages(arr)
  }, []);

	if(isFocused)
  return (
    <View
      style={styles.mainContainer}
      onLayout={(event) => find_dimensions(event.nativeEvent.layout)}>
      <View>
        <Text style={styles.detailTitle}>Detail</Text>
        {
          isLoading ?
          <Skeleton
            negWidth={SIZES.xxLarge * 2}
            height={SIZES.xSmall * 2}
            borderRadius={SIZES.xSmall}
          />
          :
          <Text
            numberOfLines={isExpanded ? undefined : 3}
            style={styles.detailText}>
            {data.company.name}
            {"\n"}
            {data.company.address}
            {"\n"}
            {data.company.phone}
          </Text>
        }
      </View>

      <View style={{  }}>
        <Text style={styles.kualifikasiTitle}>Gallery</Text>
        {
          isLoading ?
          <Skeleton
            width={SIZES.xxLarge * 2}
            height={SIZES.xxLarge * 2}
            borderRadius={SIZES.small}
          />
          :
          <GalleryComponent images={images} />
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: SIZES.xxLarge,
    paddingVertical: SIZES.large,
  },
  detailTitle: {
    ...FONTSTYLES.med10_black,
    marginBottom: 5,
    fontWeight: 700,
		fontSize: 14,
  },
  detailText: {
    ...FONTSTYLES.reg10_7373,
    lineHeight: SIZES.large,
  },
  kualifikasiTitle: {
    ...FONTSTYLES.med10_black,
    marginTop: SIZES.medium,
    marginBottom: 5,
    fontWeight: 700,
		fontSize: 14,
  },
  kualifikasiItemContainer: {
    marginBottom: 5,
    flexDirection: "row",
    gap: SIZES.small,
    alignItems: "flex-start",
  },

  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: -5,
  },
  imageContainer: {
    flex: 1,
    aspectRatio: 1, // Square aspect ratio
    margin: 5,
    backgroundColor: "#C4C4C4",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  lastBoxContainer: {
    flex: 1,
    aspectRatio: 1, // Square aspect ratio
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#C4C4C4",
    justifyContent: "center",
    alignItems: "center",
  },
  lastBoxText: {
    position: "absolute",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  empty: {
    ...FONTSTYLES.reg10_7373,
    // ...FONTSTYLES.p_black_12,
    paddingHorizontal: SIZES.medium,
  },
});
