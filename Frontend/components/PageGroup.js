import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const PageGroup = ({route}) => {
    // const {group} = route.params;
    const { group: selectedGroup } = route.params;
  return (
//     <View>
//     {groupData.map((group) => (
//           <View key={group.id} style={styles.group}>
//             <Text style={styles.text}>{group.name}</Text>
//             <FlatList
//               data={group.members}
//               renderItem={({ item }) => (
//                 <View style={styles.memberContainer}>
//                   <Text>{item.name}</Text>
//                   <Text>Score: {item.score}</Text>
//                 </View>
//               )}
//               keyExtractor={(item) => item.id.toString()}
//             />
//           </View>
//           ))} 
//   {/* <Text>Score: </Text> */}

//     </View>
<View>
      {selectedGroup && (
        <View key={selectedGroup.id} style={styles.group}>
          <Text style={styles.text}>{selectedGroup.name}</Text>
          <FlatList
            data={selectedGroup.members}
            renderItem={({ item }) => (
              <View style={styles.memberContainer}>
                <Text>{item.name}</Text>
                <Text>Score: {item.score}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
    </View>
  )
//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         {groupData.map((group) => (
//           <View key={group.id} style={styles.group}>
//             <Text style={styles.text}>{group.name}</Text>
//             <FlatList
//               data={group.members}
//               renderItem={({ item }) => (
//                 <View style={styles.memberContainer}>
//                   <Text>{item.name}</Text>
//                   <Text>Score: {item.score}</Text>
//                 </View>
//               )}
//               keyExtractor={(item) => item.id.toString()}
//             />
//           </View>
//         ))}

//         <View style={styles.newMemberContainer}>
//           <View style={styles.newGroupContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Nom de groupe"
//               placeholderTextColor="red"
//               value={newGroupName}
//               onChangeText={(text) => setNewGroupName(text)}
//             />

         
//           </View>

//           <TouchableOpacity style={styles.Button} onPress={createNewGroup}>
//             <Text style={styles.buttonText}>Nouveau Groupe</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.Button} onPress={deleteGroup}>
//             <Text style={styles.buttonText}>Supprimer le groupe</Text>
//           </TouchableOpacity>

//           <TextInput
//             style={styles.input}
//             placeholder="Nouveau membre"
//             placeholderTextColor="red"
//             value={newMemberName}
//             onChangeText={(text) => setNewMemberName(text)}
//           />
//           <TouchableOpacity style={styles.Button} onPress={addMember}>
//             <Text style={styles.buttonText}>Ajouter</Text>
//           </TouchableOpacity>

//           <View style={styles.inviteContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Nom de l'invité"
//               placeholderTextColor="red"
//               value={inviteeName}
//               onChangeText={(text) => setInviteeName(text)}
//             />
//             <TouchableOpacity style={styles.Button} onPress={inviteMember}>
//               <Text style={styles.buttonText}>Inviter</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.Button} onPress={rankMembers}>
//               <Text style={styles.buttonText}>Classer les membres</Text>
//             </TouchableOpacity>
//             {/* <TouchableOpacity onPress={() => handleAddScore(1, 3)}>
//         <Text>Ajouter 3 points à MemberA</Text>
//       </TouchableOpacity> */}
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );

  
}

export default PageGroup

// const styles = StyleSheet.create({
//     memberContainer: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       paddingVertical: 5,
//     },
//     container: {
//       // flex: 1,
//       // justifyContent: 'center',
//       // alignItems: 'center',
//       backgroundColor: "black",
//       top:100,
  
//       // height:750
//     },
//     group: {
//       marginBottom: 20,
//       padding: 10,
//       backgroundColor: "red",
//       borderRadius: 10,
//       shadowColor: "white",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.3,
//       shadowRadius: 4,
//       elevation: 5,
//       color: "red",
      
//     },
//     text: {
//       fontSize: 20,
//       fontWeight: "bold",
//       marginBottom: 10,
//       color: "white",
//     },
//     newMemberContainer: {
//       marginTop: 50,
//       flexDirection: "colomn",
//       //   alignItems: 'center',
//     },
//     newGroupContainer: {
//       marginTop: 20,
//       flexDirection: "row",
//       alignItems: "center",
//     },
//     input: {
//       flex: 1,
//       height: 40,
//       textAlign: "center",
//       borderWidth: 1,
//       borderColor: "#ccc",
//       borderRadius: 5,
//       marginRight: 10,
//       paddingLeft: 10,
//       width: "100%",
//       color: "white",
//       fontSize: 20,
//     },
//     Button: {
//       backgroundColor: "red",
//       padding: 10,
//       borderRadius: 5,
//       marginTop: 10,
//       marginBottom: 20,
//     },
//     buttonText: {
//       color: "white",
//       fontWeight: "bold",
//       textAlign: "center",
//     },
//   });