import { Text, StyleSheet, View, TextInput, TouchableOpacity, Pressable, TouchableNativeFeedback, Modal } from 'react-native'
import React, { Component, forwardRef, useEffect, useRef, useState } from 'react'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
// import Icon from '@expo/vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker'
import { color } from 'react-native-reanimated'

import PickerModal from './PickerModal';

// export default class TextField extends Component {
const TextField = forwardRef(({
  containerStyle,
  editable,
  optionalLabel,
  error,
  keyboardType,
  label,
  multiline,
  returnKeyType,
  type_input,
  secureTextEntry,
  placeholder,
  onChangeText,
  errorMessage,
  search,
  rightLabelText,
  picker,
  pickerData,
  onSubmitEditing,
  onBlur,
  onFocus,
  inputMode,
  preSelected,
  preSelectedLabel,
  value,
  ...props
}, ref) => {



  const [focus, setFocus] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  // const [value, setValue] = useState('')
  const [visibility, setVisibility] = useState(false)
  const [pickerState, setPickerState] = useState(preSelected == null ? null : preSelected)
  const [pickerStateLabel, setPickerStateLabel] = useState(preSelectedLabel == null ? null : preSelectedLabel)
  const pickerRef = useRef();

	useEffect(() => {
		if(preSelected != null && preSelected != '')
			setPickerState(preSelected)
	}, [preSelected, ])

	useEffect(() => {
		if(pickerData != null){
			for(let picker of pickerData){
				if(picker.id == pickerState)
					setPickerStateLabel(picker.name)
			}
		}
	}, [pickerState, pickerData, ])

  function open() {
    // pickerRef.current.focus();
    setFocus(true)
    setShowPicker(true)
  }

  function onPickerValueChange(itemValue) {
    setPickerState(itemValue)
    const obj = pickerData.filter(item => item['id'] == itemValue)
    obj.map((key, value) => setPickerStateLabel(key['name']))

		value(itemValue)
  }

  function close() {
    pickerRef.current.blur();
  }

  function onOptionClicked(selected){
    setPickerState(selected.id)
    setPickerStateLabel(selected.name)
    setShowPicker(false)
  }

  const blur = () => {
    setFocus(false)
    onBlur()
  }

  // useEffect(() => {
  //   // value(pickerState)
  // }, [pickerState])

  return (
    <View style={[styles.container, containerStyle]}>
      {
				label &&
        <Text style={[FONTSTYLES.inputLabel, { marginBottom: SIZES.xSmall / 2 }]}>
          {label}
          {props.required && <Text style={FONTSTYLES.asterisk}>*</Text>}
          {props.optionalLabel != '' && <Text style={[FONTSTYLES.inputLabel, { color: COLORS.gray }]}>{optionalLabel}</Text>}
        </Text>
      }
      {picker ?
        <View
          style={[
            styles.TextField,
            search && styles._search,
            focus ? styles._focus : null,
            error && styles._error,
            editable === false && { backgroundColor: '#F0F0F0' },
            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0, paddingVertical: 0, minHeight: 56 }
          ]}
        >
          <TouchableNativeFeedback onPress={open}>
            <Text style={[styles.pickerText, { color: pickerState == null ?  COLORS.gray : 'black' }]}>{pickerStateLabel == null || pickerStateLabel == 0 ? placeholder : pickerStateLabel}</Text>
          </TouchableNativeFeedback>
          <PickerModal
            isModal={showPicker}
            title={label}
            value={{ id: pickerState, name: pickerStateLabel, }}
            arr_option={pickerData}
            onModalClosed={() => setShowPicker(false)}
            onOptionClicked={(selected) => onOptionClicked(selected)}/>
          {/* <Picker
            ref={pickerRef}
            selectedValue={pickerState}
            onValueChange={(itemValue) => onPickerValueChange(itemValue)}
            onBlur={() => setFocus(false)}
            mode='dropdown'
            enabled={editable}>
            <Picker.Item label={`-` + placeholder + `-`} enabled={false} />
            {pickerData?.map((item, index) => (
              <Picker.Item label={item.name} value={item.id} key={index} />
            ))}
          </Picker> */}
          
        </View>
        :
        <View style={[
          styles.TextField,
          search && styles._search,
          error && styles._error,
          focus ? styles._focus : null,
          editable === false && { backgroundColor: '#F0F0F0' },
          { flexDirection: 'row', alignItems: 'center'}
        ]}>
          {
						search &&
            <Icon
              name={'search'}
              size={SIZES.medium}
              color={COLORS.gray}
              style={{ marginRight: 10 }}/>
          }
          <TextInput
            ref={ref}
            onSubmitEditing={onSubmitEditing}
            autoComplete={Platform.OS === 'web' ? 'none' : 'off'}
            autoCorrect={false}
            cursorColor={COLORS.primary}
            selectionColor={COLORS.primary}
            editable={(editable == null ? true : editable)}
            importantForAutofill={'no'}
            keyboardType={(keyboardType == null ? 'default' : keyboardType)}
            multiline={(multiline == null ? false : multiline)}
            secureTextEntry={secureTextEntry && !visibility}
            onBlur={(v) => onBlur ? blur() : setFocus(false)}
            onChangeText={onChangeText}
            onFocus={() => onFocus ? (onFocus, setFocus(true)) : setFocus(true)}
            placeholder={placeholder}
            returnKeyType={(returnKeyType == null ? 'next' : returnKeyType)}
            style={[
              // styles.TextField,
              // this.state.focus ? styles._focus : null,
              // props.error_type !== props.type_input ? styles._error : null,
              multiline && { textAlignVertical: 'top' },
              { flex: 1, color: COLORS.black_12, },
            ]}
            value={value}
            {...props}
          />
          {
            secureTextEntry != null &&
            <Pressable onPress={v => setVisibility(!visibility)}>
              <Icon
                name={visibility ? 'visibility' : 'visibility-off'}
                size={SIZES.medium}
                color={visibility ? COLORS.primary : COLORS.gray}
              />
            </Pressable>
          }
          {
            rightLabelText != null &&
            <Text style={styles.rightLabelText}>{rightLabelText}</Text>
          }
        </View>
      }
      { error && <Text style={styles.errorMessage}>{errorMessage}</Text> }
    </View>
  )
})
// }

export default TextField

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: SIZES.small
  },
  TextField: {
    // flex: 1,
    // ...FONTSTYLES.TextField,
    paddingHorizontal: SIZES.small,
    paddingVertical: Platform.OS == 'ios' ? SIZES.xSmall : 0,
    borderWidth: 1,
    borderRadius: SIZES.medium / 2,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    // minHeight: 48
  },
  _search: {
    borderColor: COLORS.lightWhite2
  },
  _focus: {
    borderColor: COLORS.primary
  },
  _error: {
    borderColor: COLORS.red
  },
  errorMessage: {
    color: COLORS.red,
    fontFamily: FONTS.bold,
    fontSize: SIZES.xSmall,
    marginTop: SIZES.xSmall / 2
  },
  rightLabelText: {
    ...FONTSTYLES.TextField,
    color: COLORS.gray,
    position: 'absolute',
    right: 0,
    // backgroundColor: 'red',
    padding: 16,
    borderLeftWidth: 1,
    borderColor: COLORS.gray
  },
  pickerText: {
    // ...FONTSTYLES.TextField,
    // fontSize: SIZES.medium,
    flex: 1, paddingHorizontal: SIZES.medium, 
    paddingVertical: SIZES.small,
    color: COLORS.gray
  }

})