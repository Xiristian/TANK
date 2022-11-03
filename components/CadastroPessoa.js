import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

import {
    StyleSheet,
    Keyboard,
    View,
    Text,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from "react-native";

import { TextInput, Button, Dialog, Portal, Modal, Checkbox } from "react-native-paper";

export default function CadastroPessoa() {
    const [Pessoa, setPessoa] = useState({
        nome: '',
        cpf: '',
        numero: '',
        meioPagamento: ''
    });

    const [pessoaRecuperado, setPessoaRecuperado] = useState({
        nome: '',
        cpf: '',
        numero: '',
        meioPagamento: ''
    });

    const [meiosPagamento, setMeiosPagamento] = useState([
        { id: 0, txt: 'PIX', isChecked: false },
        { id: 1, txt: 'Cartão', isChecked: false },
    ]);

    const setChecked = (searchId, status) => {
        const updatedObject = meiosPagamento.map((meioPagamento) =>
            (meioPagamento.id === searchId ? { ...meioPagamento, isChecked: status }: meioPagamento)
        );
        const updatedMeio = meiosPagamento.map((meioPagamentos) =>
            (meioPagamentos.id === searchId ? setPessoa({...Pessoa, meioPagamento:meioPagamentos.txt}):'')
        );
        
        setMeiosPagamento(updatedObject);
        if (status === true) {
            setTimeout(() => {
                setChecked(searchId, !status);;
            }, 500);
        }
    };

    const [dialogVisible, setDialogVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [status, setStatus] = useState('ERROS');
    const [erro, setErro] = useState('');

    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    const salvarPessoa = async () => {
        try {
            const jsonValue = JSON.stringify(Pessoa);
            await AsyncStorage.setItem('@pessoa', jsonValue);
        } catch (e) {
            setErro('Erro ao salvar as informações!');
            setStatus('ERRO');
        }
    };

    const salvar = () => {
        setErro('');
        setStatus('SUCESSO');
        salvarPessoa();
        showDialog();
    };

    const getPessoa = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@pessoa')
            if (jsonValue !== null) {
                const pessoaRecuperado = JSON.parse(jsonValue);
                setPessoaRecuperado(pessoaRecuperado);
            }
        } catch (e) {
        }
    };

    useEffect(() => {
        getPessoa();
    }, [])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.formContainer}>
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                            <Dialog.Title>ENVIADO COM {status}</Dialog.Title>
                            {erro ?
                                (<Dialog.Content>
                                    <Text>{erro}</Text>
                                </Dialog.Content>) : null}
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Modal
                            visible={modalVisible}
                            onDismiss={hideModal}
                            contentContainerStyle={styles.containerStyle}>
                            <Checkbox.Item
                                label='PIX'
                                labelStyle={{ position: "absolute", left: 60 }}
                                position="leading"
                                status={meiosPagamento[0].isChecked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(0, true);
                                    hideModal();
                                }}
                            />
                            <Checkbox.Item
                                label='Cartão'
                                labelStyle={{ position: "absolute", left: 60 }}
                                position="leading"
                                status={meiosPagamento[1].isChecked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(1, true);
                                    hideModal();
                                }}
                            />
                        </Modal>
                    </Portal>
                    <TextInput
                        autoCorrect={false}
                        label="Nome..."
                        value={Pessoa.nome}
                        onChangeText={texto => setPessoa({ ...Pessoa, nome: texto })}
                        style={[styles.textInput]}
                        mode="outlined"
                    />
                    <TextInput
                        autoCorrect={true}
                        label="CPF..."
                        value={Pessoa.cpf}
                        multiline={true}
                        style={[styles.textInput]}
                        onChangeText={texto => setPessoa({ ...Pessoa, cpf: texto })}
                        mode="outlined"
                    />
                    <TextInput
                        autoCorrect={false}
                        label="Numero..."
                        value={Pessoa.numero}
                        onChangeText={texto => setPessoa({ ...Pessoa, numero: texto })}
                        style={[styles.textInput]}
                        mode="outlined"
                    />
                    <TextInput
                        autoCorrect={false}
                        label="Adicionar meio de pagamento"
                        value={Pessoa.meioPagamento}
                        style={[styles.textInput]}
                        mode="outlined"
                        editable={false}
                        left={<TextInput.Icon
                            icon="plus"
                            onPress={() => {
                                showModal();
                            }} />}
                    />
                    <Button onPress={() => {
                        salvar();
                        Keyboard.dismiss();
                    }}
                        mode="contained" style={{ marginTop: 16, width: '40%' }}>
                        ENVIAR
                    </Button>
                </View>
            </TouchableWithoutFeedback >
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        alignItems: 'center',
    },
    textInput: {
        width: '90%',
        marginTop: 6,
    },
    containerStyle: {
        backgroundColor: 'white',
        padding: 20
    },
});