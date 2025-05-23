import { createDrawerNavigator } from "@react-navigation/drawer";

import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import UserScreen from "./screens/UserScreen";
import BottomTabs from "./BottomTabs";

import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import { COLORS } from "./screens/OnboardingScreen";
import { View } from "react-native";
import CustomDrawer from "./components/CustomDrawer";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={({route}) => ({
                headerShown: false,
                drawerActiveTintColor: COLORS.white, // Màu chữ khi focused
                drawerInactiveTintColor: COLORS.color_text,
                drawerActiveBackgroundColor: COLORS.bg_button,
                drawerItemStyle: {
                  borderRadius: 8,
                  marginVertical: 4,
                },
                drawerLabelStyle: {
                  fontSize: 14,
                },
                drawerContentStyle: {
                  paddingTop: 20,
                },
            })}
        >
            <Drawer.Screen 
                name='Home' 
                component={BottomTabs}
                options={{
                    title: 'Trang chủ',
                    drawerIcon: ({focused, color, size}) => (
                        <Icon2 name='home' size={focused ? 22 : 18} color={focused ? COLORS.white : COLORS.color_text} />
                    ),
                    drawerActiveBackgroundColor: COLORS.bg_button
                }}
            />
            <Drawer.Screen
                name='ChangePassword' 
                component={ChangePasswordScreen} 
                options={{
                    title: 'Đổi mật khẩu',
                    drawerIcon: ({focused, color, size}) => (
                        <Icon1 name='key-outline' size={focused ? 26 : 20} color={focused ? COLORS.white : COLORS.color_text} />
                            
                    ),
                    drawerActiveBackgroundColor: COLORS.bg_button,
                }}
            />
            <Drawer.Screen 
                name='User' 
                component={UserScreen} 
                options={{
                    title: 'Thông tin',
                    drawerIcon: ({focused, color, size}) => (
                        <Icon2 name='user' size={focused ? 26 : 20} color={focused ? COLORS.white : COLORS.color_text} />
                    ),
                    drawerActiveBackgroundColor: COLORS.bg_button,
                }}
            />
        </Drawer.Navigator>
    )
}

