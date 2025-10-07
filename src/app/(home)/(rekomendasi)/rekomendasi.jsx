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
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }} >
      <Header noInsets withNotif title={'Rekomendasi'} navigation={props.navigation}/>

      <Tab.Navigator tabBar={props => <CustomTopTabBar {...props} />} style={{}}>
        <Tab.Screen name="Tawaran Pekerjaan" component={TawaranPekerjaan} />
        <Tab.Screen name="Semua Pekerjaan" component={SemuaPekerjaan}/>
      </Tab.Navigator>
    </View>
  );
}