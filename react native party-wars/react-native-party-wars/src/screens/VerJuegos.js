import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const ViewGamesScreen = ({ route }) => {
  const navigation = useNavigation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaId, setSalaId] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);

  const images = [
    require('../assets/MonoArray1.jpg'),
    require('../assets/MonoArray2.jpg'),
    require('../assets/MonoArray3.jpg'),
    require('../assets/MonoArray4.jpg'),
    require('../assets/MonoArray5.jpg'),
    require('../assets/MonoArray6.jpg'),
  ];

  useEffect(() => {
    const { idNavigationJuegos } = route.params;
    setSalaId(idNavigationJuegos);
    fetchGames(idNavigationJuegos);
    loadUserData();
  }, [route.params]);

  useEffect(() => {
    if (categoria) {
      fetchGames(salaId, categoria);
    }
  }, [categoria]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        setUsuarioId(id);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const fetchGames = async (idSala, categoriaJuego = '') => {
    try {
      const url = categoriaJuego
        ? `http://192.168.1.90:3000/juegos/${categoriaJuego}/categoria`
        : `http://192.168.1.90:3000/juegos`;

      const response = await fetch(url);
      const data = await response.json();

      const gamesWithImages = data.map(game => ({
        ...game,
        imagen: images[Math.floor(Math.random() * images.length)]
      }));

      setGames(gamesWithImages);
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
      if (usuarioId) {
        const responseUsuario = await fetch(`http://192.168.1.90:3000/salas/${salaId}/usuarios/${usuarioId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("usuario anadido");
        if (!responseUsuario.ok) {
          throw new Error('Error al añadir el usuario a la sala');
        }
      }

      const responseJuego = await fetch(`http://192.168.1.90:3000/salas/${salaId}/juegos/${juegoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!responseJuego.ok) {
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
    <TouchableOpacity onPress={() => handleAddGame(item.id)} style={styles.card}>
      <Image source={item.imagen} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <Text style={styles.text}>{item.descripcionJuego}</Text>
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
      <View style={styles.topSection}>
        <Text style={styles.title}>Partida <Text style={styles.titleBold}>Privada</Text></Text>
      </View>

      <LinearGradient
        colors={['#FFDE59', '#FF914D']}
        style={styles.bottomSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Picker
          selectedValue={categoria}
          style={styles.picker}
          onValueChange={(itemValue) => setCategoria(itemValue)}
        >
          <Picker.Item label="Seleccione una categoría" value="" />
          <Picker.Item label="Tablero" value="Tablero" />
          <Picker.Item label="Bebida" value="Bebida" />
        </Picker>

        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          nestedScrollEnabled={true}
        />

        <Text style={styles.createOwnText}>
          Agrega los juegos a la sala al pinchar encima de ellos 
        </Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCrearSala}>
          <LinearGradient
            colors={['#313131', '#313131']}
            style={styles.createButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.createButtonText}>Crear Sala</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.createOwnText}>
          ¿No ves ningún juego que te convenza? <Text style={styles.createOwnLink} onPress={handleCrearJuego}>¡Crea el tuyo!</Text>
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313131',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  topSection: {
    flex: 1,
    top: 40, // Ajustado para que esté más arriba
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20, // Reducido para hacer más grande la sección de juegos
  },
  bottomSection: {
    flex: 10, // Aumentado para hacer la sección de juegos más grande
    paddingTop: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10, // Reducido para hacer más pequeña la sección del footer
  },
  title: {
    fontSize: 30,
    color: '#ffffff',
    marginBottom: 20,
  },
  titleBold: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  picker: {
    width: '80%',
    marginVertical: 10,
    color: '#ffffff',
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
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 10,
  },
  createOwnLink: {
    color: '#FFDE59',
    textDecorationLine: 'underline',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
  },
  text: {
    color: '#000000',
  },
});

export default ViewGamesScreen;
