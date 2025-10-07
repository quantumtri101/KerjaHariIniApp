import React from 'react'
import { StartFinish } from '../../components'
import { svg_resumeSuccess } from '../../assets'

export default function Processing(props) {
  const title = 'Permintaan Telah Terkirim'
  const subtitle = 'Kami akan mengirimkan notifikasi\njika dana sudah dikirimkan'
  return (
    <View>
      <StartFinish
        svg={svg_resumeSuccess}
        title={title}
        subtitle={subtitle}
        buttonTitle={'Lanjut'}
        onPress={() => props.navigation.replace('Home', {screen: 'ProfileTab', params: {}})}
      />
    </View>
  )
}
