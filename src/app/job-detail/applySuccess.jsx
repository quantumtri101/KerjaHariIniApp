import React from 'react'
import { StartFinish } from '../../components'
import { svg_applySuccess } from '../../assets'

export default function ApplySuccess(props) {
  const title = 'Terima kasih,\nlamaran anda diterima'
  const subtitle = 'Harap menunggu response dari Admin untuk lamaran Anda.'
  
  return (
    <View>
      <StartFinish
        svg={svg_applySuccess}
        title={title}
        subtitle={subtitle}
        buttonTitle={'Lanjut'}
        onPress={() => props.navigation.replace('Home', {screen: 'ListLamaranTab', params: {refresh: true, }})}/>
    </View>
  )
}