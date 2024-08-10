import { StyleSheet, Text, View, FlatList,TouchableOpacity } from "react-native";
import React from "react";

const SearchFilterUser = ({data, input, setInput}) => {
    console.log("input:", input);
    return (
        <View>
            <FlatList data={data} renderItem={({item}) => {
                if(input != "" && item.Pseudo.toLowerCase().includes(input.toLowerCase())){
                    console.log("itemp.pseudo",item.Pseudo);
                    return (
                        <View>
                            <TouchableOpacity style={{marginVertical: 5,paddingHorizontal: 10, borderRadius: 5 }} onPress={() => setInput(item.Pseudo)}>                            
                            <Text style={{fontSize:14,fontWeight:"bold"}}>{item.Pseudo}</Text>
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

export default SearchFilterUser;