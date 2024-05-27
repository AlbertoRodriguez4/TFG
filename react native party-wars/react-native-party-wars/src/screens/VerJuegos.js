import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ViewGamesScreen = ({ route }) => {
  const navigation = useNavigation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaId, setSalaId] = useState(null);

  useEffect(() => {
    const { idNavigationJuegos } = route.params;
    console.log("El id de la sala en la pantalla de ver juegos es " + idNavigationJuegos);
    setSalaId(idNavigationJuegos); // Asignar el ID de la sala al estado
    fetchGames(idNavigationJuegos); // Llamar a fetchGames con el ID de la sala
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
      console.log()
    } catch (error) {
      console.error('Error al agregar el juego:', error);
      Alert.alert('Error', 'Ocurrió un error al agregar el juego. Por favor, inténtalo de nuevo.');
    }
  };

  const renderGameItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleAddGame(item.id)} style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/izquierda.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partida Privada</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/hogar.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCrearSala}>
        <Text style={styles.createButtonText}>Crear Sala</Text>
      </TouchableOpacity>
      <Text style={styles.createOwnText}>
        ¿No ves ningún juego que te convenza? <Text style={styles.createOwnLink} onPress={handleCrearJuego}>¡Crea el tuyo!</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#000000',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createOwnText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  createOwnLink: {
    color: 'blue',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewGamesScreen;
