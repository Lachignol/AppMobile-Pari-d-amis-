import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MaterialIcons} from "@expo/vector-icons"
import Home from "../components/Home"
import Bet from "../components/Bet"
import Search from "../components/Search"
import GroupeList from "../components/GroupeList"
import Account from "../components/Account"

const MyTabs = ({setUser, user}) => {
    const Tab = createBottomTabNavigator()
    const Stack = createNativeStackNavigator()
  return (
    <Tab.Navigator
    initialRouteName={"Accueil"}
    screenOptions={{
      title: null,
      headerShown: false,
      tabBarActiveTintColor: "#fa580a",
      tabBarActiveBackgroundColor: "black",
      tabBarInactiveBackgroundColor: "black",
      tabBarInactiveTintColor: "white",
      tabBarStyle: { backgroundColor: 'black',borderTopWidth: 0 }
    }}
    >
        <Tab.Screen
      name={"bottomNavAccueil"}
      options={{
        tabBarLabel: "Accueil",
        tabBarIcon: ({ color, size }) => (<MaterialIcons name="home" color={color} size={size} />)
      }}
     >
        {()=><Stack.Navigator >
     <Stack.Screen name={"Accueil"} options={{ headerShown: false }}>
       {(props)=><Home {...props} />}
     </Stack.Screen>
     </Stack.Navigator>
      }
     </Tab.Screen>

        <Tab.Screen
      name={"bottomNavExplorer"}
      options={{
        tabBarLabel: "Explorer",
        tabBarIcon: ({ color, size }) => (<MaterialIcons name="search" color={color} size={size} />)
      }}
     >
        {()=><Stack.Navigator >
     <Stack.Screen name={"Explorer"} options={{ headerShown: false }}>
       {(props)=><Search {...props} />}
     </Stack.Screen>
     </Stack.Navigator>
      }
     </Tab.Screen>
        <Tab.Screen
      name={"bottomNavGroup"}
      options={{
        tabBarLabel: "Groupe(s)",
        tabBarIcon: ({ color, size }) => (<MaterialIcons name="group" color={color} size={size} />)
      }}
     >
        {()=><Stack.Navigator >
     <Stack.Screen name={"Groupes"} options={{ headerShown: false }}>
       {(props)=><GroupeList {...props} user={user} />}
     </Stack.Screen>
     </Stack.Navigator>
      }
     </Tab.Screen>
        <Tab.Screen
      name={"bottomNavSettings"}
      options={{
        tabBarLabel: "Account",
        tabBarIcon: ({ color, size }) => (<MaterialIcons name="account-circle" color={color} size={size} />)
      }}
     >
        {()=><Stack.Navigator >
     <Stack.Screen name={"Compte"} options={{ headerShown: false }}>
       {(props)=><Account {...props} setUser={setUser} user={user}/>}
     </Stack.Screen>
     </Stack.Navigator>
      }
     </Tab.Screen>
    </Tab.Navigator>
  )
}

export default MyTabs