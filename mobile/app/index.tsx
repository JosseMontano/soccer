import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

const index = () => {
  const redirection = ()=>{
    // redireccionar a otra pantalla
    router.push("./mainpage")
  }
  return (
    <View>
      <Pressable onPress={()=>redirection()}>
        <Text>hola mundo</Text>
      </Pressable>
    </View>
  );
};

export default index;
