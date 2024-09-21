import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Overboard from "./components/Overboard";
import Loading from "./components/Loading";
import CreateGroup from "./components/CreateGroup";
import CombattantDetail from "./components/CombattantDetail";
import CreateBet from "./components/CreateBet";
import Bet from "./components/Bet";

// import Detail  from "./components/Detail";
import MyTabs from "./Navigation/MyTabs";
import MyTopTabs from "./Navigation/MyTopTabs";
import PageConfirmation from "./components/PageConfirmation";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export default function App() {
  const [user, setUser] = useState(null);
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    const fetchUser = async () => {
      const res = await SecureStore.getItemAsync("user");
      setUser(JSON.parse(res));
    };
    fetchUser();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerBackTitleStyle: { fontSize: 20 },
          headerBackTitleVisible: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen
              name="Loading"
              component={Loading}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Overboard" component={Overboard} options={{ headerShown: false }}/>
            <Stack.Screen 
              name="PageConfirmation"
              options={{ 
                headerShown: true, 
                title: "Confirmation de connection",
                headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: "white"
            }}
              screenOptions={{
                headerStyle: {
                  backgroundColor: 'black',
                },
              }}
            >
              {(props) => <PageConfirmation {...props} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{ 
                headerShown: true, 
                title: "Inscription",
                headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: "white"
            }}
              screenOptions={{
                headerStyle: {
                  backgroundColor: 'black',
                },
              }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ 
                headerShown: true, 
                title: "Connexion",
                headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: "white"
            }}
              screenOptions={{
                headerStyle: {
                  backgroundColor: 'black',
                },
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="MyTabs" options={{ headerShown: false }}>
              {(props) => <MyTabs {...props} setUser={setUser} user={user}/>}
            </Stack.Screen>
            <Stack.Screen name="MyTopTabs" options={{}}>
              {(props) => <MyTopTabs {...props} user={user}/>}
            </Stack.Screen>
            <Stack.Screen name="CreateGroup" options={{
              headerTitle: "Crée ton groupe",
              headerTintColor: "#fa580a",
              headerTransparent: true,
              headerBackTitleVisible: true
            }}>
              {(props) => <CreateGroup {...props} user={user}/>}
            </Stack.Screen>
            <Stack.Screen name="CombattantDetail" options={{
              headerBackTitle: "Tous",
              headerTitle: "",
              headerTintColor: "#fa580a",
              headerTransparent: true,
              headerBackTitleVisible: true}}>
              {(props) => <CombattantDetail {...props} />}
            </Stack.Screen>
            <Stack.Screen name="CreateBet" options={{}}>
              {(props) => <CreateBet {...props} user={user}/>}
            </Stack.Screen>
            <Stack.Screen name="Bet" options={{}}>
              {(props) => <Bet {...props} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
