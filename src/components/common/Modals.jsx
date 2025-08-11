import { Text, StyleSheet, View, Modal, Dimensions, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import { COLORS, FONTSTYLES, SIZES } from '../../constants';
import Button from './Button';
// import { useRouter } from 'expo-router';
import { LocalSvg } from 'react-native-svg/css'

export default function Modals({
  buttonTitle,
  desc,
  onPress,
  svg,
  title,
  visible,
  isPreload,
  customButton,
  titleSmall,
  cancelButton,
  ...props
}) {

  // const router = useRouter()
  const { width, height } = Dimensions.get('window');

  return (
    <Modal
      presentationStyle='overFullScreen'
      visible={visible}
      animationType='fade'
      transparent
      {...props}
    >
      <View style={styles.fullContainer}>
        <View style={[styles.boxContainer, { width: width - 48 }]}>
          {isPreload ?
            <ActivityIndicator
              size={'large'}
              color={COLORS.primary}
            />
            :
            <>
              <LocalSvg
                asset={svg}
                width={195}
                height={146}
              />
              <Text style={titleSmall ? styles.titleSmall : styles.title}>{title}</Text>
              {desc ?
                <Text style={styles.desc}>{desc}</Text>
                :
                <View style={{ height: SIZES.medium }} />
              }
              {customButton ?
                customButton
                :
                <Button
                  title={buttonTitle}
                  onPress={() =>
                    onPress()
                  }
                  style={{
                    width: 150,
                    marginTop: SIZES.large
                  }}
                />
              }
              {cancelButton}
            </>
          }
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: SIZES.xLarge,
    paddingHorizontal: SIZES.xLarge,
    paddingVertical: SIZES.xSmall * 3,
    position: 'absolute',
    left: 0,
    borderRadius: 8
  },
  title: {
    ...FONTSTYLES.h1,
    textAlign: 'center',
    marginTop: SIZES.xSmall
  },
  titleSmall: {
    ...FONTSTYLES.h1,
    textAlign: 'center',
    marginTop: SIZES.large,
    fontSize: 14,
    lineHeight: 20
  },
  desc: {
    ...FONTSTYLES.p_black_12,
    textAlign: 'center',
    // marginTop: SIZES.large
  }
})