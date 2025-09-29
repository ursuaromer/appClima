import { StyleSheet } from "react-native";

const styl = StyleSheet.create({
  bottomBar: {
    position: "absolute",   // 👈 Se fija al fondo
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,     // 👈 Reducido
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    height: 60,             // 👈 Altura fija (ajustable)
  },
  button: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 8,     // 👈 Más compacto
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default styl;
