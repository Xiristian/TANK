import {
  StyleSheet,
  View
} from "react-native";
import { Button } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";

import CadastroPosto from "../components/CadastroPosto";
import CalculoRota from "../components/CalculoRota";
import CadastroPessoa from "../components/CadastroPessoa";
import MapView from "react-native-maps";
import { useEffect, useState } from "react";

const StackSheet = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

export default function MapScreen({ navigation, route }) {
  const initialRegion = {
    latitude: -28.70249,
    longitude: -49.40550,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState(initialRegion);
  const voltar = () => setRegion(initialRegion);

  function onRegionChange(region) {
    setRegion({ region });
  };

  useEffect(() => {
    if (route.params?.id) {
      navigationRef.navigate('Avaliação', {id:route.params?.id})
    }
  }, [route.params?.id]);

  return (
    <View style={[styles.container]}>
      <View style={[styles.formContainer, { borderColor: 'green' }]}>
        <Button onPress={voltar} >Retorno</Button>
        <Button onPress={() => navigationRef.navigate('Calculo')} >Calculo</Button>
        <MapView
          region={region}
          onRegionChange={onRegionChange}
          style={{ height: '100%', width: '100%' }}
          onPoiClick={() => { }}
        >
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
    borderColor: 'red',
    borderWidth: 3
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 18,
  },
});