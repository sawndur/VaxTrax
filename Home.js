import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, View, ScrollView, FlatList, Dimensions} from 'react-native';
import { Button, Divider, Text, Layout, TopNavigation, Card } from '@ui-kitten/components';
import { ThemeContext } from './theme-context';
import prettyFormat from 'pretty-format';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { bounce } from 'react-native/Libraries/Animated/Easing';

export const Home = ({ navigation }) => {
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(3,36,77, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    const themeContext = React.useContext(ThemeContext);
    const [hiddenView, setHiddenView] = useState(true)
    const [bounceValue, setBounceValue] = useState(new Animated.Value(0))
    const [news, setNews] = useState([]);
    const [covidCases, setCovidCases] = useState([]);
    const [deathCases, setDeathCases] = useState([]);
    const [covidData, setCovidData] = useState({});

    const fetchNews = () => {
        fetch("https://covid-19-news.p.rapidapi.com/v1/covid?q=covid&lang=en&media=True", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "58143f60a0msh9b238a4cf58ba29p1e28e0jsn9e523b0104ba",
                "x-rapidapi-host": "covid-19-news.p.rapidapi.com"
            }
        })
        .then(response => {
            return response.json();
        }).then(res => {
            //console.log('news set to ', prettyFormat(res.articles))
            setNews(res.articles)
        })
        .catch(err => {
            console.error(err);
        });
    }

    const fetchCovidCases = () => {
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "__cfduid=da58ff8ab12ce0bfd3c789dbcb6b7b2a51618106011");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://corona.lmao.ninja/v2/historical/usacounties/alabama?lastdays=120", requestOptions)
            .then(response => {
                return response.json()
            }).then(res => {
                let leeCases = res.find(counties => {
                    return counties.county == "lee"
                })
                let dates = [];
                let deaths = [];
                for (let date in leeCases.timeline.cases) {
                    let dateObj = {};
                    dateObj.date = date;
                    dateObj.count = leeCases.timeline.cases[date];
                    dates.push(dateObj);
                }
                setCovidCases(dates);
            })
    }

    const fetchCovidData = () => {
        fetch('https://api.covidtracking.com/v1/states/al/current.json')
            .then(response => {
                return response.json()
            }).then(res => {
                console.log(prettyFormat(res))
                setCovidData(res)
            })
    }

    const toggleAnimatedView = () => {
        let toValue = 100;
        // if (hiddenView) {
        //     toValue = 100;
        // }

        Animated.spring(
            bounceValue,
            {
                toValue: 500,
                velocity: 3,
                tension: 2,
                friction: 8,
            }
        ).start();
        //setHiddenView(!hiddenView);
    }

    useEffect(() => {
        fetchNews();
        fetchCovidCases();
        fetchCovidData();
    },[])

    const renderNews = (data) => {
        
        return (
            <View style={{height: 'auto', width: Dimensions.get('window').width,}}>
                <View style={{alignSelf: 'center', marginTop: 10, width: '95%', height: 250,}}>
                    <Image
                        blurRadius={5} 
                        style={{width: null, height: null, flex: 1, borderTopRightRadius: 15, borderTopLeftRadius: 15,}}
                        source={{uri: data.item.media}}
                        resizeMode="cover"
                    />
                    <TouchableOpacity onPress={() => toggleAnimatedView()}>
                        <Text adjustFontSizeToFit style={{ width: '100%', height: 60,
                        padding: 10, paddingTop: 15, backgroundColor: 'white', fontWeight: 'bold',
                        borderRadius: 10, borderColor: '#EE992D', bottom: 10,
                        }}
                        >
                            {data.item.title}
                        </Text>
                    </TouchableOpacity>
                    <Animated.View
                        style={[{ height: bounceValue, backgroundColor: 'red', width: 300},{
                            transform: [{translateY: bounceValue}]
                        }]}
                    >
                        <Text>Hello</Text>
                    </Animated.View>
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1, justifyContent: 'flex-start', }}>
                <ScrollView>
                    <View style={{borderBottomWidth: 1, backgroundColor: '#03244d', paddingBottom: 25, paddingTop: 5}}>
                        <Text style={{fontSize: 35, color: '#EE992D', fontFamily: 'BroshkOrange-8MOLA', fontWeight: '100', marginTop: 5, marginLeft: 10,}}>Covid-19 News</Text>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            data={news}
                            renderItem={renderNews}
                            horizontal={true}
                            disableIntervalMomentum={ true } 
                            snapToInterval={Dimensions.get('window').width}
                        />
                    </View>                    
                    <View style={{height: Dimensions.get('window').height-100, width: Dimensions.get('window').width, backgroundColor: 'rgba(238,153,45, 1)', borderTopLeftRadius: 15, borderTopRightRadius: 15, bottom: 15}}>
                        <Text style={{color: '#03244d', fontSize: 30, fontWeight: '100', marginLeft: 15, marginVertical: 10, fontFamily: 'BroshkPlum-YzqJL'}}>
                            Current Statistics for Alabama
                        </Text>
                        <View style={{flexDirection: 'row', marginVertical: 5, marginHorizontal: 10, justifyContent: 'space-evenly'}}>
                            <View style={{marginHorizontal: 5, borderRadius: 10, padding: 15, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', flexBasis: '33%', backgroundColor: 'rgba(3,36,77, 1)'}}>
                                <Text style={{fontFamily: 'Futura', color: 'white', fontSize: 14,}}>Positive  Cases</Text>
                                <Text style={{color: 'white', marginTop: 15, marginRight: 10, fontSize: 18}}>{covidData.positive}</Text>
                            </View>
                            <View style={{marginHorizontal: 5, borderRadius: 10, padding: 15, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', flexBasis: '33%', backgroundColor: 'rgba(3,36,77, 0.9)'}}>
                                <Text style={{color: 'white', fontSize: 14}}>Probable Cases</Text>
                                <Text style={{color: 'white', marginTop: 15, marginRight: 10, fontSize: 18}}>{covidData.probableCases}</Text>
                            </View>
                            <View style={{marginHorizontal: 5, borderRadius: 10, padding: 15, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', flexBasis: '33%', backgroundColor: 'rgba(3,36,77, 0.8)'}}>
                                <Text style={{color: 'white', fontSize: 14}}>Negative Cases</Text>
                                <Text style={{color: 'white', marginTop: 15, marginRight: 10, fontSize: 18}}>{covidData.negative}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 5, marginHorizontal: 10, justifyContent: 'space-evenly'}}>
                            <View style={{marginHorizontal: 5, borderRadius: 10, padding: 15, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', flexBasis: '33%', backgroundColor: 'rgba(3,36,77, 0.8)'}}>
                                <Text style={{color: 'white', fontSize: 14, marginRight: 5}}>Deaths</Text>
                                <Text style={{color: 'white', marginTop: 15, marginRight: 5, fontSize: 18}}>{covidData.death}</Text>
                            </View>
                            <View style={{marginHorizontal: 5, borderRadius: 10, padding: 15, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', flexBasis: '33%', backgroundColor: 'rgba(3,36,77, 0.9)'}}>
                                <Text style={{color: 'white', fontSize: 14}}>Hospitalized</Text>
                                <Text style={{color: 'white', marginTop: 15, marginRight: 10, fontSize: 18}}>{covidData.hospitalized}</Text>
                            </View>
                            <View style={{marginHorizontal: 5, borderRadius: 10, padding: 15, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', flexBasis: '33%', backgroundColor: 'rgba(3,36,77, 1)'}}>
                                <Text style={{color: 'white', fontSize: 14}}>Recovered</Text>
                                <Text style={{color: 'white', marginTop: 15, marginRight: 10, fontSize: 18}}>{covidData.recovered}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{marginVertical: 10}}>
                                <Text style={{color: '#03244d', fontSize: 32, fontWeight: '100', marginLeft: 15, marginVertical: 10, fontFamily: 'BroshkPlum-YzqJL'}}>
                                    Covid Cases Heatmap
                                </Text>
                                <ContributionGraph
                                    values={covidCases}
                                    endDate={new Date()}
                                    numDays={110}
                                    width={Dimensions.get('window').width+5}
                                    height={220}
                                    chartConfig={chartConfig}
                                    onDayPress={day => {console.log(day)}}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>                
            </Layout>
        </SafeAreaView>
    );

}