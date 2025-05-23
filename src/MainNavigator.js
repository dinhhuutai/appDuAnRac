// src/MainNavigator.js
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import ScanScreen from './screens/ScanScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import UpdateProfile from './screens/UpdateProfile';
import { AuthContext } from './contexts/AuthContext';

const Stack = createStackNavigator();

const MainNavigator = ({ isAppFirstLaunched }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          {isAppFirstLaunched && (
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
          )}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="HomeScreen" component={DrawerNavigator} />
          <Stack.Screen name="ScanScreen" component={ScanScreen} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
          <Stack.Screen name="UpdateProfileScreen" component={UpdateProfile} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
