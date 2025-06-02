import React, { createContext, useState, useEffect, useRef } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

export const BluetoothContext = createContext();

const SERVICE_UUID = "0000ff00-0000-1000-8000-00805f9b34fb";
const CHARACTERISTIC_UUID = "0000ff01-0000-1000-8000-00805f9b34fb";
const BLE_DEVICE_NAME = "ESP32_SCALE";

export const BluetoothProvider = ({ children }) => {
  const manager = useRef(new BleManager()).current;
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState({});
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [receivedData, setReceivedData] = useState("");

  const deviceRef = useRef(null);
  const scanStoppedRef = useRef(false);
  const subscriptionRef = useRef(null);

  // Yêu cầu quyền trên Android
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

  useEffect(() => {
    requestPermissions();

    manager.state().then(state => {
      if (state !== 'PoweredOn') setBluetoothEnabled(false);
    });

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.remove();
      if (deviceRef.current) deviceRef.current.cancelConnection();
      manager.destroy();
    };
  }, [manager]);

  useEffect(() => {
    if (bluetoothEnabled) {
      startScan();
    } else {
      stopScan();
    }
  }, [bluetoothEnabled]);

  const startScan = () => {
    if (isScanning) return;
    scanStoppedRef.current = false;
    setIsScanning(true);
    setDevices({});

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        Alert.alert('Lỗi quét', error.message);
        stopScan();
        return;
      }

      if (device?.name === BLE_DEVICE_NAME && !scanStoppedRef.current) {
        setDevices(prev => ({ ...prev, [device.id]: device }));
        scanStoppedRef.current = true;
        manager.stopDeviceScan();
        setIsScanning(false);
        connectToDevice(device);
      }
    });

    setTimeout(() => {
      if (!scanStoppedRef.current) {
        manager.stopDeviceScan();
        setIsScanning(false);
      }
    }, 5000);
  };

  const stopScan = () => {
    manager.stopDeviceScan();
    setIsScanning(false);
  };

  const connectToDevice = async (device) => {
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();

      subscriptionRef.current = connected.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error("Lỗi nhận dữ liệu:", error.message);
            return;
          }
          if (characteristic?.value) {
            const decoded = Buffer.from(characteristic.value, 'base64').toString('utf-8');
            setReceivedData(decoded);
          }
        }
      );

      setConnectedDevice(connected);
      deviceRef.current = connected;

    } catch (err) {
      Alert.alert("Lỗi kết nối", err.message);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        setReceivedData("");
      } catch (error) {
        console.error("Lỗi ngắt kết nối:", error.message);
        Alert.alert("Lỗi", "Không thể ngắt kết nối thiết bị.");
      }
    } else {
      Alert.alert("Thông báo", "Chưa có thiết bị nào được kết nối.");
    }
  };

  return (
    <BluetoothContext.Provider value={{
      bluetoothEnabled,
      setBluetoothEnabled,
      isScanning,
      devices,
      receivedData,
      connectedDevice,
      startScan,
      stopScan,
      connectToDevice,
      disconnectDevice,
    }}>
      {children}
    </BluetoothContext.Provider>
  );
};
