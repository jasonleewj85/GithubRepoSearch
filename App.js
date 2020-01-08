/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import githubApi from 'src/api/githubApi';
import { getLangColor } from 'src/constant/githubLangColors';

const HEADER_MAX_HEIGHT = 150;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default class App extends React.Component {
  state = {
    searchValue: '',
    searchResult: null,
    isLoading: false,
    scrollY: new Animated.Value(0),
  };
  // constructor(props) {
  //   super(props);
  //   // SplashScreen.hide()
  //   this.store = configureStore();
  // }

  // componentDidMount() {
  //   if (Text.defaultProps == null) Text.defaultProps = {};
  //   Text.defaultProps.allowFontScaling = false;

  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //   });
  //   if (Platform.OS === 'ios') {
  //     StatusBarSizeIOS.addEventListener('willChange', this.handleStatusBarSizeWillChange);
  //   }

  //   AppState.addEventListener('change', this.handleAppStateChange);
  //   Keyboard.addListener(
  //     `keyboard${Platform.OS === 'ios' ? 'Will' : 'Did'}Show`,
  //     this.onKeyboardAppear,
  //   );
  //   Keyboard.addListener(
  //     `keyboard${Platform.OS === 'ios' ? 'Will' : 'Did'}Hide`,
  //     this.onKeyboardHide,
  //   );
  //   this.onKeyboardHide();
  //   Keyboard.dismiss();

  //   Dimensions.addEventListener('change', () => {
  //     // this important to reset height according to new height when keyboard appear
  //     this.onKeyboardHide();
  //     Keyboard.dismiss();

  //     // this.setState({
  //     //   orientation: Platform.isPortrait() ? 'portrait' : 'landscape'
  //     // });
  //   });
  // }

  // componentWillUnmount() {
  //   if (Platform.OS === 'ios') {
  //     StatusBarSizeIOS.removeEventListener('willChange', this.handleStatusBarSizeWillChange);
  //   }

  //   AppState.removeEventListener('change', this.handleAppStateChange);
  // }

  // onKeyboardAppear = (e) => {
  //   if (Platform.OS === 'ios') {
  //     StatusBarManager.getHeight(({ height }) => {
  //       currentscreenHeight = DeviceInfo.isHasNotch ? DeviceInfo.screenHeight : DeviceInfo.screenHeight - (height - 20);
  //       setKeyboardStateDispatch({
  //         isAppear: true,
  //         keyboardHeight: e.endCoordinates.height,
  //         screenHeight: currentscreenHeight - e.endCoordinates.height,
  //       });
  //     });
  //   } else {
  //     setKeyboardStateDispatch({
  //       isAppear: true,
  //       keyboardHeight: e.endCoordinates.height,
  //       screenHeight: DeviceInfo.deviceHeight - e.endCoordinates.height - (StatusBar.currentHeight > 27 ? StatusBar.currentHeight : 0),
  //     });
  //   }
  // }

  // onKeyboardHide = () => {
  //   if (Platform.OS === 'ios') {
  //     StatusBarManager.getHeight(({ height }) => {
  //       currentscreenHeight = DeviceInfo.isHasNotch ? DeviceInfo.screenHeight : DeviceInfo.screenHeight - (height - 20);
  //       setKeyboardStateDispatch({
  //         isAppear: false,
  //         screenHeight: currentscreenHeight,
  //         keyboardHeight: 0,
  //       });
  //     });
  //   } else {
  //     setKeyboardStateDispatch({
  //       isAppear: false,
  //       screenHeight: DeviceInfo.deviceHeight,
  //       keyboardHeight: 0,
  //     });
  //   }
  // }

  // handleStatusBarSizeWillChange = () => {
  //   const reduxState = this.store.getState();
  //   const { app } = reduxState;
  //   const { keyboard } = app;
  //   StatusBarManager.getHeight(({ height }) => {
  //     currentscreenHeight = !keyboard.isAppear ? DeviceInfo.deviceHeight - (height - 20) : keyboard.screenHeight + (height === 20 ? 20 : -20);
  //     updateStatusBarHeightDispatch(currentscreenHeight);
  //   });
  // }

  // handleAppStateChange = (nextAppState) => {
  //   setAppState(nextAppState);
  //   if (nextAppState === 'active') {
  //     // App has come to the foreground!
  //     console.log('App has come to the foreground!');
  //     checkMaintenance();
  //     SplashScreen.hide(); // SplashScreen.hide
  //   }

  //   if (nextAppState === 'inactive') {
  //     // App has come to the inactive!
  //   }

  //   if (nextAppState === 'background') {
  //     // App has come to the background!
  //   }
  // };

  onChangeText = (text) => {
    this.setState({
      searchValue: text,
    })

  }

  onSubmit = async (text) => {
    // alert(text);
    console.log(text)
    if (text === '') {
      alert('Please key in any keyword');
    } else {
      this.setState({
        isLoading: true,
      })
      const params = {
        q: text,
        sort: 'stars',
        order: 'desc',
        page: '1',
        per_page: '10'
      }

      const result = await githubApi.getRepositories(params);
      console.log(result);
      this.setState({
        searchResult: result,
        isLoading: false,
      })
    }

  }

  renderItem = ({ item, index }) => {
    console.log('reder');
    console.log(item);
    // const langColor = getLangColor();
    return (
      <Animatable.View animation="slideInUp" delay={index * 150} duration={700} style={{ borderBottomWidth: 0.5, borderBottomColor: 'black' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <View style={styles.itemLeft}>
            <Text style={styles.fullNameText}>{item.full_name}</Text>
            <Text numberOfLines={2} style={styles.descriptionText}>{item.description}</Text>
            <Text style={styles.updateDtText}>{item.updated_at}</Text>
          </View>
          <View style={styles.itemRight}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ height: 10, width: 10, backgroundColor: getLangColor(item.language), borderRadius: 10 / 2, marginRight: 3 }} />
              <Text style={styles.languageText}>{item.language}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ height: 10, width: 10, backgroundColor: 'red', marginRight: 3 }} />
              <Text style={styles.starsText}>{item.stargazers_count}</Text>
            </View>
          </View>
        </View>
      </Animatable.View>);
  }

  render() {
    const { searchValue, searchResult, isLoading, scrollY } = this.state;
    const data = searchResult === null ? [] : searchResult.items;
    const resultsCount = searchResult === null ? 0 : searchResult.total_count;
    const translateY = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const height = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [150, 0],
      extrapolate: 'clamp',
    });
    const opacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const searchBarSize = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [35, 25],
      extrapolate: 'clamp',
    });
    return (
      <>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>

          <Animated.View style={{
            paddingVertical: 30, paddingHorizontal: 20, backgroundColor: '#25292E', height: 150, position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            // height,
            transform: [{ translateY }],
          }}>
            <Animated.View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, opacity }}>
              <Text style={{ color: 'white' }}>Github Repo Search</Text>
            </Animated.View>

            <View style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 18, paddingHorizontal: 10, marginVertical: 20 }}>
              <AnimatedTextInput
                style={{ height: searchBarSize, color: 'white' }}
                onChangeText={text => this.onChangeText(text)}
                onSubmitEditing={event => this.onSubmit(event.nativeEvent.text)}
                value={searchValue}
              />
            </View>
          </Animated.View>
          <AnimatedScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={6}
            decelerationRate="normal"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: false,
                // listener: (event) => {
                //   const { y } = event.nativeEvent.contentOffset;
                //   if (index === tabToCheck) {
                //     this.alignScrollViews(route.key, y);
                //   }
                // },
              },
            )}
            contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT + 10 }}
          >
            <View style={{ paddingVertical: 30, flex: 1, justifyContent: 'center' }}>
              {isLoading && (<ActivityIndicator size="large" color="#0000ff" />)}
              {resultsCount !== 0 && !isLoading && (<Animatable.Text animation="fadeIn" duration={700} style={styles.listTitle}>{`${resultsCount} repository results`}</Animatable.Text>)}
              {!isLoading && (<FlatList
                style={{ borderWidth: data.length > 0 ? 0.5 : 0, marginVertical: 10 }}
                data={data}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
              />)}
            </View>
          </AnimatedScrollView>
          {/* <View style={{ paddingVertical: 30, flex: 1, justifyContent: 'center' }}>
            {isLoading && (<ActivityIndicator size="large" color="#0000ff" />)}
            {resultsCount !== 0 && !isLoading && (<Animatable.Text animation="fadeIn" duration={700} style={styles.listTitle}>{`${resultsCount} repository results`}</Animatable.Text>)}
            {!isLoading && (<FlatList
              style={{ borderWidth: data.length > 0 ? 0.5 : 0, marginVertical: 10 }}
              data={data}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />)}
          </View> */}
        </View>
      </>
    );
  }
}

// const App: () => React$Node = () => {
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <View style={{ alignItems: 'center', paddingTop: 50 }}>
//           <Text>Github Repo Search</Text>
//         </View>
//         <View>
//           <TextInput
//             style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
//             onChangeText={text => onChangeText(text)}
//             value={value}
//           />
//         </View>
//       </SafeAreaView>
//     </>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemLeft: { justifyContent: 'center', flex: 0.6, paddingVertical: 10, paddingHorizontal: 5 },
  itemRight: { justifyContent: 'space-between', flex: 0.4, flexDirection: 'row', alignItems: 'center', paddingRight: 5 },
  listTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    padding: 5,
  },
  fullNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6285F0',
    paddingVertical: 10,
  },
  descriptionText: {
    fontSize: 10,
    fontWeight: 'normal',
    paddingVertical: 5,
  },
  updateDtText: {
    fontSize: 8,
    fontWeight: 'normal',
    paddingVertical: 10,
  },
  languageText: {
    fontSize: 10,
    fontWeight: 'normal',
  },
  starsText: {
    fontSize: 10,
    fontWeight: 'normal',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

// export default App;
