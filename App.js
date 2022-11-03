import 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';

import MapScreen from "./screens/MapScreen";
import HomeScreen from './screens/HomeScreen';

const Drawer = createDrawerNavigator();

const theme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#45C4CC',
    secondary: '#45C4CC',
    tertiary: '#45C4CC',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen
            name="Home"
            component={HomeScreen}
            options={({
              title: "MEUS DADOS",
            })}
          />
          <Drawer.Screen
            name="Map"
            component={MapScreen}
            options={{
              title: "CALCULAR ROTA",
            }}
          />
        </Drawer.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}