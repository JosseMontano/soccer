import { StyleSheet, Text, View, Modal, Pressable } from "react-native";

type ParamsType = {
  visible: boolean;
  setVisible: (val: boolean) => void;
  children: JSX.Element;
  title:string
};

export const ModalComp = ({ setVisible, visible, children, title }: ParamsType) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}
    >
      <View
        style={[
          styles.centeredView,
          visible && { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        ]}
      >
        {/* Background Pressable */}
        <Pressable
          style={styles.fullScreenPressable}
          onPress={() => setVisible(false)} // Close modal when background is clicked
        />
        {/* Modal Content */}
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{title}</Text>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenPressable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    width:"80%",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10, // Ensure modal is above the background
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
  },
});
