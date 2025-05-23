import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, Image, Text, TouchableOpacity, View, StatusBar, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { COLORS } from './OnboardingScreen';
import LottieView from 'lottie-react-native';
import { AuthContext } from '../contexts/AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [animationKey, setAnimationKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // Reset animation key mỗi lần trang được focus lại
      setAnimationKey(prev => prev + 1);
    }, [])
  );


  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: 36 }}>
      {/* Header */}
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 50,
          backgroundColor: COLORS.white,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 0,
          

          // 👇 Viền dưới nhẹ
          borderBottomWidth: 0.5,
          borderBottomColor: '#ccc',
        }}
      >
        {/* <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{
            position: 'absolute',
            top: 10,
            left: 24,
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
          <Icon name="menu" size={28} color={COLORS.color_icon} />
        </TouchableOpacity> */}

        <Image
          source={require('../images/logo.png')}
          style={{ 
            position: 'absolute',
            top: 8,
            left: 24,
            width: 36, 
            height: 36, 
            resizeMode: 'contain' 
          }}
        />

        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 14,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Text style={{ fontSize: 12 }}>Hello! 👋</Text>
          <Text style={{ fontSize: 14, fontWeight: '500' }}>{user?.fullName}</Text>
        </View>
      </View>

      {/* Nội dung */}
      <View style={{ flex: 1, paddingTop: 10, paddingBottom: 60 }}>
        <ScrollView contentContainerStyle={{ gap: 12, paddingHorizontal: 10, paddingBottom: 50 }}>
          {/* Ảnh minh họa */}
          
          <LottieView
            source={require('../images/Animation-Home.json')}
            autoPlay
            loop
            style={{
              width: '100%',
              height: 160,
            }}
          />

          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            📝 Hướng dẫn công đoạn cân rác
          </Text>

          {[
            {
              text: 'Vào chức năng bluetooth, bật nút BLE',
              icon: <Icon name="bluetooth" size={18} color={COLORS.color_text} />,
            },
            {
              text: 'Tìm tên cân điện tử "scale", kết nối',
              icon: <Icon name="link" size={18} color={COLORS.color_text} />,
            },
            {
              text: 'Đặt thùng rác lên cân',
              icon: <Icon2 name="scale-outline" size={18} color={COLORS.color_text} />,
            },
            {
              text: 'Mở chức năng scan, quét QR trên thùng rác',
              icon: <Icon1 name="qrcode-scan" size={18} color={COLORS.color_text} />,
            },
            {
              text: 'Kiểm tra lại thông tin, bấm xác nhận',
              icon: <Icon name="check-circle" size={18} color={COLORS.color_text} />,
            },
            {
              text: 'Ký tên vào biểu mẫu',
              icon: <Icon2 name="create-outline" size={20} color={COLORS.color_text} />,
            },
          ].map((item, index) => (
            <Animatable.View
              key={`${animationKey}-${index}`} // key động để tái kích hoạt animation
              animation="fadeInUp"
              delay={index * 50 + 100}
              duration={300}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                backgroundColor: COLORS.bg_groupItem,
                borderRadius: 10,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              {item.icon}
              <Text style={{ marginLeft: 10 }}>{item.text}</Text>
            </Animatable.View>
          ))}

        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
