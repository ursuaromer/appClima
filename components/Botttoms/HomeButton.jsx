import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";


const HomeButton = ({title,route,ci}) => {
  const router = useRouter();

  const handlePress = () => {
    // Navega a la pantalla Home y pasa la ciudad como parámetro
    router.push({
      pathname: route,
      params: { ci },
    });
    
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeButton;