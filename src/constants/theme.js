const LIPSUM = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero labore tenetur obcaecati perspiciatis repellendus, quaerat officiis aut dicta alias veritatis recusandae ab autem eveniet eligendi accusantium? Harum ipsum tempora odio?'

const COLORS = {
  _catalinaBlue: '#18355D',
  _orangeGluttony: '#EF8420',
  _coolToneBlue: '#2D476C',
  _coolToneBlue_alt1: '#222B45',
  _coolToneBlue_alt2: '#17345C',
  _christmasOrange: '#D56E28',
  _diesel: '#332C2B',
  _apocyan: '#9CE8FF',
  _tosca: '#218B95',

  primary: "#000662",
  primary_half: "rgba(255, 118, 72, 0.5)",
  secondary: "#18355D",
  warning: "#EF8420",


  tabBarActive: '#1450B0',
  tabBarInactive: '#D1D3D4',

  red: '#D32222',
  rockBlue: '#8F9BB3',

  gray: "#9d9d9d",
  gray_22: "#222222",

  black_12: "#121212",
  text_darkBlue: "#222B45",

  white: "#FFFFFF",
  lightWhite: "#FAFAFC",
  lightWhite2: "#F9F9FB",

  _Accepted: '#D2EFE1',
  _Rejected: '#FBADAD80',
  _Waiting: '#FFF1A7',
  _Interview: '#00066233',
  _Working: '#E4F2FD',
  _Completed: '#884DFF33',

  _AcceptedText: '#55A17D',
  _RejectedText: '#DF2626',
  _WaitingText: '#C6A80B',
  _InterviewText: '#000662',
  _WorkingText: '#0085FF',
  _CompletedText: '#884DFF',
};

const FONTS = {
  // regular: "PpRegular",
  // medium: "PpMedium",
  // semibold: "PpSemiBold",
  // bold: "PpBold",

	regular: "Poppins-Regular",
	medium: "Poppins-Medium",
	semibold: "Poppins-SemiBold",
	bold: "Poppins-Bold",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const FONTSTYLES = {
  h1: {
    color: COLORS.gray_22,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.xLarge,
    lineHeight: 36,
    marginBottom: 4
  },
  p: {
    color: COLORS.gray,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: SIZES.xLarge
  },
  p_12: {
    color: COLORS.gray,
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
  },
  p_black_12: {
    color: COLORS.black_12,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: SIZES.large
  },
  inputLabel: {
    color: COLORS.gray_22,
    fontFamily: FONTS.medium,
    fontSize: 14,
    lineHeight: SIZES.large
  },
  asterisk: {
    color: COLORS.red,
  },
  TextField: {
    color: COLORS.gray_22,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    lineHeight: SIZES.xLarge
  },
  reg10_7373: {
    color: '#737373',
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall
  },
  reg16_222: {
    color: COLORS.gray_22,
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium
  },
  med16_gray: {
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    lineHeight: 22
  },
  med10_gray: {
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontSize: SIZES.xSmall,
    // lineHeight: 24
  },
  med14_dBlue: {
    color: COLORS.text_darkBlue,
    fontFamily: FONTS.medium,
    fontSize: 14,
    // lineHeight: 24
  },
  med14_black: {
    // color: COLORS.text_darkBlue,
    fontFamily: FONTS.medium,
    fontSize: 14,
    // lineHeight: 24
  },
  med10_black: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xSmall,
    // lineHeight: 24
  },
  med12_black: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    // lineHeight: 24
  },
  sBold14_222: {
    color: COLORS.gray_22,
    fontFamily: FONTS.semibold,
    fontSize: 14,
    lineHeight: 18
  },
  sBold16_dBlue: {
    color: COLORS.text_darkBlue,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.medium,
    lineHeight: 22
  },
  sBold14_secondary: {
    color: COLORS.secondary,
    fontFamily: FONTS.semibold,
    fontSize: 14,
    lineHeight: 22
  },
  sBold16_secondary: {
    color: COLORS.secondary,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.medium,
    lineHeight: 22
  },
  sBold12_secondary: {
    color :COLORS.secondary,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.small,
    // lineHeight: SIZES.xLarge
  },
  sBold12_222: {
    color :COLORS.gray_22,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.small,
    // lineHeight: SIZES.xLarge
  },
  reg12_rockBlue: {
    color: COLORS.rockBlue,
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    lineHeight: SIZES.medium
  },
  topTabBar_Active: {
    color: COLORS.secondary,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.small,
    lineHeight: 22
  },
  topTabBar_Inactive: {
    color: '#999999',
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    lineHeight: 22
  },
}

export { COLORS, FONTS, FONTSTYLES, SIZES, LIPSUM }