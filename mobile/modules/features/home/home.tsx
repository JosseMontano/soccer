import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Image,
  Pressable,
} from "react-native";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
} from "../../core/constant/color";
import { Header } from "./components/header";
import { useState, useRef } from "react";
import useFetch from "../../core/hooks/useFetch";
import { ModalComp } from "../../core/components/modal";
import { Game, Tournament } from "./api/responses";
import { ExtraInfo } from "./components/extraInfo";

export const Home = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const { fetchData } = useFetch();
  const { data: tournament } = fetchData("GET /tournaments/tournamentsPublic");
  console.log(tournament);

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<"firstTeam" | "secondTeam">(
    "firstTeam"
  );

  const [gameSelected, setGameSelected] = useState<Game>({} as Game);
  const selectTeam = (v: Game, team: "firstTeam" | "secondTeam") => {
    setIsOpen(true);
    setSelectedTeam(team);
    setGameSelected(v);
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.containerHeader}>
        <Text style={styles.title}>Torneos</Text>
        <Text style={styles.title}>22-10-14</Text>
      </View>

      {tournament?.map((v) => (
        <View style={styles.containerTable} key={v.id}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{v.name}</Text>
            <TouchableOpacity onPress={toggleCollapse}>
              <Text style={styles.collapseText}>
                {isCollapsed ? "Abrir" : "Cerrar"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Animated Collapsible Section */}
          <Animated.View style={[styles.table, { height: animatedHeight }]}>
            <Text style={styles.titleTable}>Partidos</Text>
            {v.games.map((game) => (
              <View key={game.id} style={styles.gameRow}>
                <Image
                  style={styles.logoTeam}
                  source={{ uri: game.firstTeam.logo }}
                />

                <Text
                  style={styles.gameText}
                  onPress={() => selectTeam(game, "firstTeam")}
                >
                  {game.firstTeam.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 9,
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.gameText}>{game.goalsFirstTeam}</Text>
                  <Text
                    style={[
                      styles.gameText,
                      {
                        backgroundColor: secondaryColor,
                        padding: 6,
                        borderRadius: 50,
                      },
                    ]}
                  >
                    vs
                  </Text>
                  <Text style={styles.gameText}>{game.goalsSecondTeam}</Text>
                </View>
                <Text
                  style={styles.gameText}
                  onPress={() => selectTeam(game, "secondTeam")}
                >
                  {game.secondTeam.name}
                </Text>
                <Image
                  style={styles.logoTeam}
                  source={{ uri: game.secondTeam.logo }}
                />
              </View>
            ))}
          </Animated.View>
        </View>
      ))}

      <ModalComp
        setVisible={setIsOpen}
        visible={isOpen}
        title="Informacion del equipo"
        children={<ExtraInfo gameSelected={gameSelected[selectedTeam]} />}
      />
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
    gap: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(155, 155, 155,.3)",
  },
  logoTeam: {
    width: 40,
    height: 40,
  },
  gameText: {
    color: "#fff",
    fontSize: 14,
  },
});
