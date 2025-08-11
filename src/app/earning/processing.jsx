import React from 'react'
// import { Stack, useRouter } from 'expo-router'
import { StartFinish } from '../../components'
import { svg_resumeSuccess } from '../../assets'

export default function Processing(props) {
  // const router = useRouter()
  const title = 'Permintaan Telah Terkirim'
  const subtitle = 'Kami akan mengirimkan notifikasi\njika dana sudah dikirimkan'
  return (
    <>
      {/* <Stack.Screen options={{header: () => null}} /> */}
      <StartFinish
        svg={svg_resumeSuccess}
        title={title}
        subtitle={subtitle}
        buttonTitle={'Lanjut'}
        onPress={() => props.navigation.replace('Home', {screen: 'ProfileTab', params: {}})}
      />
    </>
  )
}
