import React from 'react'
// import { Stack, useRouter } from 'expo-router'
import { StartFinish } from '../../components'
import { svg_applySuccess } from '../../assets'

export default function ApplySuccess(props) {
  // const router = useRouter()
  const title = 'Terima kasih,\nlamaran anda diterima'
  const subtitle = 'Harap menunggu response dari Admin untuk lamaran Anda.'
  return (
    <>
      <StartFinish
        svg={svg_applySuccess}
        title={title}
        subtitle={subtitle}
        buttonTitle={'Lanjut'}
        onPress={() => props.navigation.replace('Home', {screen: 'ListLamaranTab', params: {refresh: true, }})}/>
    </>
  )
}