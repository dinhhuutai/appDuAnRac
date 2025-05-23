import React, { useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { COLORS } from './OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../components/LoadingOverlay';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


const LoginScreen = ({ setIsLoggedIn, setIsAppFirstLaunched }) => {
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if(username === '' || password === '') {
        setShowModal(true);
        return;
    }
    
    setLoading(true);


    try {
      const response = await fetch('https://duanrac-api-node-habqhehnc6a2hkaq.southeastasia-01.azurewebsites.net/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const resData = await response.json();
  
      if (resData.status === 'success') {
        const { accessToken, refreshToken, user } = resData.data;

        // await AsyncStorage.setItem('accessToken', resData.data.accessToken);
        // await AsyncStorage.setItem('refreshToken', resData.data.refreshToken);
        
        login(user);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../images/bgLogin.png')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
        
        <LoadingOverlay visible={loading} />
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <View className="flex justify-center flex-1 w-[80%]">
          <Text style={{ color: COLORS.color_textOnBoarding }} className="text-[25px] font-[700]">
            Đăng Nhập
          </Text>

          <View className="mt-[50px]">
            {/* Username */}
            <View style={{ borderColor: COLORS.color_textOnBoarding }} className="flex flex-row items-center border-b-[1px] border-solid px-[12px]">
              <Icon2 name="user" size={18} color={COLORS.color_textOnBoarding} />
              <TextInput
                placeholder="Tài khoản"
                onChangeText={setUsername}
                value={username}
                style={{ color: COLORS.color_textOnBoarding }}
                className="ml-[6px] flex flex-1"
              />
            </View>

            <View className="h-[36px]" />

            {/* Password */}
            <View style={{ borderColor: COLORS.color_textOnBoarding }} className="flex flex-row items-center border-b-[1px] border-solid px-[12px] justify-between">
              <Icon name="locked" size={18} color={COLORS.color_textOnBoarding} />
              <TextInput
                placeholder="Mật khẩu"
                secureTextEntry={hiddenPassword}
                onChangeText={setPassword}
                value={password}
                style={{ color: COLORS.color_textOnBoarding }}
                className="ml-[6px] flex-1"
              />
              <TouchableOpacity onPress={() => setHiddenPassword(prev => !prev)}>
                <Icon1
                  name={hiddenPassword ? 'eye-with-line' : 'eye'}
                  size={18}
                  color={COLORS.color_text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Đăng nhập button */}
          <View className="items-center">
            <TouchableOpacity
              style={{ backgroundColor: COLORS.bg_button }}
              className="mt-[80px] px-[80px] py-[14px] rounded-[50px]"
              onPress={handleLogin}
            >
              <Text style={{ color: COLORS.white }} className="uppercase font-[800]">
                Đăng nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Modal thông báo lỗi */}
        <Modal
            statusBarTranslucent
            animationType="slide"
            transparent
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
        >
        <Pressable
            onPress={() => setShowModal(false)}
            style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            }}
        >
            <Pressable
            onPress={() => {}}
            style={{
                backgroundColor: 'white',
                width: '80%',
                borderRadius: 20,
                padding: 24,
                alignItems: 'center',
                elevation: 10,
            }}
            >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                Sai thông tin đăng nhập
            </Text>
            <Text style={{ color: '#666', textAlign: 'center', marginBottom: 20 }}>
                Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.
            </Text>
            <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{
                backgroundColor: COLORS.bg_button,
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 25,
                }}
            >
                <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Đóng</Text>
            </TouchableOpacity>
            </Pressable>
        </Pressable>
        </Modal>

    </ImageBackground>
  );
};

export default LoginScreen;
