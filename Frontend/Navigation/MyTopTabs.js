import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SettingIcon from 'react-native-vector-icons/FontAwesome';
import PodiumIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MatchNBetIcon from "react-native-vector-icons/MaterialIcons";
import Match from "../components/Match"
import Bet from "../components/Bet"
import Classement from '../components/Classement';
import GroupeSettings from '../components/GroupeSettings';
const MyTopTabs = ({route, user}) => {
    const Tab = createMaterialTopTabNavigator()
    const Stack = createNativeStackNavigator()
  return (
    <Tab.Navigator
    screenOptions={{
        title: null,
        headerShown: false,
        tabBarActiveTintColor: "red",
        tabBarActiveBackgroundColor: "white",
        tabBarInactiveBackgroundColor: "red",
        tabBarInactiveTintColor: "white",
        tabBarStyle: { backgroundColor: 'black' }
      }}>
        <Tab.Screen
      name={"bottomNavMatch"}
      options={{
        tabBarLabel: "match",
        tabBarIcon: ({ color }) => (<MatchNBetIcon name="sports-mma" color={color} size={28} />),
        unmountOnBlur: true,
        tabBarLabelStyle: {
          fontSize: 10,
        }
      }}
     >
        {()=><Stack.Navigator >
     <Stack.Screen name={"Match"} options={{ headerShown: false }}>
       {(props)=><Match {...props}route={route}user={user} />}
     </Stack.Screen>
     </Stack.Navigator>
      }
     </Tab.Screen>
        <Tab.Screen
      name={"bottomNavBet"}
      options={{
        tabBarLabel: "bet",
        tabBarIcon: ({ color }) => (<MatchNBetIcon name="casino" color={color} size={25} />),
        unmountOnBlur: true,
        tabBarLabelStyle: {
          fontSize: 10,
        }
      }}
     >
        {()=><Stack.Navigator >
     <Stack.Screen name={"Bet"} options={{ headerShown: false }}>
       {(props)=><Bet {...props} route={route} user={user} />}
     </Stack.Screen>
     </Stack.Navigator>
      }
     </Tab.Screen>
        <Tab.Screen
      name={"bottomNavClassement"}
      options={{
        tabBarLabel: "Classement",
        tabBarIcon: ({ color }) => (<PodiumIcon name="podium" color={color} size={25} />),
        tabBarLabelStyle: {
          fontSize: 10,
        }
      }}
     >
        {()=><Stack.Navigator >
     <Stack.Screen name={"Classement"} options={{ headerShown: false }}>
       {(props)=><Classement {...props} route={route} user={user} />}
     </Stack.Screen>
     </Stack.Navigator>
      }
     </Tab.Screen>
     <Tab.Screen
      name={"bottomNavGroupeSettings"}
      options={{
        tabBarLabel: "Paramètres",
        tabBarIcon: ({ color }) => (<SettingIcon name="gear" color={color} size={25} />),
        tabBarLabelStyle: {
          fontSize: 10,
        }
      }}
     >
        {()=><Stack.Navigator >
     <Stack.Screen name={"GroupeSettings"} options={{ headerShown: false }}>
       {(props)=><GroupeSettings {...props} route={route} user={user}/>}
     </Stack.Screen>
     </Stack.Navigator>
      }
     </Tab.Screen>
  </Tab.Navigator>
  )
}

export default MyTopTabs