import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { IP } from '@env';
import TrophyIcon from "react-native-vector-icons/EvilIcons";


const Classement = ({ route, user }) => {
  const [ranking, setRanking] = useState([]);
  const groupId = route.params.ID;
  const userId = user.user.Firstname;
  // console.log("test ip 3", IP);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await fetch(`http://${IP}:3001/bet/betOfGroup/${groupId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const json = await response.json();
        const bets = json.message.Bets.map((el) => {
          return el
        });
        // Calculer les points pour chaque utilisateur
        const userPoints = bets.reduce((acc, bet) => {
          const { UserID, PointPerBet } = bet;
          if (!acc[UserID]) {
            acc[UserID] = 0;
          }
          acc[UserID] += PointPerBet;
          return acc;
        }, {});
        // Convertir en tableau et trier par points
        const rankingArray = Object.keys(userPoints).map(userId => ({
          userId,
          points: userPoints[userId],
        })).sort((a, b) => b.points - a.points);

        setRanking(rankingArray);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchBets();
  }, [groupId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classement</Text>
      <View style={styles.rankBox}>
      {ranking.map((user, index) => (
        <View style={styles.rankChildBox}key={index}>
          <Text style={styles.index} >
            {index + 1}
          </Text>
          <Text style={styles.user}>
            {userId}
          </Text>
          <Text style={styles.point}>
            <TrophyIcon name="trophy" size={15}/> {user.points}
          </Text>
        </View>
      ))}
      </View>
    </View>
  );
};

export default Classement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "black",
    height: "90%"
  },
  title:{
    textAlign: "center",
    justifyContent:"center",
    color: "white",    
    height: 38,
    fontSize: 30,
    marginBottom: 10,
    width: "45%",
    overflow: "hidden",
    borderRadius: 15,
  },
  rankBox:{
    alignItems:'center',
    width: '90%',
    height:'90%',
    backgroundColor: 'red',
    overflow: "hidden",
    borderRadius: 15,
  },
  rankChildBox:{
    top: 10,
    color:"black",
    width:'95%',
    height:'4%',
    alignItems:'center',
    backgroundColor:"white",
    overflow: "hidden",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  index:{
    marginLeft: 5
  },
  user:{
    marginRight: 100
  },
  point:{
    marginRight: 10
  }
});