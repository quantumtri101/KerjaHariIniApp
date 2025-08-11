import { ActivityIndicator, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import Header from '../../components/common/header/header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTSTYLES, SIZES } from '../../constants'
import { Button, FieldPicker, TextField, HeaderResume, } from '../../components'
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useFetch from '../../hook/useFetch'
import Base from "../../utils/base";

const statusData = [
  { name: 'Belum Kawin', id: 'unmarried', },
  { name: 'Kawin', id: 'married', },
  { name: 'Cerai Hidup', id: 'divorce_by_living', },
  { name: 'Cerai Mati', id: 'divorce_by_death', },
]

export default function Informasi02(props) {
	var base = new Base()
  // const router = useRouter()
  // const { reviewResume, editResume } = useLocalSearchParams()
  const getEducation = useFetch("GET", "education/all", {})
  const getBank = useFetch("GET", "bank/all", {})
  const getResume = useFetch("GET", "resume", {}, false)

  const heightRef = useRef()
  const weightRef = useRef()

  let data = {}

	const [resumeData, setResumeData] = useState({})
  const [education, setEducation] = useState('')
  const [marital_status, setMarital_status] = useState('')
  const [bank_id, setBank_id] = useState('')
  const [acc_no, setAcc_no] = useState('')
	const [acc_name, setAcc_name] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [id_number, setId_number] = useState('')

	const [arrEducation, setArrEducation] = useState([])
	const [arrMaritalStatus, setArrMaritalStatus] = useState([
		{ name: 'Belum Kawin', id: 'unmarried', },
		{ name: 'Kawin', id: 'married', },
		{ name: 'Cerai Hidup', id: 'divorce_by_living', },
		{ name: 'Cerai Mati', id: 'divorce_by_death', },
	])
	const [arrBank, setArrBank] = useState([])

  const [heightError, setHeightError] = useState(false)
  const [weightError, setWeightError] = useState(false)

	const [preSelectedLabelMaritalStatus, setPreSelectedLabelMaritalStatus] = useState('')
  const [preSelectedLabelEducation, setPreSelectedLabelEducation] = useState('')
  const [preSelectedLabelBank, setPreSelectedLabelBank] = useState('')

  const postResume = useFetch('POST', 'resume/edit', {
    "id": resumeData.id,
    "marital_status": marital_status,
    "height": height,
    "weight": weight,
    "acc_no": acc_no,
		"acc_name": acc_name,
    "id_no": id_number,
    "bank_id": bank_id,
    "education_id": education
  }, false)

	useEffect(() => {
		// if(props.route.params.editResume)
		// 	getResume.refetch()

		if(props.route.params.reviewResume)
			handleEdit()
		else if(props.route.params.resumeData == null){
			AsyncStorage.setItem('lastResumePage', 'Informasi02')
			handleEdit()
		}

		if(props.route.params.resumeData != null)
			setResumeData(props.route.params.resumeData)
	}, [])

	const handleEdit = async () => {
		var informasi_02 = await AsyncStorage.getItem('informasi_02')
		if(informasi_02 != null)
			setResumeData(JSON.parse(informasi_02))
	}

	function getObjectArr(arrTemp, id){
		var temp = {}
		for(let data of arrTemp){
			if(data.id == id){
				temp = data
				break
			}
		}
		return temp
	}

  const handleNextButton = async () => {
    if (
      marital_status == null ||
      height == null ||
      weight == null ||
      education == null ||
      bank_id == null ||
      acc_no == null ||
			acc_name == null ||
      id_number == null
    )
      ToastAndroid.show('Silahkan lengkapi informasi anda', ToastAndroid.SHORT)
    else {
			var tempEducation = getObjectArr(arrEducation, education)
			var tempBank = getObjectArr(arrBank, bank_id)
			var tempMaritalStatus = getObjectArr(arrMaritalStatus, marital_status)

      data = {
        education: tempEducation,
        marital_status: tempMaritalStatus,
        bank: tempBank,
        id_no: id_number,
        acc_no: acc_no,
				acc_name: acc_name,
        height: height,
        weight: weight
      }

      if (props.route.params.reviewResume){
				await AsyncStorage.setItem('informasi_02', JSON.stringify(data))
				props.route.params.onRefresh()
				props.navigation.goBack()
			}
			else if (props.route.params.editResume){
				postResume.setRefetch({
					id: resumeData.id,
					marital_status_id: marital_status,
					height: height,
					weight: weight,
					acc_no: acc_no,
					acc_name: acc_name,
					id_no: id_number,
					bank_id: tempBank.id,
					education_id: tempEducation.id,
				})
			}
			else{
				await AsyncStorage.setItem('informasi_02', JSON.stringify(data))
				props.navigation.navigate('Resume', {screen : 'PengalamanKerja', params: {}, })
			}
    }
  }

	useEffect(() => {
		if(resumeData.marital_status != null){
			var temp = {}
			for(let status of statusData){
				if(resumeData.marital_status == status.id){
					temp = status
					break
				}
			}

			setMarital_status(temp.id)
			setHeight(resumeData.height.toString())
			setWeight(resumeData.weight.toString())
			setAcc_no(resumeData.acc_no)
			setAcc_name(resumeData.acc_name)
			setId_number(resumeData.id_no)
			setEducation(resumeData.education.id)
			setBank_id(resumeData.bank.id)
		}
	}, [resumeData, ])

	useEffect(() => {
		if(getEducation.data.status != null){
			if(getEducation.data.status == 'success'){
				setArrEducation(getEducation.data.data);
			}
			else
				base.alertSnackbar(getEducation.data.message)
		}
	}, [getEducation.data])

	useEffect(() => {
		if(getBank.data.status != null){
			if(getBank.data.status == 'success'){
				setArrBank(getBank.data.data)
			}
			else
				base.alertSnackbar(getBank.data.message)
		}
	}, [getBank.data])

  useEffect(() => {
		if(id_number != null)
    	setId_number(id_number.substring(0, id_number.length > 16 ? 16 : id_number.length))
  }, [id_number, ])

  // useEffect(() => {
	// 	if(getResume.data.status != null){
	// 		if(getResume.data.status == 'success'){
	// 			setResumeData(getResume.data.data)
	// 		}
	// 		else
	// 			base.alertSnackbar(getResume.data.message)
	// 	}
  // }, [getResume.data])

  useEffect(() => {
		if(postResume.data.status != null){
			if(postResume.data.status == 'success'){
				props.navigation.goBack()
				props.route.params.onRefresh()
			}
			else
				base.alertSnackbar(postResume.data.message)
		}
  }, [postResume.data])

  return (
    <View style={{ flex: 1, }}>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <View style={{ paddingVertical: SIZES.medium, backgroundColor: 'white' }}>
        <Header backButton title={props.route.params.editResume ? 'Edit Resume' : 'Pengisian Resume'} navigation={props.navigation}/>
      </View>
			<HeaderResume numText='2' title="Informasi Anda"/>

      {
        (getBank.isLoading || getEducation.isLoading) ?
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size={'large'} color={COLORS.primary} />
          </View>
          :
          <View style={{ flex: 1, }}>
            <ScrollView style={{ backgroundColor: 'white', paddingHorizontal: SIZES.xLarge }}>
            	<TextField
              	containerStyle={{ marginTop: 8 }}
              	picker
              	pickerData={arrMaritalStatus}
              	label={'Status'}
              	placeholder={'Pilih Status'}
              	required
              	value={(v) => setMarital_status(v)}
              	preSelected={marital_status}
              	preSelectedLabel={preSelectedLabelMaritalStatus}
            	/>

            	<View style={{ flexDirection: 'row', }}>
              	<TextField
                	containerStyle={{ flex: 1, marginRight: SIZES.medium / 2, }}
                	keyboardType={'numeric'}
                	label={'Tinggi Badan'}
                	placeholder={'0'}
                	required
                	rightLabelText={'CM'}
                	value={height}
                	onChangeText={(v) => setHeight(v)}/>
              	<TextField
                	containerStyle={{ flex: 1, marginLeft: SIZES.medium / 2, }}
                	keyboardType={'numeric'}
                	label={'Berat Badan'}
                	placeholder={'0'}
                	required
                	rightLabelText={'KG'}
                	value={weight}
                	onChangeText={(v) => setWeight(v)}/>
            	</View>

            	<TextField
              	picker
              	pickerData={arrEducation}
              	label={'Pendidikan Akhir'}
              	placeholder={'Pilih Pendidikan Akhir'}
              	required
              	value={(v) => setEducation(v)}
              	preSelected={education}
              	preSelectedLabel={preSelectedLabelEducation}
            	/>

            	<TextField
              	picker
              	pickerData={arrBank}
              	label={'Bank'}
              	placeholder={'Pilih Bank'}
              	required
              	value={(v) => setBank_id(v)}
              	preSelected={bank_id}
              	preSelectedLabel={preSelectedLabelBank}
            	/>

            	<TextField
              	containerStyle={{ flex: 1 }}
              	keyboardType={'numeric'}
              	label={'No. Rekening'}
              	placeholder={'0000-0000-0000'}
              	onChangeText={(v) => setAcc_no(v)}
              	value={acc_no}
              	required
            	/>

							<TextField
								containerStyle={{ flex: 1 }}
								label={'Nama Rekening'}
								placeholder={'Test'}
								onChangeText={(v) => setAcc_name(v)}
								value={acc_name}
								required
							/>

            	<TextField
              	containerStyle={{ flex: 1 }}
              	keyboardType={'numeric'}
              	label={'No. KTP'}
              	placeholder={'Masukkan 16 digit Nomor KTP'}
              	onChangeText={(v) => setId_number(v)}
              	value={id_number}
              	required
            	/>

            </ScrollView>
            <View style={{ padding: 16, backgroundColor: COLORS.white }}>
              {
								postResume.isLoading ?
                	<ActivityIndicator size={'large'} color={COLORS.primary} />
                :
                	<Button title={props.route.params.reviewResume ? 'Simpan' : props.route.params.editResume ? 'Simpan' : 'Lanjut'} style={{ height: 30 }} onPress={handleNextButton} />
              }
            </View>
          </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  numBox: {
    ...FONTSTYLES.sBold16_secondary,
    width: 35,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray
  }
})