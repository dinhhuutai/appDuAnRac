

// import React, { useEffect, useState, useContext } from 'react';
// import {
//   View, Text, TouchableOpacity, Switch, FlatList,
//   StyleSheet, Alert, ActivityIndicator, StatusBar, PermissionsAndroid, Platform
// } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import { Buffer } from 'buffer';
// import Icon from 'react-native-vector-icons/Feather';
// import { WeightContext } from '../contexts/WeightContext';

// const SERVICE_UUID = "0000ff00-0000-1000-8000-00805f9b34fb";
// const CHARACTERISTIC_UUID = "0000ff01-0000-1000-8000-00805f9b34fb";
// const BLE_DEVICE_NAME = "ESP32_SCALE";

// const manager = new BleManager();

// const BluetoothScreen = () => {
//   const [isScanning, setIsScanning] = useState(false);
//   const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
//   const [devices, setDevices] = useState({});
//   const [receivedData, setReceivedData] = useState("");

//   const { setWeight } = useContext(WeightContext);

//   useEffect(() => {
//     requestPermissions();
//     return () => manager.destroy();
//   }, []);

//   useEffect(() => {
//     if (bluetoothEnabled) startScan();
//     else stopScan();
//   }, [bluetoothEnabled]);

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       ]);
//       const allGranted = Object.values(granted).every(val => val === PermissionsAndroid.RESULTS.GRANTED);
//       if (!allGranted) {
//         Alert.alert('Quyền bị từ chối', 'Ứng dụng cần quyền Bluetooth và vị trí để hoạt động.');
//       }
//     }
//   };

//   const startScan = () => {
//     setIsScanning(true);
//     setDevices({});

//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         Alert.alert('Lỗi quét', error.message);
//         setIsScanning(false);
//         return;
//       }

//       if (device?.name === BLE_DEVICE_NAME) {
//         setDevices(prev => ({ ...prev, [device.id]: device }));
//         manager.stopDeviceScan();
//         setIsScanning(false);
//         connectToDevice(device);
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

//       const characteristic = await connectedDevice.readCharacteristicForService(
//         SERVICE_UUID,
//         CHARACTERISTIC_UUID
//       );

//       if (characteristic?.value) {
//         const decoded = Buffer.from(characteristic.value, 'base64').toString('utf-8');
//         setReceivedData(decoded);
//         setWeight(decoded);
//         console.log("Dữ liệu nhận được:", decoded);
//         Alert.alert("Thành công", `Kết nối tới ${device.name}. Dữ liệu: ${decoded}`);
//       } else {
//         Alert.alert("Không có dữ liệu", "Không đọc được dữ liệu từ ESP32.");
//       }

//     } catch (err) {
//       Alert.alert('Lỗi kết nối', err.message);
//     }
//   };



//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
//       <Icon name="bluetooth" size={80} color="#7BBFF6" />
//       <Text style={styles.title}>Kết nối Bluetooth</Text>

//       <View style={styles.row}>
//         <Text style={styles.label}>Bluetooth</Text>
//         <Switch
//           value={bluetoothEnabled}
//           onValueChange={setBluetoothEnabled}
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
//         {isScanning ? <ActivityIndicator color="#007AFF" /> : (
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
//     backgroundColor: '#007AFF',
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
//     marginTop: 10,
//     padding: 16,
//     backgroundColor: '#eef',
//     borderRadius: 12,
//     width: '100%',
//   }
// });


///////........2222222222222222222

// import React, { useEffect, useState, useContext, useRef } from 'react';
// import {
//   View, Text, TouchableOpacity, Switch, FlatList,
//   StyleSheet, Alert, ActivityIndicator, StatusBar, PermissionsAndroid, Platform
// } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import { Buffer } from 'buffer';
// import Icon from 'react-native-vector-icons/Feather';
// import { WeightContext } from '../contexts/WeightContext';

// const SERVICE_UUID = "0000ff00-0000-1000-8000-00805f9b34fb";
// const CHARACTERISTIC_UUID = "0000ff01-0000-1000-8000-00805f9b34fb";
// const BLE_DEVICE_NAME = "ESP32_SCALE";

// const manager = new BleManager();

// const BluetoothScreen = () => {
//   const [isScanning, setIsScanning] = useState(false);
//   const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
//   const [devices, setDevices] = useState({});
//   const [receivedData, setReceivedData] = useState("");
//   const { setWeight } = useContext(WeightContext);

//   const [connectedDevice, setConnectedDevice] = useState(null);

//   const deviceRef = useRef(null);
//   const subscriptionRef = useRef(null);
//   const scanStoppedRef = useRef(false);

//   useEffect(() => {
//     // Clean up khi thoát màn hình
//     return () => {
//       if (connectedDevice) {
//         connectedDevice.cancelConnection();
//       }
//       manager.destroy();
//     };
//   }, [connectedDevice]);

//   useEffect(() => {
//     requestPermissions();
//     manager.state().then(state => {
//       if (state !== 'PoweredOn') setBluetoothEnabled(false);
//     });

