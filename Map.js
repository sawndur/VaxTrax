import React, {useState, useEffect} from 'react';
import { FlatList, SafeAreaView, Text, Image, Dimensions, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Button, Divider,  Layout, TopNavigation, Input, Icon } from '@ui-kitten/components';
import { ThemeContext } from './theme-context';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import RNLocation from 'react-native-location';
import { Marker } from 'react-native-maps';
import prettyFormat from 'pretty-format';
import { Callout } from 'react-native-maps';
import BottomSheet from 'reanimated-bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { covidInfo } from './covid-info';

const DEFAULT_ZOOM_LATITUDE = 0.0100;
const DEFAULT_ZOOM_LONGITUDE = 0.0120;

export const Map = ({ navigation }) => {
    const sheetRef = React.useRef(null);
    const mapRef = React.useRef();
    const themeContext = React.useContext(ThemeContext);
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [searchValue, setSearchValue] = useState("");
    const [dataLoaded, setDataLoaded] = useState(false);
    const [detailsLoaded, setDetailsLoaded] = useState(false);
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedMarker, setMarker] = useState({});
    const [bottomSheetStatus, bottomSheetOpened] = useState(false)
    const [viewType, setViewType] = useState("details")
    const [listItems, setListItems] = useState([])

    const fetchInitialData = (location) => {
        const latitude = location.latitude; // you can update it with user's latitude & Longitude
        const longitude = location.longitude;
        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&radius=' + 10000 + '&keyword=cvs+walgreens' +  '&key=' + 'AIzaSyCXTt1AETdySLl6k1XGrBmsW2aQbp8vX1s'
        fetch(url)
            .then(res => {
            return res.json()
            })
            .then(res => {
    
                var places = []
                for(let googlePlace of res.results) {
                    var place = {}
                    var lat = googlePlace.geometry.location.lat;
                    var lng = googlePlace.geometry.location.lng;
                    var coordinate = {
                        latitude: lat,
                        longitude: lng,
                    }    

                    place['placeTypes'] = googlePlace.types
                    place['coordinate'] = coordinate
                    place['placeName'] = googlePlace.name
                    place['address'] = googlePlace.vicinity;
                    place['placeId'] = googlePlace.place_id;

                    places.push(place);
                }

                // Do your work here with places Array
                console.log(prettyFormat(places))
                setPharmacies(places);
                setDataLoaded(true);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const fetchSpecificDetails = (pharmacy) => {
        const url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + pharmacy.placeId + '&fields=formatted_address,formatted_phone_number&key=AIzaSyCXTt1AETdySLl6k1XGrBmsW2aQbp8vX1s'
        fetch(url).then(res => {
            return res.json()
        }).then(res => {
            let details = res.result;
            let markerObj = pharmacy;
            markerObj.address = details.formatted_address;
            markerObj.phone_number = details.formatted_phone_number;
            setMarker(markerObj);
            setDetailsLoaded(true);
        })
    }   

    useEffect(() => {
        RNLocation.configure({ distanceFilter: 500 });
        RNLocation.getLatestLocation({ timeout: 60000 })
        .then(latestLocation => {
            // Use the location here
            setRegion({ 
                latitude: latestLocation.latitude,
                longitude: latestLocation.longitude,
                latitudeDelta: DEFAULT_ZOOM_LATITUDE,
                longitudeDelta: DEFAULT_ZOOM_LONGITUDE,
            })
            fetchInitialData(latestLocation)
        })
        //console.log(prettyFormat(covidInfo))
    }, [])

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <Button onPress={() => {}} />
          ),
        });
    }, [navigation]);

    const moveMap = (location) => {
        mapRef.current?.animateCamera({
            center: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            zoom: 10               
        }, 500)
        setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0023
        })
    }

    /* RENDER */
    const SearchIcon = (style) => (
        <Icon {...style} name='search' />
      );
      
    const SearchBar = () => (
        <Input 
            placeholder='Search Vaccine Type' 
            value={searchValue}
            onChangeText={nextValue => setSearchValue(nextValue)}
            accessoryLeft={SearchIcon}
            style={{ width: Dimensions.get('window').width, height: '5%', position: 'absolute', top: 0, right: 0, left: 0 }}
        />
    );

    const renderMarkerImage = (pharmacy) => {
        if (pharmacy.placeName.toUpperCase() == "CVS PHARMACY" || pharmacy.placeName.toUpperCase() == 'CVS') {
            return require('./CVS_logo.png')
        } else if (pharmacy.placeName.toUpperCase() == "WALGREENS PHARMACY" || pharmacy.placeName.toUpperCase() == "WALGREENS") {
            return require('./Walgreens_logo.png')
        }
    }

    const renderTextInfo = () => {
        if (selectedMarker.placeName.toUpperCase() == "CVS PHARMACY" || selectedMarker.placeName.toUpperCase() == 'CVS') {
            return ( 
                <ScrollView style={{flexDirection: 'column'}}>
                    <Text style={{marginVertical: 5, fontSize: 16}}>{covidInfo[0].prepInfo1}</Text>
                    <Text style={{marginVertical: 5, fontSize: 16}}>{covidInfo[0].prepInfo2}</Text>
                    <Text style={{marginVertical: 5, fontSize: 16}}>{covidInfo[0].prepInfo3}</Text>
                </ScrollView>
            )
        } else {
            return (
                <ScrollView style={{flexDirection: 'column'}}>
                    <Text style={{marginVertical: 5, fontSize: 16}}>{covidInfo[1].prepInfo1}</Text>
                    <Text style={{marginVertical: 5, fontSize: 16}}>{covidInfo[1].prepInfo2}</Text>
                </ScrollView>
            )
        }
    }

    const renderBottomSheet = () => {
        if (viewType == "details") {
            if (detailsLoaded == true) {
                return (
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 16,
                            height: '100%',
                        }}
                    >
                        <View style={{width: Dimensions.get('window').width-50, height: 100}}>
                            <Image 
                                source={renderMarkerImage(selectedMarker)}
                                style={{flex: 1, width: null, height: null}}
                                resizeMode={'contain'}
                            />
                        </View>
                        <View style={{flexDirection: 'column', marginVertical: 10}}>
                            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                <Ionicons 
                                    name="navigate"
                                    size={30}
                                    color={"#EE992D"}
                                    style={{marginRight: 5 }}
                                />
                                <View>
                                    <Text style={{fontSize: 20, width: '80%'}}>
                                        {selectedMarker.address}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 2}}>
                                <Ionicons 
                                    name="call"
                                    size={25}
                                    color={"#EE992D"}
                                    style={{marginRight: 5}}
                                />
                                <View>
                                    <Text style={{fontSize: 20}}>
                                        {selectedMarker.phone_number}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 2}}>
                                <Ionicons 
                                    name="globe"
                                    size={25}
                                    color={"#EE992D"}
                                    style={{marginRight: 5}}
                                />
                                <View>
                                    <Text style={{fontSize: 16,}}>
                                        {selectedMarker.placeName.toUpperCase() == "CVS PHARMACY" || selectedMarker.placeName.toUpperCase() == 'CVS' ?
                                        "https://www.cvs.com/vaccine/intake/store/covid-screener/covid-qns" : "https://www.walgreens.com/findcare/vaccination/covid-19?ban=covid_vaccine4_landing_schedule"
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginVertical: 10, width: Dimensions.get('window').width-50, borderWidth: 0.5, borderColor: 'gray', opacity: 0.5 }}/>
                        {renderTextInfo()}
                    </View>
                )
            }
        } else if (viewType == "list") {
            if (listItems.length > 0) {
                return (
                    <FlatList 
                        keyExtractor={(item, index) => index.toString()}
                        data={listItems}
                        renderItem={renderListItems}
                        contentContainerStyle={{
                            backgroundColor: 'white',
                            padding: 16,
                            height: '100%',
                        }}
                    />
                )
            }
        }
    }

    const renderListItems = (data) => {
        return (
            <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, paddingVertical: 10, flexDirection: 'row', marginVertical: 5, justifyContent: 'center'}}
                onPress={() => {
                    moveMap(data.item.coordinate);
                }}
            >
                <View style={{width: 125, height: 30, flexBasis: '40%'}}>
                    <Image 
                        style={{width: null, height: null, flex: 1}}
                        resizeMode={'contain'}
                        source={renderMarkerImage(data.item)}
                    /> 
                </View>
                <Text style={{flexBasis: '60%'}}>
                    {data.item.address}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <>
        <View style={styles.container}>
            <View style={{position: 'absolute', top: 0, borderRadius: 5, height: '5%', backgroundColor: 'transparent', width: Dimensions.get('window').width, paddingHorizontal: 15, zIndex: 1}}>
                    <Text style={{fontFamily: 'Roboto', color: 'black', fontSize: 20, textShadowColor: "orange", textShadowRadius: 1,}}>
                        Find a vaccine provider near you!
                    </Text>
            </View>
            <View style={{position: 'absolute', top: 30, height: '10%', backgroundColor: 'transparent', width: Dimensions.get('window').width-5, zIndex: 1}}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity style={{elevation: 15, marginVertical: 5, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', width: 200, height: 'auto', backgroundColor: 'white', borderRadius: 15, borderWidth: 1,}} onPress={() => {
                        let walgreens = pharmacies.filter((pharmacy, index) => {
                            if (pharmacy.placeName.toUpperCase() == "WALGREENS PHARMACY" || pharmacy.placeName.toUpperCase() == "WALGREENS") {
                                return pharmacy;
                            }
                        })
                        setViewType("list");
                        sheetRef.current.snapTo(1);
                        bottomSheetOpened(true);
                        setListItems(walgreens);
                        moveMap(walgreens[0].coordinate)
                    }}>
                        <Image
                            source={require('./Walgreens_logo.png')}
                            style={{width: 200, height: 50}}
                            resizeMode={"contain"}
                        />
                    </TouchableOpacity>   
                    <TouchableOpacity style={{elevation: 15, marginVertical: 5, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', width: 200, height: 'auto', backgroundColor: 'white', borderRadius: 15, borderWidth: 1,}} onPress={() => {
                        let CVS = pharmacies.filter((pharmacy, index) => {
                            if (index < 2 && pharmacy.placeName.toUpperCase() == "CVS PHARMACY" || pharmacy.placeName.toUpperCase() == "CVS") {
                                return pharmacy;
                            }
                        })
                        setViewType("list");
                        sheetRef.current.snapTo(1);
                        bottomSheetOpened(true);
                        setListItems(CVS);
                        moveMap(CVS[0].coordinate)
                    }}>
                        <Image
                            source={require('./CVS_logo.png')}
                            style={{width: 200, height: 50}}
                            resizeMode={"contain"}
                        />
                    </TouchableOpacity>  
                    <TouchableOpacity style={{elevation: 15, marginVertical: 5, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', width: 200, height: 'auto', backgroundColor: 'white', borderRadius: 15, borderWidth: 1,}} onPress={() => {

                    }}>
                        <Image
                            source={require('./walmart_logo.png')}
                            style={{width: 200, height: 50}}
                            resizeMode={"contain"}
                        />
                    </TouchableOpacity>  
                </ScrollView>
            </View>
            <MapView
                tracksViewChanges={false}
                ref={mapRef}
                showsUserLocation={true}
                provider={PROVIDER_GOOGLE} 
                style={[styles.map, {height: bottomSheetStatus == true ? '50%' : '85%', bottom: bottomSheetStatus == true ? 250 : 0}]}
                onMapReady={() => {
                    mapRef.current.getCamera();
                }}
                region={region}
            >
                {dataLoaded == true && 
                  pharmacies.map((pharmacy, index) => { 
                    if (index < 5) {
                        return (
                            <Marker
                                key={index.toString()}
                                coordinate={{latitude: pharmacy.coordinate.latitude, longitude: pharmacy.coordinate.longitude}}
                                onPress={() => {
                                    console.log('pressed pharmacy as ', pharmacy)
                                    sheetRef.current.snapTo(1);
                                    moveMap(pharmacy.coordinate);
                                    bottomSheetOpened(true);
                                    setDetailsLoaded(false);
                                    fetchSpecificDetails(pharmacy);
                                    setViewType("details");
                                }}
                            >
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Icon 
                                        style={{width: 30, height: 30, marginRight: 5}}  
                                        fill="red"                              
                                        name="pin-outline"
                                    />
                                    <View style={{width: 125, height: 30}}>
                                        <Image 
                                            style={{width: null, height: null, flex: 1}}
                                            resizeMode={'contain'}
                                            source={renderMarkerImage(pharmacy)}
                                        /> 
                                    </View>                                     
                                </View>
                            </Marker>
                        )
                    }
                  })
                }
            </MapView>
        </View>
        <BottomSheet
            enabledInnerScrolling={true}
            enabledContentTapInteraction={false}            
            ref={sheetRef}
            snapPoints={[500, 300, 0]}
            initialSnap={1}
            renderContent={renderBottomSheet}
            onCloseEnd={() => { 
                bottomSheetOpened(false);
            }}
        />
       </>
    );

}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
});