import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ImageBackground, Image, Modal, StatusBar, SafeAreaView } from 'react-native';
import { COLORS } from '../screens/OnboardingScreen';

const LoadingOverlay = ({ visible, message = 'Đang tải dữ liệu...' }) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Animation quay vòng
  useEffect(() => {
    let animation;
    if (visible) {
      rotateValue.setValue(0); // Reset vòng quay mỗi lần mở lại
      animation = Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      animation.start();
    }

    return () => {
      if (animation) {
        animation.stop(); // Ngắt vòng lặp nếu component unmount hoặc tắt overlay
      }
    };
  }, [visible]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal statusBarTranslucent transparent visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
        <ImageBackground
          source={require('../images/bg_loading.png')}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <Animated.Image
            style={[styles.indicatorImage, { transform: [{ rotate }] }]}
            source={require('../images/activityIndicator.png')}
          />
        </ImageBackground>
      </View>
    </Modal>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  backgroundImage: {
    width: 250,
    height: 250,
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  indicatorImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    position: 'absolute',
    top: '40%',
  },
});