//     return () => {
//       if (subscriptionRef.current) subscriptionRef.current.remove();
//       if (deviceRef.current) deviceRef.current.cancelConnection();
//       manager.destroy();
//     };
//   }, []);

//   useEffect(() => {
//     if (bluetoothEnabled) startScan();
//     else stopScan();
//   }, [bluetoothEnabled]);

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       ]);
//       const allGranted = Object.values(granted).every(val => val === PermissionsAndroid.RESULTS.GRANTED);
//       if (!allGranted) {
//         Alert.alert('Quyền bị từ chối', 'Ứng dụng cần quyền Bluetooth và vị trí để hoạt động.');
//       }
//     }
//   };

//   const startScan = () => {
//     if (isScanning) return;
//     scanStoppedRef.current = false;
//     setIsScanning(true);
//     setDevices({});

//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         Alert.alert('Lỗi quét', error.message);
//         stopScan();
//         return;
//       }

//       if (device?.name === BLE_DEVICE_NAME && !scanStoppedRef.current) {
//         setDevices(prev => ({ ...prev, [device.id]: device }));
//         scanStoppedRef.current = true;
//         manager.stopDeviceScan();
//         setIsScanning(false);
//         connectToDevice(device);
//       }
//     });

//     setTimeout(() => {
//       if (!scanStoppedRef.current) {
//         manager.stopDeviceScan();
//         setIsScanning(false);
//       }
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

//       const characteristic = await connectedDevice.monitorCharacteristicForService(
//         SERVICE_UUID,
//         CHARACTERISTIC_UUID,
//         (error, characteristic) => {
//           if (error) {
//             console.error("Lỗi nhận dữ liệu:", error.message);
//             return;
//           }

//           if (characteristic?.value) {
//             const decoded = Buffer.from(characteristic.value, 'base64').toString('utf-8');
//             setReceivedData(decoded);
//             setWeight(decoded);
//             console.log("Đã nhận qua notify:", decoded);
//           }
//         }
//       );

//       Alert.alert("Thành công", `Đã kết nối tới ${device.name}`);
//     } catch (err) {
//       Alert.alert("Lỗi kết nối", err.message);
//     }
//   };


//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
//       <Icon name="bluetooth" size={80} color="#7BBFF6" />
//       <Text style={styles.title}>Kết nối Bluetooth</Text>

//       <View style={styles.row}>
//         <Text style={styles.label}>Bluetooth</Text>
//         <Switch
//           value={bluetoothEnabled}
//           onValueChange={setBluetoothEnabled}
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
//         {isScanning ? <ActivityIndicator color="#007AFF" /> : (
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
//     backgroundColor: '#007AFF',
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
//     marginTop: 20,
//     padding: 16,
//     backgroundColor: '#eef',
//     borderRadius: 12,
//     width: '100%',
//   }
// });


/////////3........3333333333
import React, { useContext } from 'react';
import {
  View, Text, TouchableOpacity, Switch, FlatList,
  StyleSheet, Alert, ActivityIndicator, StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { BluetoothContext } from '../contexts/BluetoothContext';
import { WeightContext } from '../contexts/WeightContext';

const BluetoothScreen = () => {
  const {
    bluetoothEnabled,
    setBluetoothEnabled,
    isScanning,
    devices,
    receivedData,
    connectedDevice,
    startScan,
    disconnectDevice,
    connectToDevice,
  } = useContext(BluetoothContext);

  const { setWeight } = useContext(WeightContext);

  // Cập nhật weight khi nhận data mới
  React.useEffect(() => {
    if (receivedData) {
      setWeight(receivedData);
    }
  }, [receivedData, setWeight]);

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

            {
              connectedDevice ? (
                <TouchableOpacity
                  style={styles.disconnectBtn}
                  onPress={() => {
                    setWeight(0);
                    disconnectDevice()
                  }}
                >
                  <Text style={{ color: '#fff' }}>Ngắt kết nối</Text>
                </TouchableOpacity>
              ) : 
              <TouchableOpacity
                onPress={() => {
                  if (item.name === "ESP32_SCALE") {
                    connectToDevice(item);
                  } else {
                    Alert.alert("Thiết bị không đúng", "Chỉ hỗ trợ kết nối ESP32_SCALE.");
                  }
                }}
                style={styles.connectBtn}
              >
                <Text style={{ color: '#fff' }}>Kết nối</Text>
              </TouchableOpacity>
            }
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

      {
        receivedData === "" &&
            <TouchableOpacity style={styles.scanBtn} onPress={startScan}>
              {isScanning ? <ActivityIndicator color="#007AFF" /> : (
                <>
                  <Icon name="refresh-cw" size={16} />
                  <Text style={{ marginLeft: 6 }}>Quét lại</Text>
                </>
              )}
            </TouchableOpacity>
      }
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
    paddingBottom: 100,
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
    marginBottom: 20,
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
  disconnectBtn: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  dataBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#eef',
    borderRadius: 12,
    width: '100%',
  }
});
