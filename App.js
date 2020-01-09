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
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import { Icon } from 'react-native-elements'

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
const HEADER_MIN_HEIGHT = 75;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    searchValue: '',
    searchResult: null,
    isLoading: false,
    isLoadingMore: false,
    scrollY: new Animated.Value(0),
    totalPage: 0,
    page: 1,
    searchResultItems: [],
  };

  onChangeText = (text) => {
    this.setState({
      searchValue: text,
    })

  }

  onSubmit = async (text) => {
    // alert(text);
    const { searchValue, page, searchResultItems } = this.state;
    let numOfPage = 0;
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
      console.log('API Result: ', result);
      if (result.total_count === 0) {
        alert(`We couldn’t find any repositories matching '${text}'`)
      }
      const numOfPageRaw = (result.total_count / 10).toString();
      console.log(numOfPageRaw);
      var numOfPageRef = numOfPageRaw.substr(0, numOfPageRaw.indexOf('.'));
      if (numOfPageRaw > numOfPageRef) {
        numOfPage = Number(numOfPageRef) + 1;
      }

      console.log(numOfPage);
      this.setState({
        searchResult: result,
        isLoading: false,
        totalPage: numOfPage,
        page: 1,
        searchResultItems: result.items,
      })
    }

  }

  onLoadMore = async () => {
    console.log('Load More More');
    const { searchValue, page, searchResultItems, totalPage } = this.state;
    console.log(page);
    console.log(totalPage);

    if (page < totalPage) {

      this.setState({
        isLoadingMore: true,
      })
      const params = {
        q: searchValue,
        sort: 'stars',
        order: 'desc',
        page: page + 1,
        per_page: '10'
      }

      console.log(params);

      const result = await githubApi.getRepositories(params);
      console.log('API Result: ', result);
      if (result.total_count === 0) {
        alert(`We couldn’t find any repositories matching '${text}'`)
      }
      this.setState({
        searchResult: result,
        isLoadingMore: false,
        page: params.page,
        searchResultItems: [...searchResultItems, ...result.items],
      })
    }



  }

  renderItem = ({ item, index }) => {
    return (
      <Animatable.View animation="slideInUp" delay={index < 10 ? index * 150 : 150} duration={700} style={{ borderBottomWidth: 0.5, borderBottomColor: 'grey', marginHorizontal: 10, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <View style={styles.itemLeft}>
            <Text style={styles.fullNameText}>{item.full_name}</Text>
            <Text numberOfLines={2} style={styles.descriptionText}>{item.description}</Text>
            <Text style={styles.updateDtText}>{`Updated on ${moment(item.updated_at).format("ddd MMM DD YYYY")}`}</Text>
          </View>
          <View style={styles.itemRight}>
            <View style={styles.itemRightBox}>
              <View style={{ height: 10, width: 10, backgroundColor: getLangColor(item.language), borderRadius: 10 / 2, marginRight: 3 }} />
              <Text style={styles.languageText}>{item.language}</Text>
            </View>
            <View style={styles.itemRightBox}>
              <View style={{ marginRight: 1 }}>
                <Icon
                  name='star'
                  type='material'
                  size={14}
                />
              </View>
              <Text style={styles.starsText}>{item.stargazers_count}</Text>
            </View>
          </View>
        </View>
      </Animatable.View>);
  }

  renderFooter = () => {
    const { searchResultItems, isLoadingMore, totalPage, page } = this.state;
    if (searchResultItems.length < 1 || totalPage === page ) return null;

    return (
      <View style={{ alignItems: 'center', marginVertical: 30 }}>
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 40, width: 100, backgroundColor: '#26292E', borderRadius: 5 }} onPress={this.onLoadMore}>
          {!isLoadingMore && (<Text style={{ color: 'white' }}>Load More</Text>)}
          {isLoadingMore && (<ActivityIndicator animating size="small" />)}
        </TouchableOpacity>
      </View>

    );
  };

  render() {
    console.log(this.state);
    const { searchValue, searchResult, isLoading, scrollY, searchResultItems } = this.state;
    const data = searchResultItems;
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
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });

    const searchBarSize = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [35, 25],
      extrapolate: 'clamp',
    });

    const searchBarIconSize = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [20, 16],
      extrapolate: 'clamp',
    });

    return (
      <>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>

          <Animated.View style={{
            justifyContent: 'flex-end', paddingHorizontal: 20, backgroundColor: '#25292E', height: 150, position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            // height,
            transform: [{ translateY }],
          }}>
            <Animated.View style={{ paddingVertical: 10, opacity }}>
              <Text style={{ color: 'white' }}>Github Repository Search</Text>
            </Animated.View>

            <View style={{ borderColor: '#3F4347', borderWidth: 1, borderRadius: 5, paddingHorizontal: 5, marginVertical: 20, backgroundColor: '#3F4347', flexDirection: 'row', alignItems: 'center' }}>
              <AnimatedTextInput
                style={{ height: searchBarSize, color: 'white', flex: 0.99 }}
                onChangeText={text => this.onChangeText(text)}
                onSubmitEditing={event => this.onSubmit(event.nativeEvent.text)}
                value={searchValue}
                keyboardType="default"
                autoCapitalize='none'
                placeholder='Search repository'
              />
              <AnimatedIcon
                name='search'
                type='material'
                color={searchValue === '' ? 'grey' : 'white'}
                size={searchBarIconSize}
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
              },
            )
            }
            contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
          >
            <View style={{ paddingTop: 10, flex: 1, justifyContent: 'center' }}>
              {isLoading && (<ActivityIndicator size="large" />)}
              {resultsCount !== 0 && !isLoading && (<Animatable.Text animation="fadeIn" duration={700} style={styles.listTitle}>{`${resultsCount} repository results`}</Animatable.Text>)}
              {!isLoading && (<FlatList
                style={{ borderTopWidth: data.length > 0 ? 0.5 : 0, marginVertical: 10, borderTopColor: 'grey' }}
                data={data}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={this.renderFooter}
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
  itemLeft: { justifyContent: 'center', flex: 0.6, paddingVertical: 10, paddingLeft: 5, paddingRight: 10 },
  itemRight: { justifyContent: 'space-between', flex: 0.4, flexDirection: 'row', alignItems: 'center', paddingRight: 5 },
  itemRightBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
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
    fontSize: 9,
    fontWeight: 'normal',
    paddingVertical: 5,
  },
  updateDtText: {
    fontSize: 8,
    fontWeight: 'normal',
    paddingVertical: 10,
    color: 'grey'
  },
  languageText: {
    fontSize: 10,
    fontWeight: 'normal',
  },
  starsText: {
    fontSize: 10,
    fontWeight: 'normal',
  },
});

// export default App;
