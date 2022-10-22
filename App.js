import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, IconButton } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MapScreen from "./screens/MapScreen";
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: "Home",
              headerRight: () => (
                <IconButton
                  style={{ marginTop: 0, marginRight: -12 }}
                  icon="plus-box"
                  onPress={() => navigation.navigate("Map")}
                  size={28}
                  color="#333"
                />
              ),
            })}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{
              title: "Map",
            }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
