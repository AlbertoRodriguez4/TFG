import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, RefreshControl, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const Main = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [salas, setSalas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedTematica, setSelectedTematica] = useState('');
  const [tematicas] = useState(["Masonería máxima", "Fiesta en la playa", "Deportes", "Cultura", "Educación"]);
  const [id, setId] = useState(0);
  const [plan, setPlan] = useState('');

  useEffect(() => {
    fetchSalas();
    fetchEventos();
    loadUserData();
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
      console.error('Error al cargar los datos del usuario:', error);
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
  
    // Ordenar los elementos, los eventos primero
    filtered.sort((a, b) => (a.tematicaEvento ? -1 : 1));
  
    setFilteredItems(filtered);
    console.log('Items filtrados:', filtered);
  };



  const handleSearch = () => {
    filterItems();
  };
  const handleFilterByTematica = (tematica) => {
    const nuevaTematica = selectedTematica === tematica ? '' : tematica;
    console.log('Temática seleccionada:', nuevaTematica);
    setSelectedTematica(nuevaTematica);
  };
  const renderTematicaCircle = (tematica) => (
    <TouchableOpacity
      key={tematica}
      onPress={() => handleFilterByTematica(tematica)}
      style={[styles.tematicaCircle, { backgroundColor: selectedTematica === tematica ? 'gray' : 'black' }]}
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
    <View style={styles.bottomSection}>
      <LinearGradient
        colors={['#7cfff7', '#ff88e5']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('VerDatosSalas', { salaId: item.id })} style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.imagen }} style={styles.image} />
          </View>
          <Text style={styles.cardTitle}>{item.nombre}</Text>  
          <Text style={styles.cardDescription}>{item.descripcion}</Text>
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
        </TouchableOpacity>
      </LinearGradient>
    </View>
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
        <Text style={styles.title}>Eventos <Text style={styles.titleBold}>Party Wars</Text></Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Image
            source={require('../assets/iconoaccount.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
          
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
          
        </View><View style={styles.buttonContainer}>
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
      <ScrollView horizontal style={styles.tematicasContainer}>
        {tematicas.map(renderTematicaCircle)}
      </ScrollView>
      
    </View>
  );



  const renderItems = ({ item, index }) => {
    if (index % 2 === 0) {
      // Par
      const nextItem = filteredItems[index + 1];
      return (
        <View style={styles.row}>
          {item.tematicaSala ? renderSalaCard(item) : renderEventoCard(item)}
          {nextItem && (nextItem.tematicaSala ? renderSalaCard(nextItem) : renderEventoCard(nextItem))}
        </View>
      );
    }
    return null;
  };

  return (
    <FlatList
      style={styles.container}
      data={filteredItems}
      renderItem={renderItems}
      keyExtractor={(item) => (item.tematicaSala ? `sala-${item.id}` : `evento-${item.id}`)}
      ListHeaderComponent={renderHeader}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF4',
  },
  topSection: {
    backgroundColor: '#313131',
    width: '100%',
    
  },
  bottomSection: {
    top: 15,
    backgroundColor: '#FFFAF4',
    flex: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    top: 15,
    fontSize: 24,
    marginBottom: 20,
    marginTop: 30,
    marginRight: 30,
    color: 'white',
    textAlign: 'center',
  },
  titleBold: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: 'white',
    textAlign: 'center',
  },
  buscadorGradient: {
    borderRadius: 15,
  },
  searchContainer: {
    top: 15,
    marginTop: 15,
    left: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 10,
    color: 'white',
  },
  searchInput: {
    borderRadius: 15,
    padding: 10,
    paddingRight: 65,
    marginRight: 80,
    backgroundColor: '#434343',
    flexDirection: 'row',
    color: 'white',
    marginBottom: 10,
  },
  tematicasContainer: {
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#FFFAF4',
  },
  tematicaCircle: {
    marginHorizontal: 5,
    borderRadius: 17,
  },
  tematicaGradient: {
    width: 150,
    height: 45,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tematicaText: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#FFFAF4',
  },
  card: {
    height: 150,
    width: 150,
    borderRadius: 20,
    padding: 0,
    marginBottom: 10,
    marginHorizontal: 5,
    overflow: 'hidden',
    backgroundColor: '#FFFAF4',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    margin: 10,
  },
  cardDescription: {
    marginLeft: 5,
    marginVertical: 5,
    color: 'white',
  },
  cardInfo: {
    marginLeft: 10,
    marginVertical: 5,
    color: 'white',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  buttonGradient: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGradientCrearSalaEvento: {
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  footer: {
    marginVertical: 20,
    paddingTop: 10,
    backgroundColor: '#FFFAF4',
    marginTop: 10,
    bottom: 120,
  },
  profileIcon: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: -20,
    right: 10,
  },
  lupaIcon: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: -10,
    left: 10,
  },
  textInput: {
    color: 'white',
  },
});

export default Main;