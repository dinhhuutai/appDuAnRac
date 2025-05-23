import { StyleSheet, Text, View, FlatList, ImageBackground, StatusBar, Button, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { COLORS } from './OnboardingScreen';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment-timezone';

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const mockData = [
  {
    id: '1',
    user: 'Nguyễn Văn A',
    team: 'Tổ 1',
    line: 'Chuyền 2',
    wasteType: 'Nhựa',
    weight: '3.5 kg',
    timestamp: '11/05/2025 - 08:32',
  },
  {
    id: '2',
    user: 'Trần Thị B',
    team: 'Tổ 2',
    line: 'Chuyền 1',
    wasteType: 'Giấy',
    weight: '2.2 kg',
    timestamp: '10/05/2025 - 14:10',
  },
  {
    id: '3',
    user: 'Nguyễn Văn A',
    team: 'Tổ 1',
    line: 'Chuyền 2',
    wasteType: 'Nhựa',
    weight: '3.5 kg',
    timestamp: '11/05/2025 - 08:32',
  },
  {
    id: '4',
    user: 'Trần Thị B',
    team: 'Tổ 2',
    line: 'Chuyền 1',
    wasteType: 'Giấy',
    weight: '2.2 kg',
    timestamp: '10/05/2025 - 14:10',
  },
  {
    id: '5',
    user: 'Nguyễn Văn A',
    team: 'Tổ 1',
    line: 'Chuyền 2',
    wasteType: 'Nhựa',
    weight: '3.5 kg',
    timestamp: '11/05/2025 - 08:32',
  },
  {
    id: '6',
    user: 'Trần Thị B',
    team: 'Tổ 2',
    line: 'Chuyền 1',
    wasteType: 'Giấy',
    weight: '2.2 kg',
    timestamp: '10/05/2025 - 14:10',
  },
];

const HistoryWeight = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [loading, setLoading] = useState(false);
  
const [historyData, setHistoryData] = useState([]);

useEffect(() => {
  if (isFocused) {
    fetchHistory();
  }
}, [isFocused, selectedDate]);

  const handleToggleInput = () => {
    setShowDatePicker(true);
  }

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString(); // gửi ISO string cho server
      const response = await fetch(`https://duanrac-api-node-habqhehnc6a2hkaq.southeastasia-01.azurewebsites.net/history?userID=${user.userID}&date=${dateStr}`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map(item => ({
          id: item.weighingTime, // bạn nên có id riêng nếu có
          user: item.fullName,
          team: item.departmentName,
          line: item.unitName || '',
          wasteType: item.trashName,
          weight: item.weightKg + ' kg',
          // Chuyển thời gian từ UTC sang giờ VN
          timestamp: moment.utc(item.weighingTime).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY - HH:mm'),
        }));
        setHistoryData(formattedData);
      } else {
        const errorText = await response.text();
        Alert.alert('Lỗi', errorText || 'Không thể tải dữ liệu lịch sử');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Không thể kết nối tới server');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.userName}>{item.user}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Tổ:</Text>
        <Text style={styles.value}>{item.team}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Chuyền:</Text>
        <Text style={styles.value}>{item.line}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Loại rác:</Text>
        <Text style={styles.value}>{item.wasteType}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Khối lượng:</Text>
        <Text style={[styles.value, { fontWeight: 'bold', color: COLORS.primary }]}>
          {item.weight}
        </Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../images/bgPage.png')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
      <LoadingOverlay visible={loading} />
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" translucent barStyle='dark-content' />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lịch sử cân rác</Text>

          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={handleToggleInput}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: COLORS.bg_lineBle,
                borderRadius: 50,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Icon name="date-range" size={20} color={COLORS.color_text} />
              <Text
                style={{
                  color: COLORS.color_text,
                  textAlign: 'center',
                  flex: 1,
                  fontSize: 13,
                }}
              >{moment(selectedDate).format('DD/MM/YYYY')}</Text>
            </TouchableOpacity>

            <DatePicker
              modal
              open={showDatePicker}
              date={selectedDate}
              mode='date'
              title="Chọn ngày xem lịch sử cân rác"
              onConfirm={(date) => {
                if(date) {
                  setSelectedDate(date);
                }
                setShowDatePicker(false);
              }}
              onCancel={() => {
                setShowDatePicker(!showDatePicker);
              }}
            />
          </View>

        </View>

        {/* Danh sách */}
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
};

export default HistoryWeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 36,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 0,
    gap: 24,

    // 👇 Viền dưới nhẹ
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  title: {
    color: COLORS.color_textOnBoarding,
    fontWeight: '800',
    fontSize: 20,

  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: COLORS.color_textOnBoarding,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
});
