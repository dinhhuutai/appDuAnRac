import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Animated, Image, ImageBackground, Modal, PanResponder, StatusBar, StyleSheet } from 'react-native';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Octicons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from './OnboardingScreen';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const UserScreen = () => {
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);
  
const { logout } = useContext(AuthContext);

  const [modalUser, setModalUser] = useState(false);
  const [loading, setLoading] = useState(false);

  
    const panY = useState(new Animated.Value(0))[0];
  
    const resetPositionAnim = Animated.timing(panY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    });
  
    const closeAnim = Animated.timing(panY, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    });

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          closeAnim.start(() => {
            setModalUser(false);
            panY.setValue(0);
          });
        } else {
          resetPositionAnim.start();
        }
      },
    });


  return (
    <ImageBackground
      source={require('../images/bgPage.png')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
      <StatusBar backgroundColor="transparent" translucent barStyle='dark-content' />
                  <ImageBackground
                      source={require('../images/coverPhoto.png')}
                      style={{
                          height: 180,
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                      }}
                  >
                  <TouchableOpacity
                    onPress={() => setModalUser(true)}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 18,
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
                      marginTop: 30,
                    }}
                  >
                    <Icon1 name="menu" size={24} color={COLORS.color_icon} />
                  </TouchableOpacity>
                      <Image
                          source={require('../images/avatar.png')}
                          style={{
                              width: 110,
                              height: 110,
                              borderRadius: 110 / 2,
                              borderWidth: 4,
                              borderColor: COLORS.white,
                              bottom: '-36%',
                          }}
                      />
                  </ImageBackground>
                  <View
                    style={{
                      marginTop: 70,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{fontSize: 16, fontWeight: 600}}>{user?.fullName}</Text>
                  </View>
                  
                <View
                  style={{
                    marginTop: 60,
                    marginHorizontal: 40,
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      gap: 30,
                      borderWidth: 1,
                      borderColor: COLORS.bg_lineBle,
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      borderRadius: 12,
                      backgroundColor: COLORS.white,
                      boxShadow: '0px 0 10px rgba(0, 0, 0, 0.1)', // Thêm boxShadow
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Icon name="user-o" size={18} color={COLORS.color_text} />
                      <Text style={{marginLeft: 10}}>{user?.username}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Icon1 name="phone" size={18} color={COLORS.color_text} />
                      <Text style={{marginLeft: 10}}>{user?.phone}</Text>
                    </View>
                  </View>
                </View>

                <Modal
                        statusBarTranslucent
                        visible={modalUser}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => {
                          setModalUser(false);
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={1}
                          onPressOut={() => {
                            setModalUser(false);
                          }}
                          style={styles.modalOverlay}
                        >
                          <Animated.View
                            {...panResponder.panHandlers}
                            style={[
                              styles.modalContent,
                              { transform: [{ translateY: panY }] },
                            ]}
                            onStartShouldSetResponder={() => true}
                          >
                            <View
                              style={{

                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  setModalUser(false);
                                  navigation.navigate('UpdateProfileScreen');
                                }}
                              >
                                <View
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: 26,
                                    marginVertical: 12,
                                  }}
                                >
                                  <Icon2 name="pencil" size={18} color={COLORS.color_text} />
                                  <Text style={{marginLeft: 8, fontWeight: 600}}>Chỉnh sửa thông tin</Text>
                                </View>
                              </TouchableOpacity>

                              <View style={{flex: 1, height: 1, marginHorizontal: 16, backgroundColor: COLORS.bg_lineBle}}></View>
                              
                              <TouchableOpacity
                                onPress={() => {
                                  setModalUser(false);
                                  navigation.navigate('ChangePasswordScreen');
                                }}
                              >
                                <View
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: 26,
                                    marginVertical: 12,
                                  }}
                                >
                                  <Icon3 name="password" size={18} color={COLORS.color_text} />
                                  <Text style={{marginLeft: 8, fontWeight: 600}}>Đổi mật khẩu</Text>
                                </View>
                              </TouchableOpacity>

                              <View style={{flex: 1, height: 1, marginHorizontal: 16, backgroundColor: COLORS.bg_lineBle}}></View>
                              
                              <TouchableOpacity
                                onPress={() => {
                                  setLoading(true);
                                  setModalUser(false);
                                  logout();
                                  setLoading(false);
                                }}
                                style={{
                                  flex: 1,
                                }}
                              >
                                <View
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 26,
                                    marginVertical: 12,
                                    flex: 1,
                                  }}
                                >
                                  <Icon4 name="logout" size={18} color={COLORS.color_text} />
                                  <Text style={{marginLeft: 8, fontWeight: 700}}>Đăng xuất</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </Animated.View>
                        </TouchableOpacity>
                        <LoadingOverlay visible={loading} />
                      </Modal>
    </ImageBackground>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    minHeight: '10%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    gap: 20,
  },
})