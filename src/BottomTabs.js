import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/HomeScreen";
import BluetoothScreen from "./screens/BluetoothScreen";

import { COLORS } from './screens/OnboardingScreen';
import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/Octicons';
import CustomTabBarButton from "./components/CustomTabBarButton";
import { useNavigation } from "@react-navigation/native";
import UserScreen from "./screens/UserScreen";
import ListScreen from "./screens/HistoryWeight";
import HistoryWeight from "./screens/HistoryWeight";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    
    const navigation = useNavigation();

    return (
        <Tab.Navigator screenOptions={({route}) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: COLORS.bg_tabBar,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                position: 'absolute',
            },
            tabBarActiveTintColor: COLORS.color_icon,
            tabBarInactiveTintColor: COLORS.white,
        })}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabelStyle: {
                        fontSize: 9,
                    },
                    tabBarLabel: 'Trang chủ',
                    tabBarIcon: ({ color, size, focused }) => (
                    <Icon name="home" color={color} size={20} />
                    ),
                }}
            />
            <Tab.Screen 
                name='Bluetooth' 
                component={BluetoothScreen}
                options={{
                    tabBarLabelStyle: {
                        fontSize: 9,
                    },
                    tabBarLabel: 'Kết nối',
                    tabBarIcon: ({ color, size }) => (
                    <Icon2 name="bluetooth" color={color} size={18} />
                    ),
                }}
            />
            <Tab.Screen 
                name='Scan' 
                component={View} 
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ color, size }) => (
                      <Icon1 name="qrcode-scan" color={color} size={22} />
                    ),
                    tabBarButton: props => <CustomTabBarButton {...props} />
                }}
            />
            <Tab.Screen 
                name='List' 
                component={HistoryWeight}
                options={{
                    tabBarLabelStyle: {
                        fontSize: 9,
                    },
                    tabBarLabel: 'Lịch sử cân',
                    tabBarIcon: ({ color, size }) => (
                    <Icon3 name="history" color={color} size={18} />
                    ),
                }}
            />
            <Tab.Screen 
                name='User' 
                component={UserScreen}
                options={{
                    tabBarLabelStyle: {
                        fontSize: 9,
                    },
                    tabBarLabel: 'Hồ sơ',
                    tabBarIcon: ({ color, size }) => (
                    <Icon2 name="user" color={color} size={20} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

