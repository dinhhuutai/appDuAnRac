import React from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export const COLORS = {
  primary: '#282534',
  white: '#fff',
  bg_onBoarding: '#6AF77F',
  bg_button: '#4CAF50',
  bg_dotNotPage: '#ACEBAF',
  color_textButton: '#FFFFFF',
  color_textOnBoarding: '#07860C',
  color_icon: '#1E821C',
  bg_item: '#66EB6D',
  bg_groupItem: '#D3FFCA',
  bg_scan: '#15BC17',
  bg_tabBar: '#27F877',
  bg_changeMode: '#1BED1B',
  bg_noticeSelect: '#006605',
  bg_buttonToggleActive: '#76EE59',
  bg_buttonToggleInactive: '#EFEFEF',

  color_text: '#000000',
  color_textPlacer: '#BAAAAA',
  bg_iconPrev: '#524545',
  bg_lineBle: '#F5EFEF',
  bg_buttonBle: '#7BBFF6',
};

const slides = [
  {
    id: '1',
    image: require('../images/imageOnboarding-1.png'),
    title: '',
    subtitle: '',
  },
  {
    id: '2',
    image: require('../images/imageOnboarding-2.png'),
    title: 'Bảo vệ môi trường từ hành động nhỏ',
    subtitle: 'Mỗi lần phân loại rác đúng cách là một bước tiến tới hành tinh xanh hơn. Hãy bắt đầu từ việc nhỏ nhất',
  },
  {
    id: '3',
    image: require('../images/imageOnboarding-3.png'),
    title: 'Theo dõi rác thải mỗi ngày',
    subtitle: 'Xem lại lượng rác bạn đã thải ra, theo dõi tiến trình giảm thiểu và cùng nhau thay đổi thói quen sống bền vững',
  },
];

const Slide = ({item}) => {
  return (
    <View style={{alignItems: 'center', width, marginTop: 36}}>
      <Image
        source={item?.image}
        className={`${item.id === '1' ? 'h-[100%]' : 'h-[75%]'}`}
        style={{width, resizeMode: 'contain'}}
      />
      <View className={'items-center'}>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.subtitle}>{item?.subtitle}</Text>
      </View>
    </View>
  );
};

const OnboardingScreen = ({navigation}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.25,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        {/* Indicator container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30,
          }}>
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: COLORS.white,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{marginBottom: 50}}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{height: 50}}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.replace('LoginScreen')}>
                <Text style={{fontWeight: 'bold', fontSize: 15, color: COLORS.white}}>
                  GET STARTED
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: COLORS.bg_button,
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: COLORS.color_text,
                  }}>
                  SKIP
                </Text>
              </TouchableOpacity>
              <View style={{width: 15}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: COLORS.white,
                  }}>
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className='bg-[#6AF77F]' style={{flex: 1}}>
      <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />

      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: COLORS.color_text,
    fontSize: 13,
    marginTop: 14,
    maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 23,
    flexWrap: 'wrap',
  },
  title: {
    color: COLORS.color_textOnBoarding,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 0,
    textAlign: 'center',
    maxWidth: '90%',
    flexWrap: 'wrap',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: 'grey',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: COLORS.bg_button,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default OnboardingScreen;