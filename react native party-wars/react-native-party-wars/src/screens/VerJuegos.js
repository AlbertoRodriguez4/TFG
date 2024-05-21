import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ViewGamesScreen = ({ route }) => {
  const navigation = useNavigation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaId, setSalaId] = useState(null);

  useEffect(() => {
    if (route.params && route.params.idNavigationJuegos) {
      const { idNavigationJuegos } = route.params;
      console.log("El id de la sala es " + idNavigationJuegos);
      setSalaId(idNavigationJuegos); // Asignar el ID de la sala al estado
      fetchGames(idNavigationJuegos); // Llamar a fetchGames con el ID de la sala
    }
  }, [route.params]);

  const fetchGames = async (idSala) => {
    try {
      console.log(idSala);
      const response = await fetch(`http://192.168.1.90:3000/juegos`);
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener juegos:', error);
      setLoading(false);
    }
  };

  const handleCrearJuego = () => {
    navigation.navigate('CrearJuego', { idNavigationJuegos: salaId });
  };

  const handleCrearSala = () => {
    Alert.alert('Sala Creada', 'Sala creada correctamente', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Main'),
      }
    ]);
  };

  const handleAddGame = async (juegoId) => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/salas/${salaId}/juegos/${juegoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al agregar el juego');
      }

      setGames(prevGames => prevGames.filter(game => game.id !== juegoId));
      Alert.alert('Juego Agregado', 'El juego se ha agregado correctamente');
    } catch (error) {
      console.error('Error al agregar el juego:', error);
      Alert.alert('Error', 'Ocurrió un error al agregar el juego. Por favor, inténtalo de nuevo.');
    }
  };

  const renderGameItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View>
        <Text style={{ fontWeight: 'bold' }}>{item.nombre}</Text>
        <Text>Propiedad: {item.propiedadJuego}</Text>
        <Text>Descripción: {item.descripcionJuego}</Text>
        <Text>Categoría: {item.categoriaJuego}</Text>
        <Text>Normas: {item.normasJuego}</Text>
      </View>
      <TouchableOpacity onPress={() => handleAddGame(item.id)}>
        <Text style={{ color: 'blue' }}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Lista de Juegos</Text>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Crear Sala" onPress={handleCrearSala} />
      <Text style={{ marginVertical: 10 }}>¿No ves ningún juego que te convenza? <Text style={{ color: 'blue' }} onPress={handleCrearJuego}>¡Crea el tuyo!</Text></Text>
    </View>
  );
};

export default ViewGamesScreen;
