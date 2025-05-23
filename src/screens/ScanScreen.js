import React, { useState, useEffect } from 'react';
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
} from 'react-native';
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
import LoadingOverlay from '../components/LoadingOverlay';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import getCurrentShiftInfo from '../components/getCurrentShiftInfo';

const ScanScreen = () => {
  const navigation = useNavigation();
      const { user } = useContext(AuthContext);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [jsonData, setJsonData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [khoiLuong, setKhoiLuong] = useState('');

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

  const isCameraActive = device != null && hasPermission && !modalVisible;

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      const scannedUrl = decodeURIComponent(codes[0].value);
      if (!scannedUrl || jsonData !== null || modalVisible) return;

      try {
        const parsedData = JSON.parse(scannedUrl);
        setJsonData(parsedData);
        setModalVisible(true);
        console.log('📷 QR quét được:', parsedData);
      } catch (error) {
        console.log('Lỗi khi parse JSON:', error);
      }
    },
  });

  if (device == null || !hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy camera hoặc quyền truy cập bị từ chối</Text>
      </View>
    );
  }

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

      let khoiLuongTmp = parseFloat(khoiLuong);

      if (jsonData?.t === 'Giẻ lau có chứa thành phần nguy hại') {
        khoiLuongTmp -= 1;
      } else if (jsonData?.t === 'Vụn logo') {
        khoiLuongTmp -= 1;
      } else if (jsonData?.t === 'Mực in thải') {
        khoiLuongTmp -= 0.45;
      } else if (jsonData?.t === 'Keo bàn thải') {
        khoiLuongTmp -= 1;
      } else if (jsonData?.t === 'Băng keo dính mực') {
        khoiLuongTmp -= 0.8;
      } else if (jsonData?.t === 'Rác sinh hoạt') {
        khoiLuongTmp -= 1;
      } else if (jsonData?.t === 'Lụa căng khung') {
        khoiLuongTmp -= 1;
      }
      
      khoiLuongTmp = Math.max(khoiLuongTmp, 0);

      // Làm tròn đến 2 chữ số thập phân
      khoiLuongTmp = parseFloat(khoiLuongTmp.toFixed(2));


      const { shift, workDate } = getCurrentShiftInfo(new Date());

      const data = {
        trashBinCode: jsonData.id,
        userID: user.userID,
        weighingTime: nowUTC7.toISOString(),
        weightKg: khoiLuongTmp,
        updatedAt: nowUTC7.toISOString(),
        updatedBy: user.userID,
        workShift: shift || 'ca1',
        workDate: workDate || nowUTC7,
      };
  
      const response = await fetch('https://duanrac-api-node-habqhehnc6a2hkaq.southeastasia-01.azurewebsites.net/trash-weighings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        Alert.alert('Thành công', 'Đã lưu dữ liệu cân rác', [
          {
            text: 'OK',
            onPress: () => {
              setJsonData(null);
              setModalVisible(false);
              navigation.goBack();
            },
          },
        ]);
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
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent barStyle='light-content' />
      <Camera
        style={StyleSheet.absoluteFill}
        codeScanner={codeScanner}
        device={device}
        isActive={isCameraActive}
      />
      
      <LoadingOverlay visible={loading} />

      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

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
      onChangeText={setKhoiLuong}
      keyboardType="numeric"
      inputMode="numeric"
    />
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
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.modalButton]}
        >
          <Text style={{ color: COLORS.white }}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
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
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
    alignItems: 'flex-start',
    marginBottom: 10,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 36,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 6,
    minHeight: '50%',
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
});

export default ScanScreen;
