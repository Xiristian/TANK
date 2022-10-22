import { useEffect, useState } from "react";
import { StyleSheet, Alert, FlatList, PixelRatio, View, Text } from "react-native";
import { List, Button, TextInput, IconButton, Portal, Dialog } from "react-native-paper";
import { executeSql } from "../db";

function AvaliacaoItem({ item, onEditPress, onDeletePress }) {
  return (
    <List.Item
      left={props => (
        <View {...props} style={[styles.itemCircular]}>
          <TextInput
            style={[styles.itemCircularTextInput]}
            contentContainerStyle={{ padding: 10 }}
            value={item.endereco}
            editable={false} />
          <TextInput
            multiline={true}
            style={[styles.itemCircularTextInput]}
            value={item.informacoes} 
            editable={false}
            onChangeText={text => setInfo(text)}/>
          <View {...props} style={[styles.itemHorizontal]}>
            <IconButton mode="contained" icon='pencil' onPress={onEditPress} />
            <IconButton mode="contained" icon='delete' onPress={onDeletePress} />
          </View>
        </View>
      )}
    />
  );
}

function ListEmpty({ onEmptyPress }) {
  return (
    <View style={{ paddingVertical: 26, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 15, textAlign: "center", marginTop: 9, marginBottom: 28 }}>
        Nenhuma avaliação
      </Text>
      <Button mode="contained" onPress={onEmptyPress}>
        Ir para o mapa
      </Button>
    </View>
  );

}

export default function HomeScreen({ navigation }) {
  const [lista, setLista] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [visible, setVisible] = useState(false);
  const [excluiID, setExcluiID] = useState(0);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  async function recuperaPostos() {
    try {
      executeSql("select * from posto", []).then((rows) => {
        setLista(rows.rows._array);
      }
      )
    } catch (error) {
      console.log(error)
    }
  }

  function pesquisaPosto() {
    try {
      executeSql("select * from posto where endereco like '%'||?||'%'", [pesquisa]).then((rows) => {
        setLista(rows.rows._array);
        if (rows.rows._array === []) {
          recuperaPostos()
        }
      }
      )
    } catch (error) {
      console.log(error)
    }
  }

  function excluirItem() {
    const _runDeleteQuery = async () => {
      try {
        executeSql("delete from posto where id = ?", [excluiID]);
        recuperaPostos()
      } catch (error) {
        console.log(error)
      }
    };

    _runDeleteQuery()
  }

  function editarItem(id) {
    navigation.navigate('Map', {id: id})
  }

  useEffect(() => {
    recuperaPostos()
  }, []
  );

  useEffect(() => {
    pesquisaPosto()
  }, [pesquisa]
  );

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Você confirma a exclusão deste item?</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={() => { excluirItem(); hideDialog() }}>Sim</Button>
            <Button onPress={hideDialog}>Não</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <TextInput
          left={<TextInput.Icon icon='magnify' />}
          text={pesquisa}
          onChangeText={text => setPesquisa(text)}
          label='Pesquise aqui...'></TextInput>
      </View>
      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={({ highlighted }) => (
          <View style={[styles.rowSeparator, highlighted && styles.rowSeparatorHide]} />
        )}
        ListEmptyComponent={() => <ListEmpty onEmptyPress={() => navigation.navigate("Map")} />}
        renderItem={({ item }) => (
          <AvaliacaoItem
            item={item}
            onDeletePress={() => { showDialog(); setExcluiID(item.id) }}
            onEditPress={() => editarItem(item.id)}
          />
        )}
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 12,
  },
  textInfo: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  itemCircular: {
    backgroundColor: "rgba(231, 224, 236, 1)",
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 11,
    overflow: "hidden",
    width: '95%',
    alignItems: "center"
  },
  itemHorizontal: {
    width: '90%',
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemCircularTextInput: {
    fontSize: 16,
    fontWeight: "500",
    backgroundColor: "#fff",
    width: '90%'
  },
  rowSeparator: {
    backgroundColor: "#cdcdcd",
    height: 1 / PixelRatio.get(), // altura automática do separador
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});
