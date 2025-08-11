import { StyleSheet } from "react-native";
import { COLORS, FONTSTYLES, SIZES } from "../../constants";


const styles = StyleSheet.create({
  container:{
    paddingHorizontal: SIZES.xLarge,
    paddingVertical: SIZES.xSmall
  },
  scrollView:{
    flex: 1,
    backgroundColor: '#fff'
  },
  space_1:{
    marginTop: 44,
    ...FONTSTYLES.inputLabel
  },
  test: {
    marginTop: 20
  },
  textInput: {
    borderColor: COLORS.gray
  }
})

export default styles