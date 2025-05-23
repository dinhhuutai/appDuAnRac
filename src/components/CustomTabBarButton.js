import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { COLORS } from '../screens/OnboardingScreen';
import Svg, {Path} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const CustomTabBarButton = props => {
    const {children, accessibilityShowsLargeContentViewer, onPress} = props;
    
    const navigation = useNavigation();

    if(accessibilityShowsLargeContentViewer) {
        return (
          <View
            style={styles.btnWrapper}
          >
            <TouchableOpacity 
              onPress={
                () => navigation.navigate('ScanScreen')
              }
              style={styles.activeBtn}
            >
              <Text>{children}</Text>
            </TouchableOpacity>
          </View>
        )
    } else {
      return (
        <TouchableOpacity 
          onPress={onPress}
          style={styles.inactiveBtn}
        >
          <Text>{children}</Text>
        </TouchableOpacity>
      )
    }

}

export default CustomTabBarButton

const styles = StyleSheet.create({
  btnWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  activeBtn: {
    position: 'absolute',
    top: -10,
    borderColor: COLORS.white,
    borderStyle: 'solid',
    borderWidth: 4,
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: COLORS.bg_tabBar,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
  }
})