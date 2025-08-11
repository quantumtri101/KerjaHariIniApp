import { Animated, Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTSTYLES, SIZES } from "../../../constants";
import { createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Header from "../../../components/common/header/header";
import { CustomTopTabBar, Card } from "../../../components";
import TawaranPekerjaan from "./tawaranPekerjaan";
import SemuaPekerjaan from "./semuaPekerjaan";

const Tab = createMaterialTopTabNavigator();

export default function Rekomendasi(props) {
  const DH = Dimensions.get('screen').height
  const TabNavHeight = Dimensions.get('screen').height - useSafeAreaInsets().top - 170
  return (
    <View style={{ flex: 1, marginTop: useSafeAreaInsets().top, backgroundColor: COLORS.white }} >
      <Header noInsets withNotif title={'Rekomendasi'} navigation={props.navigation}/>

      <Tab.Navigator tabBar={props => <CustomTopTabBar {...props} />} style={{}}>
        <Tab.Screen name="Tawaran Pekerjaan" component={TawaranPekerjaan} />
        <Tab.Screen name="Semua Pekerjaan" component={SemuaPekerjaan}/>
      </Tab.Navigator>
    </View>
  );
}