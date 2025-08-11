import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONTSTYLES, SIZES } from '../../constants';

const CollapsibleText = ({
  numberOfLines,
  containerStyle,
  text
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <View style={containerStyle}>
      <Text numberOfLines={isExpanded ? undefined : numberOfLines} style={styles.detailText}>
        {text}
      </Text>

      {text.length > 200 &&
        (
          !isExpanded ? (
            <TouchableOpacity onPress={toggleExpand}>
              <Text style={[FONTSTYLES.reg10_7373, { color: COLORS._tosca }]}>Read more...</Text>
            </TouchableOpacity>
          )
          :
          (
            <TouchableOpacity onPress={toggleExpand}>
              <Text style={[FONTSTYLES.reg10_7373, { color: COLORS._tosca }]}>Read less</Text>
            </TouchableOpacity>
          )
        )
      }
    </View>
  )
}

export default CollapsibleText

const styles = StyleSheet.create({
  detailText: {
    ...FONTSTYLES.reg10_7373,
    lineHeight: SIZES.large,
  },
})