import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Text,Image,TextInput } from "react-native";
import SearchFilterFighter from "./SearchfilterFighter";
import Detail from "./CombattantDetail";
import allFightersFile from "../allFighters.json";

const SearchFighter = ({ navigation, route, user }) => {
  const [searchedFighter, setSearchedFighter] = useState("");
  const [allFighters, setAllFighters] = useState(allFightersFile);
  const UfcSilhouetteRightStance =
    "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-right-silhouette.png";


  useEffect(() => {
    searchFunction(searchedFighter)
  },[searchedFighter]);

  const searchFunction = (input) => {
     console.log(input)
    setAllFighters(allFightersFile.filter((item) => item.nom_combattant.toLowerCase().includes(input.toLowerCase())))
  };


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
      <TextInput style={styles.input} placeholder="Nom du combatant" value={searchedFighter} onChangeText={setSearchedFighter}/>
      {/* <SearchFilterFighter
        data={allFightersFile}
        input={searchedFighter}
        setInput={setSearchedFighter}
      /> */}
      </View>

      <FlatList
        data={allFighters}
        keyExtractor={(item,index) => index}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("CombattantDetail", { item })}>
            <View style={styles.itemContainer}>
              {item.image_path && item.image_path !== "/themes/custom/ufc/assets/img/no-profile-image.png" ?(
              <Image source={{ uri: item.image_path }} style={styles.image}  resizeMode="contain"/>
            ):(
              <Image source={{ uri: UfcSilhouetteRightStance }} style={styles.image}  resizeMode="contain"/>
            )}
              <Text style={styles.list}>{item.nom_combattant}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchFighter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -30,
    paddingTop: 5,
    height: "100%",
    backgroundColor: "white",
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
  pseudo: {
    color: "black",
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  list: {
    fontSize: 18,
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});