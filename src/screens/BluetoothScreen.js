// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Switch, FlatList, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import { Buffer } from 'buffer';
// import Icon from 'react-native-vector-icons/Feather';
// import { COLORS } from './OnboardingScreen';

// const manager = new BleManager();

// const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";        // ← Thay bằng UUID thật
// const CHARACTERISTIC_UUID = "abcdef01-1234-5678-1234-56789abcdef0"; // ← Thay bằng UUID thật

// const BluetoothScreen = () => {
//   const [isScanning, setIsScanning] = useState(false);
//   const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
//   const [devices, setDevices] = useState({});
//   const [receivedData, setReceivedData] = useState("");

//   useEffect(() => {
//     if (bluetoothEnabled) startScan();
//     else stopScan();

//     return () => {
//       manager.stopDeviceScan();
//     };
//   }, [bluetoothEnabled]);

//   const startScan = () => {
//     setIsScanning(true);
//     setDevices({});

//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         Alert.alert('Lỗi', error.message);
//         setIsScanning(false);
//         return;
//       }

//       if (device?.name?.includes('THLA-SCALE')) {
//         setDevices(prev => ({ ...prev, [device.id]: device }));
//       }
//     });

//     setTimeout(() => {
//       manager.stopDeviceScan();
//       setIsScanning(false);
//     }, 5000);
//   };

//   const stopScan = () => {
//     manager.stopDeviceScan();
//     setIsScanning(false);
//   };

//   const connectToDevice = async (device) => {
//     try {
//       const connectedDevice = await manager.connectToDevice(device.id);
//       await connectedDevice.discoverAllServicesAndCharacteristics();

//       // Subcribe dữ liệu
//       connectedDevice.monitorCharacteristicForService(
//         SERVICE_UUID,
//         CHARACTERISTIC_UUID,
//         (error, characteristic) => {
//           if (error) {
//             console.log("Lỗi khi nhận notify:", error.message);
//             return;
//           }
//           const base64 = characteristic?.value;
//           if (base64) {
//             const decoded = Buffer.from(base64, 'base64').toString('utf-8');
//             setReceivedData(decoded);
//             console.log("Dữ liệu mới:", decoded);
//           }
//         }
//       );

//       Alert.alert('Kết nối thành công', `Đã kết nối với ${device.name}`);
//     } catch (err) {
//       Alert.alert('Lỗi', `Không thể kết nối: ${err.message}`);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
//       <Icon name="bluetooth" size={80} color='#7BBFF6' />
//       <Text style={styles.title}>Kết nối Bluetooth</Text>

//       <View style={styles.row}>
//         <Text style={styles.label}>Thiết bị</Text>
//         <Switch
//           value={bluetoothEnabled}
//           onValueChange={val => setBluetoothEnabled(val)}
//           trackColor={{ false: '#ccc', true: '#76EE59' }}
//         />
//       </View>

//       <FlatList
//         data={Object.values(devices)}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.deviceRow}>
//             <Text>{item.name}</Text>
//             <TouchableOpacity onPress={() => connectToDevice(item)} style={styles.connectBtn}>
//               <Text style={{ color: '#fff' }}>Kết nối</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         ListEmptyComponent={!isScanning && (
//           <Text style={{ marginTop: 20, color: '#aaa' }}>Không tìm thấy thiết bị</Text>
//         )}
//       />

//       {receivedData !== "" && (
//         <View style={styles.dataBox}>
//           <Text style={{ fontWeight: '600' }}>Dữ liệu nhận:</Text>
//           <Text>{receivedData}</Text>
//         </View>
//       )}

