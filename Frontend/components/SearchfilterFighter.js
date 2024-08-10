import { StyleSheet, Text, View, FlatList,TouchableOpacity } from "react-native";
import React from "react";

const SearchFilterFighter = ({data, input, setInput}) => {
    console.log("input:", input);
    return (
        <View>
            <FlatList data={data} renderItem={({item}) => {
                if(input != "" && item.nom_combattant.toLowerCase().includes(input.toLowerCase())){
                    console.log("itemp.pseudo",item.nom_combattant);
                    return (
                        <View>
                            <TouchableOpacity style={{marginVertical: 5,paddingHorizontal: 10, borderRadius: 5 }} onPress={() => setInput(item.nom_combattant)}>                            
                            <Text style={{fontSize:14,fontWeight:"bold"}}>{item.nom_combattant}</Text>
                            <Text style={{borderColor: "gray", borderWidth:1,height:1,marginTop:5}}/>
                            </TouchableOpacity>
                        </View>
                    )
                }
            }}>

            </FlatList>
        </View>
    )
}

export default SearchFilterFighter;