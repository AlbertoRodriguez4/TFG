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
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedTematica, setSelectedTematica] = useState('');
  const [tematicas] = useState(["Entretenimiento", "Conocer a gente", "Deportes", "Cultura", "Educación"]);
  const [id, setId] = useState(0);
  const [plan, setPlan] = useState('');

  useEffect(() => {
    fetchSalas();
    fetchEventos();
    loadUserData();
    const intervalId = setInterval(fetchSalas, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    filterItems();
  }, [salas, eventos, searchQuery, selectedTematica]);

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
    fetchSalas();
    fetchEventos();
    setRefreshing(false);
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}`);
        const data = await response.json();

        console.log("Plan recibido del servidor:", data.plan);
        setPlan(data.plan);
        setId(id);
        console.log("ID y plan después de establecerlos:", id, plan);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const filterItems = () => {
    let filtered = [...salas, ...eventos];

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nombreSala?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTematica) {
      filtered = filtered.filter(item =>
        item.tematicaSala?.toLowerCase() === selectedTematica.toLowerCase() ||
        item.tematicaEvento?.toLowerCase() === selectedTematica.toLowerCase()
      );
    }

    // Ordenar los elementos, los eventos primero
    filtered.sort((a, b) => (a.tematicaEvento ? -1 : 1));

    setFilteredItems(filtered);
  };

  const handleSearch = () => {
    filterItems();
  };

  const handleFilterByTematica = (tematica) => {
    if (selectedTematica === tematica) {
      setSelectedTematica('');
    } else {
      setSelectedTematica(tematica);
    }
    filterItems();
  };

  const renderTematicaCircle = (tematica) => (
    <TouchableOpacity
      key={tematica}
      onPress={() => handleFilterByTematica(tematica)}
      style={[styles.tematicaCircle, { backgroundColor: selectedTematica === tematica ? 'gray' : 'black' }]}
    >
      <Text style={styles.tematicaText}>{tematica}</Text>
    </TouchableOpacity>
  );

  const renderSalaCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('VerDatosSalas', { salaId: item.id })} style={styles.card}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <Text style={styles.cardDescription}>{item.descripcion}</Text>
      <Text style={styles.cardInfo}>Temática: {item.tematicaSala}</Text>
      <Text style={styles.cardInfo}>Edad Mínima: {item.edadMinima}</Text>
      <Text style={styles.cardInfo}>Edad Máxima: {item.edadMaxima}</Text>
      <Text style={styles.cardInfo}>Localización: {item.localizacionSala}</Text>
      <Text style={styles.cardInfo}>Fecha: {item.fecha}</Text>

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
      {item.imagen && (
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
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Buscar por nombre de sala o evento"
          />
          <Button title="Buscar" onPress={handleSearch} />
        </View>
        <View style={styles.tematicasContainer}>
          {tematicas.map(renderTematicaCircle)}
        </View>
        <Text style={styles.title}>Eventos y Salas Disponibles</Text>
        <FlatList
          data={filteredItems}
          renderItem={({ item }) =>
            item.tematicaSala ? renderSalaCard({ item }) : renderEventoCard({ item })
          }
          keyExtractor={(item) => (item.tematicaSala ? `sala-${item.id}` : `evento-${item.id}`)}
          style={styles.flatList}
        />
        {plan === 'Business' ? (
          <Button title="Crear Evento" onPress={handleCrearEvento} />
        ) : (
          <Button title="Crear Sala" onPress={handleCrearSala} />
        )}
      </ScrollView>
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tematicaCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  tematicaText: {
    color: 'white',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