//       <TouchableOpacity style={styles.scanBtn} onPress={startScan}>
//         {isScanning ? <ActivityIndicator color={COLORS.primary} /> : (
//           <>
//             <Icon name="refresh-cw" size={16} />
//             <Text style={{ marginLeft: 6 }}>Quét lại</Text>
//           </>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default BluetoothScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     paddingTop: 36,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginVertical: 12,
//   },
//   row: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 16,
//     paddingHorizontal: 8,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   deviceRow: {
//     width: '100%',
//     padding: 12,
//     borderBottomWidth: 0.5,
//     borderColor: '#ccc',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   connectBtn: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   scanBtn: {
//     marginTop: 0,
//     marginBottom: 90,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f4f4f4',
//     padding: 10,
//     borderRadius: 24,
//     paddingHorizontal: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   dataBox: {
//     marginTop: 24,
//     padding: 16,
//     backgroundColor: '#eef',
//     borderRadius: 12,
//     width: '100%',
//   }
// });


import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Switch, FlatList,
  StyleSheet, Alert, ActivityIndicator, StatusBar, PermissionsAndroid, Platform
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import Icon from 'react-native-vector-icons/Feather';

const SERVICE_UUID = "0000ff00-0000-1000-8000-00805f9b34fb";
const CHARACTERISTIC_UUID = "0000ff01-0000-1000-8000-00805f9b34fb";
const BLE_DEVICE_NAME = "ESP32_SCALE";

const manager = new BleManager();

const BluetoothScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [devices, setDevices] = useState({});
  const [receivedData, setReceivedData] = useState("");

  useEffect(() => {
    requestPermissions();
    return () => manager.destroy();
  }, []);

  useEffect(() => {
    if (bluetoothEnabled) startScan();
    else stopScan();
  }, [bluetoothEnabled]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      const allGranted = Object.values(granted).every(val => val === PermissionsAndroid.RESULTS.GRANTED);
      if (!allGranted) {
        Alert.alert('Quyền bị từ chối', 'Ứng dụng cần quyền Bluetooth và vị trí để hoạt động.');
      }
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setDevices({});

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        Alert.alert('Lỗi quét', error.message);
        setIsScanning(false);
        return;
      }

      if (device?.name === BLE_DEVICE_NAME) {
        setDevices(prev => ({ ...prev, [device.id]: device }));
        manager.stopDeviceScan();
        setIsScanning(false);
        connectToDevice(device);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  const stopScan = () => {
    manager.stopDeviceScan();
    setIsScanning(false);
  };

  const connectToDevice = async (device) => {
    try {
      const connectedDevice = await manager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();

      const characteristic = await connectedDevice.readCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID
      );

      if (characteristic?.value) {
        const decoded = Buffer.from(characteristic.value, 'base64').toString('utf-8');
        setReceivedData(decoded);
        console.log("Dữ liệu nhận được:", decoded);
        Alert.alert("Thành công", `Kết nối tới ${device.name} và đọc dữ liệu.`);
      } else {
        Alert.alert("Không có dữ liệu", "Không đọc được dữ liệu từ ESP32.");
      }

    } catch (err) {
      Alert.alert('Lỗi kết nối', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
      <Icon name="bluetooth" size={80} color="#7BBFF6" />
      <Text style={styles.title}>Kết nối Bluetooth</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Bluetooth</Text>
        <Switch
          value={bluetoothEnabled}
          onValueChange={setBluetoothEnabled}
          trackColor={{ false: '#ccc', true: '#76EE59' }}
        />
      </View>

      <FlatList
        data={Object.values(devices)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceRow}>
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={() => connectToDevice(item)} style={styles.connectBtn}>
              <Text style={{ color: '#fff' }}>Kết nối</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={!isScanning && (
          <Text style={{ marginTop: 20, color: '#aaa' }}>Không tìm thấy thiết bị</Text>
        )}
      />

      {receivedData !== "" && (
        <View style={styles.dataBox}>
          <Text style={{ fontWeight: '600' }}>Dữ liệu nhận:</Text>
          <Text>{receivedData}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.scanBtn} onPress={startScan}>
        {isScanning ? <ActivityIndicator color="#007AFF" /> : (
          <>
            <Icon name="refresh-cw" size={16} />
            <Text style={{ marginLeft: 6 }}>Quét lại</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BluetoothScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  deviceRow: {
    width: '100%',
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  connectBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  scanBtn: {
    marginTop: 0,
    marginBottom: 90,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  dataBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#eef',
    borderRadius: 12,
    width: '100%',
  }
});


