import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import { Game, Team, TeamHistoryGame } from "../api/responses";
import { useEffect, useState } from "react";
import useFetch from "../../../core/hooks/useFetch";
type ParamsType = {
  gameSelected: Team | undefined;
  onSubmit: (v1: number, v2: number) => Promise<void>
  setPrediction: (val:string)=>void;
  prediction:string
};
export const ExtraInfo = ({ gameSelected, onSubmit, prediction, setPrediction }: ParamsType) => {
  useEffect(() => {
    const handleLoad = async()=>{
     setPrediction("")
    }
    handleLoad()
   }, [gameSelected]);

    const renderRow = ({ item }: { item: TeamHistoryGame }) => (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.firstTeam.name}</Text>
          <Text style={styles.cell}>{item.secondTeam.name}</Text>
          <Text style={styles.cell}>{item.goalsFirstTeam}</Text>
          <Text style={styles.cell}>{item.goalsSecondTeam}</Text>
        </View>
      );

  return (
    <View>
      <Image
        style={styles.logoTeam}
        source={{ uri: gameSelected?.logo }}
      />

      <View>
        <Text style={styles.text}>Jugadores</Text>
        <View>
          {gameSelected?.players.map((v) => (
            <Text style={styles.text}>
              {v.name} {v.lastName}
            </Text>
          ))}
        </View>
      </View>

      <View>
        <Text style={{color:"#fff"}}>{prediction == "" ? "Cargando..." : prediction}</Text>
      </View>

      <View>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.headerText]}>Local</Text>
          <Text style={[styles.cell, styles.headerText]}>Visitante</Text>
          <Text style={[styles.cell, styles.headerText]}>
            Goles del primer equipo
          </Text>
          <Text style={[styles.cell, styles.headerText]}>
            Goles del segundo equipo
          </Text>
        </View>
        <FlatList
          data={gameSelected?.history}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
          style={styles.table}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  logoTeam: {
    width: 40,
    height: 40,
  },
  text: {
    color: "#fff",
  },
  table: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 10,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 2,
    borderBottomColor: '#555',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
  },
});
