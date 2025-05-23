import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { COLORS } from './OnboardingScreen'
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const UpdateProfile = () => {

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, login } = useContext(AuthContext);

      useEffect(() => {
        setName(user?.fullName || '');
        setPhone(user?.phone || '');
      }, []);

      
  const handleSave = async () => {
    if(name === '' || phone === '') {
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`https://duanrac-api-node-habqhehnc6a2hkaq.southeastasia-01.azurewebsites.net/user/${user.userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, phone }),
      });

      const json = await response.json();

      if (response.ok && json.status === 'success') {
        // Cập nhật context với dữ liệu mới
        login(json.data.user);
        Alert.alert('Thành công', 'Cập nhật thông tin thành công');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Cập nhật thông tin thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: 36 }}>
        <StatusBar backgroundColor="transparent" translucent barStyle='dark-content' />
        
        <LoadingOverlay visible={loading} />
        
        <View
            style={{
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: 50,
              backgroundColor: COLORS.white,
            }}
          >
            <TouchableOpacity
                    style={{ 
                        position: 'absolute',
                        left: 14,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                    }}
                    onPress={() => navigation.goBack()}
            >
                <View>
                    <Icon name="chevron-thin-left" size={18} color={COLORS.color_text} />
                </View>
            </TouchableOpacity>
            <View
                style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: 700,
                    }}
                >
                    Sửa hồ sơ
                </Text>
            </View>
          </View>

          <View className="mt-[80px] px-[20px]">
                      {/* Username */}
                      <View style={{ borderColor: COLORS.color_textOnBoarding }} className="flex flex-row items-center border-[1px] border-solid px-[12px] rounded-[50px]">
                        <Icon1 name="user-o" size={18} color={COLORS.color_textOnBoarding} />
                        <TextInput
                          placeholder="Tên"
                          onChangeText={setName}
                          value={name}
                          style={{ color: COLORS.color_textOnBoarding }}
                          className="ml-[6px] flex flex-1"
                        />
                      </View>
          
                      <View className="h-[36px]" />
          
                      {/* Password */}
                      <View style={{ borderColor: COLORS.color_textOnBoarding }} className="flex flex-row items-center border-[1px] border-solid px-[12px] justify-between rounded-[50px]">
                        <Icon2 name="phone" size={18} color={COLORS.color_textOnBoarding} />
                        <TextInput
                          placeholder="Điện thoại"
                          onChangeText={setPhone}
                          value={phone}
                          style={{ color: COLORS.color_textOnBoarding }}
                          className="ml-[6px] flex-1"
                        />
                      </View>
                    </View>
          
                    {/* Đăng nhập button */}
                    <View className="items-center absolute bottom-[50px] left-0 right-0">
                      <TouchableOpacity
                        style={{ backgroundColor: COLORS.bg_button }}
                        className="mt-[80px] px-[70px] py-[8px] rounded-[50px]"
                        onPress={() => handleSave()}
                      >
                        <Text style={{ color: COLORS.white }} className="uppercase font-[800]">
                          Lưu
                        </Text>
                      </TouchableOpacity>
                    </View>
    </View>
  )
}

export default UpdateProfile

const styles = StyleSheet.create({})