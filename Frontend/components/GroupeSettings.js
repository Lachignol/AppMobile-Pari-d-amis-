import React, { useEffect, useState } from "react";
import { SERVEUR } from '@env';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import SearchFilterUser from './Searchfilteruser';
import Icon from 'react-native-vector-icons/FontAwesome';



const GroupeSettings = ({ navigation,route, user }) => {
  const creatorIdOfGroup = route.params.CreatorId;
  const userId = user.user.ID;
  const group = route.params;
  const groupId = route.params.ID;
  const [groups, setGroups] = useState([]);
  const [searchedMember, setSearchedMember] = useState("");
  const [inviteeName, setInviteeName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [usersOfOneGroup, setUsersOfOneGroup] = useState([]);

  const isItCreator = userId == creatorIdOfGroup;
  // console.log("test creator", group.CreatorId);

  // console.log("Creator ???",isItCreator);
  // console.log("creator id", creatorIdOfGroup);
  // console.log("userid", userId);
  // console.log(group);

  useEffect(() => {
    const fetchUsersOfGroup = () =>{
      fetch(`${SERVEUR}/group/usersOfOneGroup/${groupId}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(response => response.json())
      .then(json => setUsersOfOneGroup(json.message.users))
    } 
    const fetchAllUsers = () => {
      fetch(`${SERVEUR}/user/allUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(response => response.json())
      .then(json => setAllUsers(json.message));
    };
    fetchUsersOfGroup()
    fetchAllUsers();
  },[]);


  const filteredUsers = allUsers.filter(
    (user) => !usersOfOneGroup.some((groupUser) => groupUser.ID === user.ID)
  );

  const searchMember = () => {
    const foundUser = filteredUsers.find((user) => user.Pseudo.toLowerCase() === searchedMember.toLowerCase());
    if (foundUser) {
      inviteMember(foundUser.ID);
      setUsersOfOneGroup((previous) => [...previous, foundUser]);
      setSearchedMember("");
    } else {
      Alert.alert("Utilisateur non trouvé");
    }
  };

  const inviteMember = async (userToAddId) => {
    try {
      const response = await fetch(
        `${SERVEUR}/group/addUserToGroupByCreatorId/${groupId}/${userToAddId}/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'invitation du membre (statut ${response.status})`
        );
      }
      if(response.status === 200){
        Alert.alert("User bien ajouté au groupe");
      }
      setInviteeName("");
      setSearchedMember("");
    } catch (error) {
      console.error("Erreur lors de l'invitation du membre", error);
    }
  };

  const deleteGroup = () => {
      const userResponse = Alert.alert("Avertissement", "Voulez vous vraiment supprimer ce groupe ?",[
        {
          text: 'not ok',
          onPress: () => {
            Alert.alert("Suppression de groupe annulé");
          },
        },
        {
          text: 'ok',
          onPress: async () => {
            try {
              console.log("alert ",userResponse);
              console.log("id du groupe qu'on supprime", groupId);
              const response = await fetch(`${SERVEUR}/group/deleteOneGroup/${groupId}/${userId}`,{
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
              }
              );
              if(response.status === 200){
              Alert.alert("Groupe supprimé")
              navigation.navigate("Groupes");
              }
            } catch (error) {
              console.error("Erreur lors de la suppression du groupe", error);
            }
          }
        },
      ],
    )
  };

  const deleteUserOfGroup = async (userToDelete) => {
      const userResponse = Alert.alert("Avertissement", "Voulez vous vraiment supprimer cet utilisateur du groupe ?",[
        {
          text: 'not ok',
          onPress: () => {
            Alert.alert("Suppression de l'utilisateur annulé");
          },
        },
        {
          text: 'ok',
          onPress: async () => {
            try {
              const response = await fetch(`${SERVEUR}/group/deleteUserOfGroupByCreatorId/${groupId}/${userToDelete.ID}/${userId}`,{
                method:"DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              })
              if(response.ok){
                const result = await response.json()
                console.log("message si la requête s'est bien effectué", result.message);
                setUsersOfOneGroup(usersOfOneGroup.filter(userofgroup => userofgroup.ID != userToDelete.ID));
                Alert.alert("Utilisateur supprimé du groupe")
              }else{
                const error = await response.json();
                console.error("erreur lors de la requête", error)
                Alert.alert("Erreur lors de la suppression de l'utilisateur")
              }
            } catch (error) {
              console.error("Erreur lors de la suppression de l'utilisateur", error)
            }
          },
        },
      ])
  }

  return (
    <View style={styles.container}>
    {isItCreator && (
      <View style={styles.searchContainer}>
        <Button title="Supprimer le groupe" onPress={() => deleteGroup(group.ID)} />
        <Text style={styles.firstTitle}>
          Nom du groupe : {group.Name}
        </Text>
        <Text style={styles.secondTitle}>
          Rechercher un membre et l'inviter :
        </Text>
        <TextInput style={styles.input} placeholder="Pseudo du membre à ajouté" value={searchedMember} onChangeText={setSearchedMember}/>
        <SearchFilterUser data={filteredUsers} input={searchedMember} setInput={setSearchedMember}/>
        <TouchableOpacity style={styles.inviteButton} onPress={() => searchMember()}>
          <Text style={styles.inviteButtonText}>Inviter le membre</Text>
        </TouchableOpacity>
  
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <View>
              <FlatList
                data={item.Users}
                keyExtractor={(user) => user.id.toString()}
                renderItem={({ item: user }) => (
                  <View>
                    <Text style={styles.list}>{user.Pseudo}</Text>
                  </View>
                )}
              />
            </View>
          )}
        />

      </View>
)}
<View style={styles.secondContainer}>
  {
    <FlatList
      data={usersOfOneGroup}
      keyExtractor={(user) => user.ID.toString()}
      renderItem={({item: user}) => (
        userId != user.ID &&(
          <View style={styles.userRow}>
            <Text style={styles.pseudo}>
              {user.Pseudo}
              {user.ID == group.CreatorId &&(
              `(Admin du groupe)`
              )} 
            </Text>
            {isItCreator && (
            <TouchableOpacity style={styles.button}
            onPress={() => deleteUserOfGroup(user)}
            >
              <Icon
              name="close"
              color="red"
              background="none"
              size={15}
              borderRadius={20}
              />
            </TouchableOpacity>
            )}
          </View>
        )
      )}
      />
    }
    </View>
  </View> 
  );
};

export default GroupeSettings;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -30,
    paddingTop: 5,
    height: "100%",
    backgroundColor:"white",
  },
  secondContainer:{
    marginTop: 70,  
  },
  firstTitle:{
    fontSize: 22,
    color: "black",
    fontWeight: 'bold',
  },
  secondTitle:{
    fontSize:18,
    color: "black",
  },
  searchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    height: "10%",
  },
  input: {
    fontSize: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '80%',
    textAlign: 'center',
  },
  inviteButton: {
    marginTop: 0,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 15,
  },
  inviteButtonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pseudo:{
    color:"black",
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  }
});
