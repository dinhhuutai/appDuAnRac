import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CustomTabBarButton = props => {
    const {children, accessibilityState, onPress} = props;

    console.log('props: ', props)

    if(accessibilityState?.selected) {
        return (
          <TouchableOpacity onPress={onPress}>
            <Text>{children}</Text>
          </TouchableOpacity>
        )
    }

}

export default CustomTabBarButton

const styles = StyleSheet.create({})