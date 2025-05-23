import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from './OnboardingScreen'
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const ChangePasswordScreen = () => {

    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    const [hiddenPassword, setHiddenPassword] = useState(true);

    const [pwOld, setPwOld] = useState('');
    const [pwNew, setPwNew] = useState('');
    const [pwNewConfirm, setPwNewConfirm] = useState('');

    const [loading, setLoading] = useState(false);

    const onSave = async () => {
      if (!pwOld || !pwNew || !pwNewConfirm) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ các trường');
        return;
      }
      if (pwNew !== pwNewConfirm) {
        Alert.alert('Lỗi', 'Mật khẩu mới không trùng khớp');
        return;
      }
      setLoading(true);
  
      try {
        // Gửi request đổi mật khẩu
        const res = await fetch('https://duanrac-api-node-habqhehnc6a2hkaq.southeastasia-01.azurewebsites.net/user/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userID: user.userID,
            oldPassword: pwOld, // gửi mật khẩu cũ để backend check
            newPassword: pwNew,
          }),
        });
        const text = await res.text();
  
        if (res.ok) {
          Alert.alert('Thành công', text, [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        } else {
          Alert.alert('Lỗi', text);
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
                    Đổi mật khẩu
                </Text>
            </View>
          </View>

          <View className="mt-[80px] px-[20px]">
                      <View style={{ borderColor: COLORS.color_textOnBoarding }} className="flex flex-row items-center border-[1px] border-solid px-[12px] rounded-[50px]">
                        <TextInput
                          placeholder="Mật khẩu cũ"
                          onChangeText={setPwOld}
                          value={pwOld}
                          style={{ color: COLORS.color_textOnBoarding }}
                          className="ml-[6px] flex flex-1"
                        />
                                      <TouchableOpacity onPress={() => setHiddenPassword(prev => !prev)}>
                                        <Icon
                                          name={hiddenPassword ? 'eye-with-line' : 'eye'}
                                          size={18}
                                          color={COLORS.color_text}
                                        />
                                      </TouchableOpacity>
                      </View>
          
                      <View className="h-[36px]" />
          
                      <View style={{ borderColor: COLORS.color_textOnBoarding }} className="flex flex-row items-center border-[1px] border-solid px-[12px] justify-between rounded-[50px]">
                        <TextInput
                          placeholder="Mật khẩu mới"
                          onChangeText={setPwNew}
                          value={pwNew}
                          style={{ color: COLORS.color_textOnBoarding }}
                          className="ml-[6px] flex-1"
                        />
                                      <TouchableOpacity onPress={() => setHiddenPassword(prev => !prev)}>
                                        <Icon
                                          name={hiddenPassword ? 'eye-with-line' : 'eye'}
                                          size={18}
                                          color={COLORS.color_text}
                                        />
                                      </TouchableOpacity>
                      </View>
          
                      <View className="h-[36px]" />

                      <View style={{ borderColor: COLORS.color_textOnBoarding }} className="flex flex-row items-center border-[1px] border-solid px-[12px] justify-between rounded-[50px]">
                        <TextInput
                          placeholder="Nhập lại mật khẩu mới"
                          onChangeText={setPwNewConfirm}
                          value={pwNewConfirm}
                          style={{ color: COLORS.color_textOnBoarding }}
                          className="ml-[6px] flex-1"
                        />
                                      <TouchableOpacity onPress={() => setHiddenPassword(prev => !prev)}>
                                        <Icon
                                          name={hiddenPassword ? 'eye-with-line' : 'eye'}
                                          size={18}
                                          color={COLORS.color_text}
                                        />
                                      </TouchableOpacity>
                      </View>
                    </View>
          
                    {/* Đăng nhập button */}
                    <View className="items-center absolute bottom-[50px] left-0 right-0">
                      <TouchableOpacity
                        style={{ backgroundColor: COLORS.bg_button }}
                        className="mt-[80px] px-[70px] py-[8px] rounded-[50px]"
                        onPress={() => onSave()}
                      >
                        <Text style={{ color: COLORS.white }} className="uppercase font-[800]">
                          Lưu
                        </Text>
                      </TouchableOpacity>
                    </View>
    </View>
  )
};

export default ChangePasswordScreen;