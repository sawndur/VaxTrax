import React from 'react';
import { SafeAreaView, Image, View } from 'react-native';
import { Button, Divider, Text, Input, Icon, Layout, Datepicker, TopNavigation } from '@ui-kitten/components';
import { ThemeContext } from './theme-context';

export const UserInfo = ({ navigation }) => {
    
    const themeContext = React.useContext(ThemeContext);
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{width: '98%', borderRadius: 15, height: '99%', backgroundColor: 'rgba(238,153,45, 0.3)'}}>
                    <Text style={{borderBottomWidth: 1, alignSelf: 'center', fontFamily: 'BroshkOrange-8MOLA', fontSize: 50}}>Progress Tracking</Text>
                    <View style={{width: '95%', alignSelf: 'center', borderRadius: 5, borderWidth: 0.5, padding: 10, marginVertical: 10}}>
                        <Text style={{fontSize: 18, marginBottom: 10, fontFamily: 'BroshkOrange-8MOLA'}}>1st Dose</Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 0.45, marginRight: 5}}>
                                <Input 
                                    label={'Vaccine Type'}
                                    size='small'
                                />
                            </View>
                            <View style={{flex: 0.45}}>
                                <Datepicker 
                                    label={'Date'}
                                    size="small"
                                />
                            </View>                           
                        </View>
                        <Input 
                            size={'large'}
                            label={'Notes'}
                        />
                        <Text style={{fontSize: 12, color: 'gray', opacity: 0.8, marginTop: 8}}>Photos</Text>
                        <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <Icon 
                                style={{width: 32, height: 32}}
                                fill="gray"
                                name="plus-outline"
                            />
                            <Image 
                                source={{uri: 'https://api.time.com/wp-content/uploads/2020/11/vaccines-what-we-know.jpg'}}
                                style={{width: 75, height: 75, marginHorizontal: 5, borderRadius: 10,}}
                                resizeMode={'cover'}
                            />
                            <Image 
                                source={{uri: 'https://idsb.tmgrup.com.tr/ly/uploads/images/2021/01/14/85668.jpg'}}
                                style={{width: 75, height: 75, marginHorizontal: 5, borderRadius: 10,}}
                                resizeMode={'cover'}
                            />
                            <Image 
                                source={{uri: 'https://ca-times.brightspotcdn.com/dims4/default/fb8ac00/2147483647/strip/true/crop/1458x1247+0+0/resize/1458x1247!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F86%2F5d%2F97edd8f84f11921e265e422a2038%2Fdan-shot.jpg'}}
                                style={{width: 75, height: 75, marginHorizontal: 5, borderRadius: 10,}}
                                resizeMode={'cover'}
                            />
                        </View>
                    </View>
                    <View style={{width: '95%', alignSelf: 'center', borderRadius: 5, borderWidth: 0.5, padding: 10, marginVertical: 10}}>
                        <Text style={{fontSize: 18, marginBottom: 10, fontFamily: 'BroshkOrange-8MOLA'}}>2nd Dose</Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 0.45, marginRight: 5}}>
                                <Input 
                                    label={'Vaccine Type'}
                                    size='small'
                                />
                            </View>
                            <View style={{flex: 0.45}}>
                                <Datepicker 
                                    label={'Date'}
                                    size="small"
                                />
                            </View>                           
                        </View>
                        <Input 
                            size={'large'}
                            label={'Notes'}
                        />
                        <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <Icon 
                                style={{width: 32, height: 32}}
                                fill="gray"
                                name="plus-outline"
                            />
                            <Image 
                                source={{uri: 'https://www.chamberlain.edu/sites/g/files/krcnkv336/files/styles/atge_no_style_lg/public/2020-12/large-TiffanyHusband.jpg'}}
                                style={{width: 75, height: 75, marginHorizontal: 5, borderRadius: 10,}}
                                resizeMode={'cover'}
                            />
                            <Image 
                                source={{uri: 'https://www.mskcc.org/sites/default/files/styles/large/public/node/217006/3x2/vaccine_210119_197_1200x800.jpg'}}
                                style={{width: 75, height: 75, marginHorizontal: 5, borderRadius: 10,}}
                                resizeMode={'cover'}
                            />
                            <Image 
                                source={{uri: 'https://mma.prnewswire.com/media/1440001/Kroger_Health_Vaccine.jpg'}}
                                style={{width: 75, height: 75, marginHorizontal: 5, borderRadius: 10,}}
                                resizeMode={'cover'}
                            />
                        </View>
                    </View>
                </View>             
                
            </Layout>
        </SafeAreaView>
    );

}