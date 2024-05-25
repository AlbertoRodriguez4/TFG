import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VeDatosSalas = ({ route }) => {
  const [datos, setDatos] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isUserInRoom, setIsUserInRoom] = useState(false);
  const [idUsuariosSala, setIdUsuariosSala] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        loadUserData();

        const { salaId } = route.params;

        const juegosResponse = await fetch(`http://192.168.1.90:3000/salas/${salaId}/juegos`);
        const juegosData = await juegosResponse.json();

        const usuariosResponse = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios`);
        const usuariosData = await usuariosResponse.json();
        const userIds = usuariosData.map(user => user.id);
        setIdUsuariosSala(userIds);

        const mergedData = [...juegosData, ...usuariosData];
        setDatos(mergedData);

        const userEmail = await AsyncStorage.getItem('userEmail');
        const isUserInRoom = usuariosData.some(user => user.email === userEmail);
        setIsUserInRoom(isUserInRoom);

        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (userIds.includes(parsedUserData.id)) {
            setIsLoading(false);
            setValor(1);
          } else {
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
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUserData(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const handleJoinParty = async () => {
    try {
      const { salaId } = route.params;
      const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios/${userData.id}`, {
        method: 'POST',
      });
      if (response.ok) {
        Alert.alert('Éxito', 'Te has unido a la fiesta correctamente');
        setIsUserInRoom(true);
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

      <Text style={styles.sectionTitle}>Usuarios</Text>
      <FlatList
        data={usuarios}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.urlImagen && <Image source={{ uri: item.urlImagen }} style={styles.image} />}
            <Text>Nombre: {item.nome}</Text>
            <Text>Descripción Personal: {item.descripcionPersonal}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {valor === 0 && (
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
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});
  
  export default VeDatosSalas;
  