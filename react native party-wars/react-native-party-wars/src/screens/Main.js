import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, RefreshControl, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
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
  }, []);

  useEffect(() => {
    filterItems();
  }, [salas, eventos, searchQuery, selectedTematica]);
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );
  const fetchSalas = async () => {
    try {
      const response = await fetch('http://192.168.1.90:3000/salas');
      const data = await response.json();
      setSalas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEventos = async () => {
    try {
      const response = await fetch('http://192.168.1.90:3000/eventos');
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSalas();
    await fetchEventos();
    setRefreshing(false);
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}`);
        const data = await response.json();

        setPlan(data.plan);
        setId(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filterItems = () => {
    let filtered = [...salas, ...eventos];

    if (searchQuery) {
      filtered = filtered.filter(item =>
        (item.nombre && item.nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.nombreSala && item.nombreSala.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedTematica) {
      filtered = filtered.filter(item =>
        (item.tematicaSala && item.tematicaSala.toLowerCase() === selectedTematica.toLowerCase()) ||
        (item.tematicaEvento && item.tematicaEvento.toLowerCase() === selectedTematica.toLowerCase())
      );
    }

    filtered.sort((a, b) => (a.tematicaEvento ? -1 : 1));

    setFilteredItems(filtered);
  };

  const handleSearch = () => {
    filterItems();
  };

  const handleFilterByTematica = (tematica) => {
    setSelectedTematica(selectedTematica === tematica ? '' : tematica);
  };

  const renderTematicaCircle = (tematica) => (
    <TouchableOpacity
      key={tematica}
      onPress={() => handleFilterByTematica(tematica)}
      style={[styles.tematicaCircle, { backgroundColor: selectedTematica === tematica ? '#FF914D' : 'black' }]}
    >
      <LinearGradient
        colors={['#FFDE59', '#FF914D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tematicaGradient}
      >
        <Text style={styles.tematicaText}>{tematica}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSalaCard = (item) => (
    <TouchableOpacity onPress={() => navigation.navigate('VerDatosSalas', { salaId: item.id })} style={styles.card}>
      <LinearGradient
        colors={['#7cfff7', '#ff88e5']}
        style={styles.cardContent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.salaHeader}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text style={styles.cardDescription}>{item.descripcion}</Text>
        </View>
        <View style={styles.salaInfoContainer}>
          <Text style={styles.cardInfo}>Temática: {item.tematicaSala}</Text>
          <Text style={styles.cardInfo}>Edad Mínima: {item.edadMinima}</Text>
          <Text style={styles.cardInfo}>Edad Máxima: {item.edadMaxima}</Text>
          <Text style={styles.cardInfo}>Localización: {item.localizacionSala}</Text>
          <Text style={styles.cardInfo}>Fecha: {item.fecha}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('VerDatosSalas', { salaId: item.id })} style={styles.button}>
          <LinearGradient
            colors={['#FFDE59', '#FF914D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Ver Detalles</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderEventoCard = (item) => (
    <View style={styles.bottomSection}>
      <LinearGradient 
        colors={['#7cfff7', '#ff88e5']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('verDatosEventos', { eventoId: item.id })} style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.imagen }} style={styles.image} />
          </View>
          <Text style={styles.cardTitle}>{item.nombreSala}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('verDatosEventos', { eventoId: item.id })} style={styles.button}>
              <LinearGradient
                colors={['#FFDE59', '#FF914D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Ver Detalles</Text>
              </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const handleCrearSala = () => {
    navigation.navigate('CrearSala');
  };

  const handleCrearEvento = () => {
    navigation.navigate('CrearEvento');
  };

  const renderHeader = () => (
    <View>
      <View style={styles.topSection}>
        <Text style={styles.title}>Salas Y Eventos Party Wars <Text style={styles.titleBold}></Text></Text>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <TextInput
                onChangeText={setSearchQuery}
                value={searchQuery}
                placeholder="Buscar por nombre de sala o evento"
                placeholderTextColor="white"
                style={styles.textInput}
              />
              <TouchableOpacity onPress={handleSearch}>
                <Image
                  source={require('../assets/lupa.png')}
                  style={styles.lupaIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Image
              source={require('../assets/perfil.png')}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          {plan === 'Business' ? (
            <TouchableOpacity onPress={handleCrearEvento}>
              <LinearGradient
                colors={['#FFDE59', '#FF914D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradientCrearSalaEvento}
              >
                <Text style={styles.buttonText}>Crear Evento</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleCrearSala}>
              <LinearGradient
                colors={['#FFDE59', '#FF914D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradientCrearSalaEvento}
              >
                <Text style={styles.buttonText}>Crear Sala</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.tematicasContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tematicasScrollView}>
          {tematicas.map((tematica) => renderTematicaCircle(tematica))}
        </ScrollView>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    if (item.tematicaEvento) {
      return renderEventoCard(item);
    } else if (item.tematicaSala) {
      return renderSalaCard(item);
    }
    return null;
  };

  return (
    <FlatList
      data={filteredItems}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={<Text style={styles.noResultsText}>No se encontraron resultados.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
    marginLeft: 20,
  },
  titleBold: {
    fontWeight: '900',
  },
  profileIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',  // This ensures the search bar is on the left and the profile icon on the right
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
  },
  textInput: {
    flex: 1,
    color: 'white',
  },
  lupaIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonGradientCrearSalaEvento: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tematicasContainer: {
    marginTop: 10,
    paddingBottom: 10,
  },
  tematicasScrollView: {
    paddingLeft: 10,
  },
  tematicaCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  tematicaGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  tematicaText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  cardDescription: {
    fontSize: 16,
    color: 'black',
    marginTop: 5,
  },
  cardInfo: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
  },
  buttonGradient: {
    paddingVertical: 10,
    borderRadius: 20,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  noResultsText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  topSection: {
    backgroundColor: '#2b2b2b',
    paddingBottom: 10,
  },
  salaHeader: {
    flexDirection: 'column',
  },
  salaInfoContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
});

export default Main;
