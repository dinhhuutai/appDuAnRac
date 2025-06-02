import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  PanResponder,
  Animated,
  StatusBar,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { COLORS } from './OnboardingScreen';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingOverlay from '../components/LoadingOverlay';
import { AuthContext } from '../contexts/AuthContext';
import { WeightContext } from '../contexts/WeightContext';
import getCurrentShiftInfo from '../components/getCurrentShiftInfo';
import { BluetoothContext } from '../contexts/BluetoothContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FRAME_SIZE = SCREEN_WIDTH * 0.7;


const ScanScreen = () => {

    const {
      connectedDevice,
      disconnectDevice,
    } = useContext(BluetoothContext);

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { weight, setWeight } = useContext(WeightContext);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [zoom, setZoom] = useState(0.5);
  const [jsonData, setJsonData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [khoiLuong, setKhoiLuong] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedShift, setSelectedShift] = useState('ca1');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const [wrongTeamModal, setWrongTeamModal] = useState(false);
  const [confirmContinueModalVisible, setConfirmContinueModalVisible] = useState(false);
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    if (user?.userID) {
      fetch(`https://duanrac-api-node-habqhehnc6a2hkaq.southeastasia-01.azurewebsites.net/api/team-members?userID=${user.userID}`)
        .then((res) => res.json())
        .then((data) => {
          setTeamMembers(data)
          if(teamMembers.length === 0) {
            setSelectedMember(user?.fullName);
          }
        })
        .catch((err) => {
          console.error('Lỗi khi tải teamMembers:', err);
          setTeamMembers([]);
        });
    }
  }, [user]);

  useEffect(() => {
    setKhoiLuong(weight);
  }, [weight]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (!jsonData && zoom < 0.5) {
        setZoom(zoom + 0.1); // tăng zoom
      }
    }, 3000); // sau 3s

    return () => clearTimeout(timeout);
  }, [zoom, jsonData]);

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
          setModalVisible(false);
          setJsonData(null);
          panY.setValue(0);
        });
      } else {
        resetPositionAnim.start();
      }
    },
  });

  useEffect(() => {
    const requestPermissionAsync = async () => {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        console.log('Quyền truy cập bị từ chối');
      }
    };
    requestPermissionAsync();
  }, [requestPermission]);

  const isCameraActive = device != null && hasPermission && !modalVisible && !wrongTeamModal && !confirmContinueModalVisible;

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      const scannedUrl = decodeURIComponent(codes[0].value);
      if (!scannedUrl || jsonData !== null || modalVisible || wrongTeamModal || confirmContinueModalVisible) return;

      try {
        const parsedData = JSON.parse(scannedUrl);
        setJsonData(parsedData);

        if (user?.role === 'admin') {
          setModalVisible(true);
        } else if (user?.role === 'user') {
          const userTeam = user?.fullName?.toLowerCase(); // hoặc user.teamName nếu có
          const qrTeam = parsedData?.d?.toLowerCase();
          if (qrTeam && userTeam && qrTeam.includes(userTeam)) {
            setModalVisible(true);
          } else {
            setWrongTeamModal(true);
          }
        }
      } catch (error) {
        console.log('Lỗi khi parse JSON:', error);
      }
    },
  });

  const handleConfirm = async () => {
    if (!khoiLuong || khoiLuong === '0') {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập khối lượng trước khi lưu');
      return;
    } else if (isNaN(khoiLuong)) {
      Alert.alert('Sai cú pháp', 'Vui lòng thay dấu \',\' thành dấu \'.\'');
      return;
    }

    setLoading(true);

    try {
      const nowUTC7 = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
      let khoiLuongTmp = Math.max(parseFloat(khoiLuong), 0);
      khoiLuongTmp = parseFloat(khoiLuongTmp.toFixed(2));

      const data = {
        trashBinCode: jsonData.id,
        userID: user.userID,
        weighingTime: nowUTC7.toISOString(),
        weightKg: khoiLuongTmp,
        updatedAt: nowUTC7.toISOString(),
        updatedBy: user.userID,
        workShift: selectedShift,
        workDate: new Date(selectedDate).toISOString().split('T')[0],
        userName: selectedMember,
      };

      const response = await fetch('https://duanrac-api-node-habqhehnc6a2hkaq.southeastasia-01.azurewebsites.net/trash-weighings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setConfirmContinueModalVisible(true);
      } else {
        const errorText = await response.text();
        Alert.alert('Lỗi', errorText || 'Không thể lưu dữ liệu cân rác');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  if (device == null || !hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy camera hoặc quyền truy cập bị từ chối</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent barStyle='light-content' />
      <Camera
        style={StyleSheet.absoluteFill}
        autoFocus="on"
        codeScanner={codeScanner}
        device={device}
        isActive={isCameraActive}
        zoom={zoom}
        flash={flashOn ? 'on' : 'off'}
        exposure={0.5}
        torch="on"
      />

      <LoadingOverlay visible={loading} />

      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.overlay}>
        <Text style={styles.scanText}>Đưa mã QR vào trong khung để quét</Text>

        <View style={styles.scanFrame}>
          <Animated.View
            style={[styles.laser, { transform: [{ translateY: panY.interpolate({
              inputRange: [0, 1],
              outputRange: [0, FRAME_SIZE],
            }) }] }]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.flashButton}
        onPress={() => setFlashOn(!flashOn)}
      >
        <Icon1 name={flashOn ? 'flash-off' : 'flash'} size={24} color="white" />
      </TouchableOpacity>



      <Modal
        statusBarTranslucent
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setJsonData(null);
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => {
            setJsonData(null);
            setModalVisible(false);
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
            <View style={styles.dragHandle} />
            <View style={styles.wrapperItem}>
              <Text style={styles.modalText}>Bộ phận / Khu vực: </Text>
              <Text style={styles.textItem}>{jsonData?.d}</Text>
            </View>
            <View style={styles.wrapperItem}>
              <Text style={styles.modalText}>Đơn vị sản xuất: </Text>
              <Text style={styles.textItem}>{jsonData?.u}</Text>
            </View>
            <View style={styles.wrapperItem}>
              <Text style={styles.modalText}>Loại rác: </Text>
              <Text style={styles.textItem}>{jsonData?.t}</Text>
            </View>

            <View style={styles.wrapperItem}>
              <Text style={styles.modalText}>Nhập khối lượng: </Text>
              <TextInput
                style={{
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: COLORS.bg_button,
                  borderRadius: 6,
                  flex: 1,
                }}
                placeholder="Nhập khối lượng"
                placeholderTextColor="#999"
                value={khoiLuong}
                onChangeText={(e) => {
                  const inputValue = e.replace(',', '.');
                  setKhoiLuong(inputValue);
                }}
                keyboardType="numeric"
                inputMode="numeric"
              />
            </View>

            <View style={styles.wrapperItem}>
              <Text style={styles.modalText}>Chọn ca: </Text>
              <View style={{
                flex: 1,
                marginLeft: 8,
                borderWidth: 1,
                borderColor: COLORS.bg_button,
                borderRadius: 6,
              }}>
                <Picker
                  selectedValue={selectedShift}
                  onValueChange={(value) => setSelectedShift(value)}
                >
                  <Picker.Item label="Ca Ngắn 1 (8 tiếng)" value="ca1" />
                  <Picker.Item label="Ca Ngắn 2 (8 tiếng)" value="ca2" />
                  <Picker.Item label="Ca Ngắn 3 (8 tiếng)" value="ca3" />
                  <Picker.Item label="Ca Dài 1 (12 tiếng)" value="dai1" />
                  <Picker.Item label="Ca Dài 2 (12 tiếng)" value="dai2" />
                </Picker>
              </View>
            </View>

            <View style={styles.wrapperItem}>
              <Text style={styles.modalText}>Chọn ngày: </Text>
              <TouchableOpacity
                onPress={() => setOpenDatePicker(true)}
                style={{
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: COLORS.bg_button,
                  borderRadius: 6,
                  padding: 10,
                  flex: 1,
                }}
              >
                <Text>{selectedDate.toLocaleDateString('vi-VN')}</Text>
              </TouchableOpacity>
            </View>

            <DatePicker
              modal
              open={openDatePicker}
              date={selectedDate}
              mode="date"
              locale="vi"
              onConfirm={(date) => {
                setOpenDatePicker(false);
                setSelectedDate(date);
              }}
              onCancel={() => {
                setOpenDatePicker(false);
              }}
            />

            <View className="mb-4">
              <Text className="text-base text-gray-800 mb-1">Người cân rác:</Text>
              {teamMembers.length > 0 ? (
                <View className="bg-white border border-gray-300 rounded-xl">
                  <Picker
                    selectedValue={selectedMember}
                    onValueChange={(itemValue) => setSelectedMember(itemValue)}
                  >
                    <Picker.Item label="Người cân rác" value="" />
                    {teamMembers.map((member) => (
                      <Picker.Item
                        key={member.id}
                        label={member.name}
                        value={member.id}
                      />
                    ))}
                  </Picker>
                </View>
              ) : (
                <TextInput
                  value={selectedMember}
                  onChangeText={setSelectedMember}
                  placeholder="Nhập tên người thu gom"
                  className="border border-gray-300 rounded-xl p-2 bg-white"
                />
              )}
            </View>


            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setJsonData(null);
                  setModalVisible(false);
                }}
                style={[styles.modalButton, { backgroundColor: '#F93333' }]}
              >
                <Text style={{ color: COLORS.white }}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={[styles.modalButton]}>
                <Text style={{ color: COLORS.white }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={confirmContinueModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmContinueModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>Đã lưu dữ liệu cân rác thành công!</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#F93333' }]}
                onPress={() => {
                  setKhoiLuong(0);
                  setWeight(0);
                  setConfirmContinueModalVisible(false);
                  disconnectDevice();
                  navigation.goBack();
                  // TODO: Ngắt kết nối Bluetooth tại đây nếu có
                }}
              >
                <Text style={{ color: COLORS.white }}>Thoát</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={() => {
                  setKhoiLuong(0);
                  setWeight(0);
                  setConfirmContinueModalVisible(false);
                  setJsonData(null);
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: COLORS.white }}>Tiếp tục</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={wrongTeamModal}
        transparent
        animationType="fade"
        onRequestClose={() => setWrongTeamModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>🐤 Ối dồi ôi! Mã QR này không thuộc tổ của bạn rồi 😅 Quét lại hen!</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#F93333' }]}
                onPress={() => {
                  setWrongTeamModal(false);
                  setKhoiLuong(0);
                  setJsonData(null);
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: COLORS.white }}>Quét lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 32,
    alignItems: 'center',
    elevation: 10,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.bg_button || '#007AFF',
  },


  scanText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderColor: '#00FF00',
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  laser: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#FF0000',
    opacity: 0.8,
  },

  flashButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  qrGuideBox: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    width: '70%',
    height: 200,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    zIndex: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    gap: 20,
  },
  modalButton: {
    backgroundColor: COLORS.bg_button,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '40%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 50,
    padding: 10,
  },
  dragHandle: {
    width: 60,
    height: 3,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  wrapperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 36,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 6,
    minHeight: '55%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    gap: 20,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.color_text,
  },
  textItem: {
    fontSize: 14,
    color: COLORS.color_text,
    marginLeft: 8,
    flex: 1,
    fontWeight: 'bold',
  },
  confirmModal: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    color: COLORS.color_text,
    textAlign: 'center',
    marginBottom: 20,
  },

});

export default ScanScreen;

