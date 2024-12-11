import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    Easing,
  } from "react-native";
  import {
    primaryColor,
    secondaryColor,
    tertiaryColor,
  } from "../../core/constant/color";
  import { Header } from "./components/header";
  import { useState, useRef } from "react";
import useFetch from "../../core/hooks/useFetch";
  
  type Game = {
    id: string;
    firstTeam: string;
    secondTeam: string;
  };
  
  const games: Game[] = [
    { id: "1", firstTeam: "Team A", secondTeam: "Team B" },
    { id: "2", firstTeam: "Team C", secondTeam: "Team D" },
    { id: "3", firstTeam: "Team E", secondTeam: "Team F" },
  ];
  
  export const Home = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const animatedHeight = useRef(new Animated.Value(0)).current;

    const { fetchData } = useFetch();
    const { data: clubs } = fetchData("GET /clubs");
    console.log(clubs);
  
    const toggleCollapse = () => {
      if (isCollapsed) {
        // Expand animation
        Animated.timing(animatedHeight, {
          toValue: 150, // Set desired expanded height
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }).start();
      } else {
        // Collapse animation
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }).start();
      }
      setIsCollapsed(!isCollapsed);
    };
  
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.containerHeader}>
          <Text style={styles.title}>Torneos</Text>
          <Text style={styles.title}>22-10-14</Text>
        </View>
  
        <View style={styles.containerTable}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>Campeonato1</Text>
            <TouchableOpacity onPress={toggleCollapse}>
              <Text style={styles.collapseText}>
                {isCollapsed ? "^" : "hide"}
              </Text>
            </TouchableOpacity>
          </View>
  
          {/* Animated Collapsible Section */}
          <Animated.View style={[styles.table, { height: animatedHeight }]}>
            <Text style={styles.titleTable}>Partidos</Text>
            {games.map((game) => (
              <View key={game.id} style={styles.gameRow}>
                <Text style={styles.gameText}>
                  {game.firstTeam} vs {game.secondTeam}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: secondaryColor,
      gap: 10,
    },
    containerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 12,
    },
    title: {
      color: "#fff",
      fontWeight: "500",
      fontSize: 18,
    },
    collapseText: {
      color: primaryColor,
      fontSize: 16,
      fontWeight: "500",
    },
    containerTable: {
      backgroundColor: tertiaryColor,
      marginHorizontal: 12,
      borderRadius: 6,
      padding: 10,
      flexDirection: "column",
      gap: 10,
    },
    table: {
      overflow: "hidden", // Ensures the content hides during animation
    },
    infoContainer: {
      paddingHorizontal: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    titleTable: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
    },
    gameRow: {
      flexDirection: "row",
      justifyContent: "center",
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(155, 155, 155,.3)",
    },
    gameText: {
      color: "#fff",
      fontSize: 14,
    },
  });
  