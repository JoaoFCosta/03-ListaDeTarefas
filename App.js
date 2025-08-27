import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]); // estado para armazenar a lista de tarefas
  const [newTask, setNewTask] = useState(""); // estado para o texto da nova tarefa
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem("tasks");
        savedTasks && setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Erro ao salvar tarefas:", error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Erro ao salvar tarefas:", error);
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (newTask.length > 0) {
      //Garante que a tarefa não vai salvar vazia
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now().toString(), text: newTask.trim(), completed: false }, // Cria uma nova tarefa com Id unico
      ]);
      setNewTask(""); // Limpar o campo de input
      Keyboard.dismiss(); // Fecha o teclado do usuario
    } else {
      Alert.alert("Atenção", "Por favor, digite uma nova tarefa");
    }
  };

  const toggleTaskComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.complete } : task
      )
    );
  };

  const deleteTask = (id) => {
    Alert.alert(
      "Confimar exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)),
        },
      ]
    );
  };

  const renderList = ({ item }) => (
    <View style={[styles.taskItem, darkMode && dark.TastItem]} key={item.id}>
      <TouchableOpacity
        onPress={() => toggleTaskComplete(item.id)}
        style={styles.taskTextContainer}
      >
        <Text
          style={[
            styles.taskText,
            darkMode && dark.taskText,
            item.completed && styles.completedTaskItem,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={[styles.taskText, darkMode && dark.taskText]}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, darkMode && dark.container]}>
      <View style={[styles.topBar, darkMode && dark.topBar]}>
        <Text style={[styles.topBarTitle, darkMode && dark.topBarTitle]}>
          Minhas Tarefas
        </Text>
        <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
          <Text>{darkMode ? "☀️" : "🌙"}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, darkMode && dark.card]}>
        <TextInput
          style={[styles.input, darkMode && dark.input]}
          placeholder="Adicionar nova tarefa..."
          placeholderTextColor={darkMode ? "#aaa" : "#555"}
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask} // Adiciona a teraf ao pressionar enter no teclado
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={[styles.FlatList]}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderList}
        // renderItem={({ item }) => (
        //   <View key={item.id} style={styles.taskItem}>
        //     <Text>{item.text}</Text>
        //     <TouchableOpacity>
        //       <Text>🗑️</Text>
        //     </TouchableOpacity>
        //   </View>
        // )}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyListText, darkMode && dark.emptyListText]}>
            Nenhuma tarefa adicionada ainda.
          </Text>
        )}
        contentContainerStyle={styles.flatListContent}
      />
      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f7fa",
  },
  topBar: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50, // ajuste para a barra de status
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  topBarTitle: {
    color: "#00769b",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    color: "#000",
    shadowColor: "#000",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  input: {
    backgroundColor: "#fcfcfc",
    color: "#333",
    borderColor: "#b0bec5",
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    fontSize: 18,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#009688",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 10,
  },
  taskItem: {
    color: "#333",
    borderColor: "rgba (0,0,0,0.1)",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },

  taskContainer: {
    flex: 1, // Permite que o texto ocupe o espaço disponivel
    marginRight: 10,
  },
  taskText: {
    color: "#333",
    fontSize: 18,
    flexWrap: "wrap", //Permite que o texto quebre linha
  },
  completedTaskItem: {
    textDecorationLine: "line-through", //Risca o texto
    opacity: 0.6,
  },

  deleteButton: {
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    //color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  emptyListText: {
    color: "#9e9e9e",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

const dark = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
  },
  topBar: {
    backgroundColor: "#1f1f1f",
    borderBottomColor: "#333",
  },
  topBarTitle: {
    color: "#ffffff",
  },
  card: {
    backgroundColor: "#1e1e1e",  // <-- fundo do card escuro
  },
  input: {
    backgroundColor: "#2c2c2c",  // <-- fundo do input escuro
    color: "#fff",               // <-- texto claro
    borderColor: "#555",
  },
  taskItem: {
    backgroundColor: "#1e1e1e",  // <-- fundo da tarefa escuro
  },
  taskText: {
    color: "#ffffff",            // <-- texto claro
  },
  emptyListText: {
    color: "#bbb",
  },
});
