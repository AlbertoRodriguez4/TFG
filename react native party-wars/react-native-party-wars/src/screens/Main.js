import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Button, RefreshControl, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Main = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [salas, setSalas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSalas, setFilteredSalas] = useState([]);
  const [tematicas] = useState(["Entretenimiento", "Conocer a gente", "Deportes", "Cultura", "Educación"]);
  const [id, setId] = useState(0); // Establece el estado del ID
  const [plan, setPlan] = useState('');

  useEffect(() => {
    fetchSalas();
    fetchEventos();
    loadUserData();
    const intervalId = setInterval(fetchSalas, 2000); // Realizar la llamada cada 60 segundos

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  const fetchSalas = async () => {
    try {
      const response = await fetch('http://192.168.1.90:3000/salas');
      const data = await response.json();
      setSalas(data);
    } catch (error) {
      console.error('Error al cargar las salas:', error);
    }
  };

  const fetchEventos = async () => {
    try {
      const response = await fetch('http://192.168.1.90:3000/eventos');
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchEventos(); // Llama a la función para obtener los eventos
    setRefreshing(false);
  };
  const loadUserData = async () => {
    try {
      // Obtener los datos del usuario guardados en AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        // Si hay datos del usuario, actualizar los estados locales
        const { id } = JSON.parse(userData);
        const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}`);
        const data = await response.json();
        
        // Asegúrate de que el plan se esté estableciendo correctamente
        console.log("Plan recibido del servidor:", data.plan);
        
        // Establecer el estado del plan
        setPlan(data.plan);
        
        // Establecer el estado del ID
        setId(id);
        
        // Imprimir el ID y el plan para verificar
        console.log("ID y plan después de establecerlos:", id, plan);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };
  

  const handleNavigate = (salaId) => {
    navigation.navigate('VerDatosSalas', { salaId });
  };

  const handleSearch = () => {
    const filtered = salas.filter(sala => sala.nombre.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredSalas(filtered);
  };

  const handleFilterByTematica = (tematica) => {
    const filtered = salas.filter(sala => sala.tematicaSala.toLowerCase() === tematica.toLowerCase());
    setFilteredSalas(filtered);
  };

  const renderTematicaCircle = (tematica) => (
    <TouchableOpacity
      key={tematica}
      onPress={() => handleFilterByTematica(tematica)}
      style={[styles.tematicaCircle, { backgroundColor: getRandomColor() }]}
    >
      <Text style={styles.tematicaText}>{tematica}</Text>
    </TouchableOpacity>
  );

  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF33E6', '#33E6FF', '#E6FF33'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderSalaCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('VerDatosSalas', { salaId: item.id })} style={styles.card}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <Text style={styles.cardDescription}>{item.descripcion}</Text>
      <Text style={styles.cardInfo}>Tematica: {item.tematicaSala}</Text>
      <Text style={styles.cardInfo}>Edad Mínima: {item.edadMinima}</Text>
      <Text style={styles.cardInfo}>Edad Máxima: {item.edadMaxima}</Text>
      <Text style={styles.cardInfo}>Localización: {item.localizacionSala}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('VerDatosSalas', { salaId: item.id })} style={styles.button}>
        <Text style={styles.buttonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEventoCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('verDatosEventos', { eventoId: item.id })} style={styles.card}>
      <Text style={styles.cardTitle}>{item.nombreSala}</Text>
      <Text style={styles.cardDescription}>{item.descripcionEnvento}</Text>
      <Text style={styles.cardInfo}>Temática: {item.tematicaEvento}</Text>
      <Text style={styles.cardInfo}>Edad Mínima: {item.edadMinEvento}</Text>
      <Text style={styles.cardInfo}>Edad Máxima: {item.edadMaxEvento}</Text>
      <Text style={styles.cardInfo}>Localización: {item.localizacion}</Text>
      {item.imagen && ( // Verifica si hay una URL de imagen disponible
        <Image source={{ uri: item.imagen }} style={styles.image} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('verDatosEventos', { eventoId: item.id })} style={styles.button}>
        <Text style={styles.buttonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  


  const handleCrearSala = () => {
    navigation.navigate('CrearSala');
  };

  const handleCrearEvento = () => {
    navigation.navigate('CrearEvento');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      ></ScrollView>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholder="Buscar por nombre de sala"
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>
      <View style={styles.tematicasContainer}>
        {tematicas.map(renderTematicaCircle)}
      </View>
      <Text style={styles.title}>Eventos Disponibles</Text>
      <FlatList
        data={eventos}
        renderItem={renderEventoCard}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
      />
      <Text style={styles.title}>Salas Disponibles</Text>
      <FlatList
        data={filteredSalas.length > 0 ? filteredSalas : salas}
        renderItem={renderSalaCard}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
      />
      {plan === 'Business' ? (
        <Button title="Crear Evento" onPress={handleCrearEvento} />
      ) : (
        <Button title="Crear Sala" onPress={handleCrearSala} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  tematicasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tematicaCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tematicaText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    marginBottom: 10,
  },
  cardInfo: {
    color: '#666',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flatList: {
    flexGrow: 1,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});


export default Main;
