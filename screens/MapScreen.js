import {
  Alert,
  StyleSheet,
  View
} from "react-native";
import { Button } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';

import CadastroPosto from "../components/CadastroPosto";
import CalculoRota from "../components/CalculoRota";
import CadastroPessoa from "../components/CadastroPessoa";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";

const StackSheet = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

export default function MapScreen({ navigation, route }) {

  const initialRegion = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  };

  const initialMark = {
    latitude: 0,
    longitude: 0,
  };

  const [region, setRegion] = useState(initialRegion);
  const [mark, setMark] = useState(initialMark);

  const onRegionChange = (regiao) => {
    setRegion(regiao);
  };

  useEffect(() => {
    if (route.params?.id) {
      navigationRef.navigate('Avaliação', { id: route.params?.id })
    }
  }, [route.params?.id]);

  const setLocationToRegion = (location) => {
    setRegion({ ...region, latitude: location.coords.latitude, longitude: location.coords.longitude });
    setMark({ ...mark, latitude: location.coords.latitude, longitude: location.coords.longitude });
  }

  const setCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão negada, por favor nos permita usar sua localização!');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocationToRegion(location);
  }

  const setLocationToAdress = async (location) => {
    Geocoder.init("AIzaSyAgrvvasgUAtMe2mQKkYWQLUx5AXs0ZkAk");
    Geocoder.from(location.nativeEvent.coordinate.latitude, location.nativeEvent.coordinate.longitude)
      .then(json => {
        var addressComponent = json.results[0].formatted_address;
        navigationRef.navigate('Avaliação', {endereco: addressComponent})
      }).catch(error => console.warn(error));
  }

  useEffect(() => {
    setCurrentLocation();
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={[styles.formContainer]}>
        <MapView
          region={region}
          //onRegionChange={onRegionChange}
          style={{ height: '100%', width: '100%' }}
          onPoiClick={setLocationToAdress}
        >
          <Marker coordinate={mark}></Marker>
        </MapView>
      </View>
      <View style={[styles.formContainer]}>
        <NavigationContainer independent={true} ref={navigationRef}>
          <StackSheet.Navigator initialRouteName="Calculo">
            <StackSheet.Screen
              name="Avaliação"
              component={CadastroPosto}
              options={{ headerShown: false }}
            />
            <StackSheet.Screen
              name="Premium"
              component={CadastroPessoa}
              options={{ headerShown: false }}
            />
            <StackSheet.Screen
              name="Calculo"
              component={CalculoRota}
              options={{ headerShown: false }}
            />
          </StackSheet.Navigator>
        </NavigationContainer>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: '100%'
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 18,
  },
});