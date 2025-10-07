import React, {Component} from 'react';
import { Text, View, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {CommonActions, NavigationContainer, StackActions,} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { COLORS, FONTSTYLES, SIZES } from "../constants";
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Home from '../app/(home)/home';
import ListLamaran from '../app/(home)/listLamaran';
import Profile from '../app/(home)/profile';
import Rekomendasi from '../app/(home)/(rekomendasi)/rekomendasi';
import SemuaPekerjaan from '../app/(home)/(rekomendasi)/semuaPekerjaan';
import TawaranPekerjaan from '../app/(home)/(rekomendasi)/tawaranPekerjaan';


export default function RoutesHome(props) {

	const HomeStack = createStackNavigator()
	const IndexTab = createBottomTabNavigator()

	const headerNavBar = {
		title : null,
		headerShown : false,
	}

	return(
		<IndexTab.Navigator
			tabBarOptions={{
				labelStyle : {top : -3, fontWeight : 'bold', position : 'relative'},
			}}
			options={headerNavBar}>

			<IndexTab.Screen
				name="HomeTab"
				children={() => <Home navigation={props.navigation}/>}
				options={{
					headerShown : false,
					tabBarLabel: 'Home',
					tabBarIcon: ({focused, tintColor}) => <MaterialIcons name='home' color={focused ? COLORS.primary : COLORS.gray} size={24} />,
					tabBarActiveTintColor: COLORS.primary,
				}}
				listeners={({navigation, route}) => ({
					tabPress: (e) => props.navigation.replace('Home', {screen: 'HomeTab', }),
				})}/>

			<IndexTab.Screen
				name="RecommendationTab"
				children={() => <Rekomendasi navigation={props.navigation}/>}
				options={{
					headerShown : false,
					tabBarLabel: 'Rekomendasi',
					tabBarIcon: ({focused, tintColor}) => <MaterialIcons name='check-circle' color={focused ? COLORS.primary : COLORS.gray} size={22} />,
					tabBarActiveTintColor: COLORS.primary,
				}}
				listeners={({navigation, route}) => ({
					tabPress: (e) => props.navigation.replace('Home', {screen: 'RecommendationTab', }),
				})}/>

			<IndexTab.Screen
				name="ListLamaranTab"
				children={() => <ListLamaran navigation={props.navigation}/>}
				options={{
					headerShown : false,
					tabBarLabel: 'List Lamaran',
					tabBarIcon: ({focused, tintColor}) => <MaterialIcons name='book' color={focused ? COLORS.primary : COLORS.gray} size={20} />,
					tabBarActiveTintColor: COLORS.primary,
				}}
				listeners={({navigation, route}) => ({
					tabPress: (e) => props.navigation.replace('Home', {screen: 'ListLamaranTab', }),
				})}/>

			<IndexTab.Screen
				name="ProfileTab"
				children={() => <Profile navigation={props.navigation}/>}
				options={{
					headerShown : false,
					tabBarLabel: 'Profile',
					tabBarIcon: ({focused, tintColor}) => <MaterialIcons name='account' color={focused ? COLORS.primary : COLORS.gray} size={20} />,
					tabBarActiveTintColor: COLORS.primary,
				}}
				listeners={({navigation, route}) => ({
					tabPress: (e) => props.navigation.replace('Home', {screen: 'ProfileTab', }),
				})}/>
		</IndexTab.Navigator>
	)
}