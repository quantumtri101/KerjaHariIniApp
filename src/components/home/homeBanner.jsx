import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS, SIZES } from "../../constants";
// import { LocalSvg } from "react-native-svg";
import {
  svg_homeBannerPattern_01,
  svg_homeBannerPattern_02,
} from "../../assets";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { Dimensions } from "react-native";
import moment from "moment";
import "moment/locale/id";
import Base from "../../utils/base";

const HomeBanner = ({ data, title, bgImage, btnTitle, onPress, navigation, }) => {
	var base = new Base()
  const [width, setWidth] = useState();
  useEffect(() => {
    setWidth(Dimensions.get("screen").width - SIZES.medium * 2);
  }, []);

  return (
    <SwiperFlatList
      data={data}
      // ItemSeparatorComponent={() => <View style={{width: 8, backgroundColor: 'Red'}} />}
      autoplay
      autoplayDelay={4}
      // index={2}
      autoplayLoop
      // autoplayInvertDirection
      renderItem={({ item, index }) => (
        <Image
          key={index}
          style={{
            width: width,
            aspectRatio: 9 / 4,
            borderRadius: SIZES.medium,
          }}
          source={{ uri: `${base.host}/image/banner?file_name=${item.file_name}&rnd=${moment().format("YYYYMMDDHHmmss")}`, }}
        />
      )}
      showPagination
      ItemSeparatorComponent={<View style={{ width: SIZES.medium * 2 }} />}
      renderAll
      autoplayLoopKeepAnimation
      paginationActiveColor={COLORS.primary}
      paginationDefaultColor={COLORS.tabBarInactive}
      paginationStyleItem={{ width: SIZES.small, height: SIZES.small }}
      snapToAlignment="center"
      horizontal/>
  );
};
// <View style={styles.mainContainer}>
//   <LocalSvg asset={svg_homeBannerPattern_01} style={styles.pattern01}/>
//   <LocalSvg asset={svg_homeBannerPattern_02} style={styles.pattern02}/>
//   <Text style={styles.bannerText}>Banner /{'\n'}Slider</Text>
//   <View style={styles.buttonContainer}>
//     <TouchableOpacity style={styles.button}>
//       <Text style={styles.buttonText}>Get Started</Text>
//     </TouchableOpacity>
//   </View>
// </View>

export default HomeBanner;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.xSmall,
    height: 144,
    justifyContent: "space-between",
    paddingHorizontal: SIZES.xLarge,
    paddingVertical: SIZES.medium,
  },
  bannerText: {
    color: "#FAFBFD",
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    flexShrink: 0,
    paddingHorizontal: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.large,
  },
  buttonText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: SIZES.small,
    fontFamily: FONTS.bold,
    lineHeight: SIZES.medium * 2,
  },
  pattern01: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  pattern02: {
    position: "absolute",
    bottom: 0,
    right: SIZES.small,
  },
});
