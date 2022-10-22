import {
  StyleSheet,
  View
} from "react-native";
import { Button } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import * as Location from 'expo-location';

import CadastroPosto from "../components/CadastroPosto";
import CalculoRota from "../components/CalculoRota";
import CadastroPessoa from "../components/CadastroPessoa";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";

const StackSheet = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

export default function MapScreen({ navigation, route }) {
  const initialRegion = {
    'region': {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }
  };

  const initialMark = {
    latitude: 0,
    longitude: 0,
  };

  const [region, setRegion] = useState(initialRegion);
  const [mark, setMark] = useState(initialMark);

  function onRegionChange(region) {
    setRegion({ region });
  };

  useEffect(() => {
    if (route.params?.id) {
      navigationRef.navigate('Avaliação', { id: route.params?.id })
    }
  }, [route.params?.id]);

  function setLocationToRegion(location) {
    let newRegion = {'region':{
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,}
    };

    let newMark = initialMark;

    newRegion.longitudeDelta = region.region.longitudeDelta;
    newRegion.latitudeDelta = region.region.latitudeDelta;
    newRegion.latitude = location.coords.latitude;
    newRegion.longitude = location.coords.longitude;
    newMark.latitude = location.coords.latitude;
    newMark.longitude = location.coords.longitude;

    setRegion(newRegion);
    setMark(newMark)
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

  useEffect(() => {
    setCurrentLocation();
  }, [Location]);

  return (
    <View style={[styles.container]}>
      <View style={[styles.formContainer]}>
        <Button onPress={setCurrentLocation} >Retorno</Button>
        <Button onPress={() => navigationRef.navigate('Calculo')} >Calculo</Button>
        <MapView
          region={region}
          onRegionChange={onRegionChange}
          style={{ height: '100%', width: '100%' }}
          onPoiClick={() => { }}
        >
          <Marker coordinate={mark}></Marker>
        </MapView>
      </View>
      <View style={[styles.formContainer]}>
        <NavigationContainer independent={true} ref={navigationRef}>
          <StackSheet.Navigator initialRouteName="Avaliação">
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