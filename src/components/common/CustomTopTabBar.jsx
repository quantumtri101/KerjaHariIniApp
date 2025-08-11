import { Animated, TouchableOpacity, View } from "react-native";
import { COLORS, FONTSTYLES, SIZES } from "../../constants";

export default function CustomTopTabBar({ state, descriptors, navigation, position, fill, arrAllowedTab }) {
  return (
    <View style={{ flexDirection: 'row', borderBottomColor: '#EAEAEA', borderBottomWidth: 1, marginHorizontal: SIZES.medium}}>
      {state.routes.map((route, index) => {
        {/* console.log(route.name) */}
        const { options } = descriptors[route.key];
        const label = route.name
          {/* options.tabBarLabel
            !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title: route.name; */}

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
						if(arrAllowedTab != null){
							for(let tab of arrAllowedTab){
								if(tab == route.name){
									navigation.navigate({ name: route.name, merge: true });
									break
								}
							}
						}
						else
							navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{height: 40, flex: fill ? 1 : null}}
          >
            {/* <Animated.Text style={{ opacity }}>
              {label}
            </Animated.Text> */}
            <Animated.Text style={[isFocused ? FONTSTYLES.topTabBar_Active : FONTSTYLES.topTabBar_Inactive, {flex: 1, paddingHorizontal: 10, textAlignVertical: 'center', textAlign: fill ? 'center' : 'left'}]}>
              {label}
            </Animated.Text>
            <Animated.View
              style={{
                width: 'auto',
                height: 2,
                backgroundColor: COLORS.secondary,
                opacity
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}