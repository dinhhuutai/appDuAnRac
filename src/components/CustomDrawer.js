import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../screens/OnboardingScreen';

const {width} = Dimensions.get('screen');

const CustomDrawer = props => {
    const navigation = useNavigation();


    return (
        <DrawerContentScrollView {...props}>

            <ImageBackground
                source={require('../images/coverPhoto.png')}
                style={{
                    height: 140,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}
            >
            <TouchableOpacity
              onPress={() => props.navigation.closeDrawer()}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                zIndex: 10,
                backgroundColor: COLORS.white,
                paddingVertical: 2,
                paddingHorizontal: 3,
                borderRadius: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Icon name="menu" size={24} color={COLORS.color_icon} />
            </TouchableOpacity>
                <Image
                    source={require('../images/avatar.png')}
                    style={{
                        width: 110,
                        height: 110,
                        borderRadius: 110 / 2,
                        borderWidth: 4,
                        borderColor: COLORS.white,
                        bottom: '-30%',
                    }}
                />
            </ImageBackground>

            <View
                className='mt-[20px]'
                style={{
                    marginTop: 65,
                }}
            >
                <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>
    )
}

export default CustomDrawer;

const styles = StyleSheet.create({});