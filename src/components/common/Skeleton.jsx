import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'
// import {LinearGradient} from 'expo-linear-gradient'
import React, { useEffect, useRef } from 'react'

export default function Skeleton({width, height, borderRadius, style, negWidth}) {
  negWidth ? negWidth : 0
  const currentWidth = width ? width : Dimensions.get('window').width - negWidth
  // const currentWidth = Dimensions.get('window').width
  const translateX = useRef(new Animated.Value(-currentWidth)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: currentWidth,
        useNativeDriver: true,
        duration: 1000,
      })
    ).start()
  }, [currentWidth])
  return (
    <View
      style={StyleSheet.flatten([
        {
          width: currentWidth ,
          height: height,
          borderRadius: borderRadius,
          backgroundColor: 'rgba(0,0,0,0.12)',
          overflow: 'hidden',
          // alignSelf: 'stretch'
        },
        style
      ])}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: [{translateX: translateX}]
        }}
      >
        {/* <LinearGradient
          style={{width: '100%', height: '100%'}}
          colors={['transparent', '#ffffff80', 'transparent']}
          start={{x: 1,y: 1}}
        /> */}
      </Animated.View>
    </View>
  )
}