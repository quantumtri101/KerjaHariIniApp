import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native'
import React, { useCallback, useState } from 'react'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import { Button, Header } from '../../components'
import Feather from 'react-native-vector-icons/Feather';
import { formatCurrency } from '../../utils'
import Base from '../../utils/base'
import { useEffect } from 'react'

export default function RequestPayout(props){
  var base = new Base()
  const [amount, setAmount] = useState('0')
  const [buttonEnable, setButtonEnable] = useState(false)
	const [arrNum] = useState([
		['1', '2', '3',],
		['4', '5', '6',],
		['7', '8', '9',],
		['0', '000', 'delete',],
	])

  useEffect(() => {
		setButtonEnable(parseFloat(amount) >= 10000 && parseFloat(amount) <= parseFloat(props.route.params.maxAmount))
  },[amount])

	function onKeypadClicked(index, index1){
		var keypad = arrNum[index][index1]
		if(keypad == 'delete')
			setAmount(amount.length > 1 ? amount.substring(0, amount.length - 1) : '0')
		else
			setAmount(amount == '0' ? keypad : (amount + keypad))
	}

  return (
    <View style={{ flex: 1, }}>
      <View style={{ backgroundColor: 'white' }}>
        <Header backButton title={'Request Penarikan'} navigation={props.navigation}/>
      </View>

			<View style={styles.mainContainer}>
        <Text style={FONTSTYLES.med14_dBlue}>Masukkan Jumlah</Text>
        <Text style={styles.amount}>{formatCurrency(amount)}</Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
          <Text style={FONTSTYLES.med14_dBlue}>Jumlah Gaji Anda: Rp. {props.route.params.maxAmount.toLocaleString(base.priceFormatIDR)}</Text>
        </View>

				{
					arrNum.map((arr, index) =>
						<View style={{ flexDirection: 'row' }}>
							{
								arr.map((data, index1) =>
									<TouchableNativeFeedback
										onPress={() => onKeypadClicked(index, index1)}>
										<View style={styles.inputButtonContainer}>
											{
												data == 'delete' ?
												<Feather name="delete" size={24} color={COLORS.secondary} />
												:
												<Text style={styles.inputButtonText}>{data}</Text>
											}
										</View>
									</TouchableNativeFeedback>
								)
							}
						</View>
					)
				}

        <View style={{ padding: 16 }}>
          <Button
            title={'Lanjut'}
            onPress={() => props.navigation.navigate('Earning', {screen: 'PayoutReview', params: {amount: parseFloat(amount)}})}
            disable={!buttonEnable}/>
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: SIZES.medium,
    gap: SIZES.medium
  },
  amount: {
    flex: 1,
    ...FONTSTYLES.med14_dBlue,
    fontSize: 45,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  inputContainer: {
    backgroundColor: 'white'
  },
  inputButtonContainer: {
    flex: 1,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputButtonText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xLarge,
    color: COLORS.secondary,
  }
})