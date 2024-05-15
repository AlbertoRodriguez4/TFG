import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const VeDatosSalas = ({ route }) => {
  const [datos, setDatos] = useState([]);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [isUserInRoom, setIsUserInRoom] = useState(false); // Estado para verificar si el usuario está en la sala
  const [idUsuariosSala, setIdUsuariosSala] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [valor, setValor] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        loadUserData();
  
        const { salaId } = route.params; // Obtener el ID de la sala del parámetro de ruta
  
        // Obtener juegos de la sala
        const juegosResponse = await fetch(`http://192.168.1.90:3000/salas/${salaId}/juegos`);
        const juegosData = await juegosResponse.json();
  
        // Obtener usuarios de la sala
        const usuariosResponse = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios`);
        const usuariosData = await usuariosResponse.json();
        const userIds = usuariosData.map(user => user.id);
        setIdUsuariosSala(userIds);
        // Fusionar juegos y usuarios en una sola lista
        const mergedData = [...juegosData, ...usuariosData];
  
        setDatos(mergedData);
  
        // Verificar si el usuario está presente en la sala
        const userEmail = await AsyncStorage.getItem('userEmail');
        const isUserInRoom = usuariosData.some(user => user.email === userEmail);
        setIsUserInRoom(isUserInRoom);
  
        // Verificar si el usuario está en la sala
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (userIds.includes(parsedUserData.id)) {
            setIsLoading(false);
            console.log("Estoy en la sala");
            setValor(1);
          } else {
            console.log("No estoy en la sala");
            setValor(0);
          }
        }
      } catch (error) {
        console.error('Error al cargar los datos de la sala:', error);
      }
    };
  
    fetchData();
  }, [route.params]);
  
  
  
  const loadUserData = async () => {
    try {
      // Obtener los datos del usuario guardados en AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        // Si hay datos del usuario, actualizar los estados locales
        setUserData(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const handleJoinParty = async () => {
    try {
      const { salaId } = route.params; // Obtener el ID de la sala del parámetro de ruta
      const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios/${userData.id}`, { //insertar usuario en la sala
        method: 'POST',
      });
      if (response.ok) {
        Alert.alert('Éxito', 'Te has unido a la fiesta correctamente');
        setIsUserInRoom(true); // Actualizar el estado para indicar que el usuario está en la sala
      } else {
        throw new Error('Error al unirse a la fiesta');
      }
    } catch (error) {
      console.error('Error al unirse a la fiesta:', error);
    }
  };


  const juegos = datos.filter(item => item.nombre);
  const usuarios = datos.filter(item => item.nome);

  return (
    <View style={styles.container}>
      {/* Sección de juegos */}
      <Text style={styles.sectionTitle}>Juegos</Text>
      <FlatList
        data={juegos}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Nombre: {item.nombre}</Text>
            <Text>Propiedad del Juego: {item.propiedadJuego}</Text>
            <Text>Descripción del Juego: {item.descripcionJuego}</Text>
            <Text>Categoría del Juego: {item.categoriaJuego}</Text>
            <Text>Normas del Juego: {item.normasJuego}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Sección de usuarios */}
      <Text style={styles.sectionTitle}>Usuarios</Text>
      <FlatList
        data={usuarios}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Nombre: {item.nome}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Plan: {item.plan}</Text>
            <Text>Descripción Personal: {item.descripcionPersonal}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Mostrar el botón solo si el usuario no está en la fiesta y si hay datos del usuario */}
      {valor === 0  && (
      <Button title="Unirse a la fiesta" onPress={handleJoinParty} />
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default VeDatosSalas;



