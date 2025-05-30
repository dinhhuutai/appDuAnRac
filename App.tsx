import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './src/contexts/AuthContext';
import { WeightProvider } from './src/contexts/WeightContext';
import MainNavigator from './src/MainNavigator';
import LoadingOverlay from './src/components/LoadingOverlay'; // loading khi chưa xác định xong

const App = () => {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const result = await AsyncStorage.getItem('isAppFirstLaunched');
        if (result === null) {
          await AsyncStorage.setItem('isAppFirstLaunched', 'false');
          setIsAppFirstLaunched(true); // Lần đầu mở app
        } else {
          setIsAppFirstLaunched(false); // Đã từng mở rồi
        }
      } catch (error) {
        console.error('Failed to check first launch:', error);
        setIsAppFirstLaunched(false); // fallback
      }
    };

    checkFirstLaunch();
  }, []);

  if (isAppFirstLaunched === null) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WeightProvider>
          <NavigationContainer>
            <MainNavigator isAppFirstLaunched={isAppFirstLaunched} />
          </NavigationContainer>
        </WeightProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
