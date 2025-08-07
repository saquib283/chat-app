// import React, { useEffect, useState, useRef } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     FlatList,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     TouchableOpacity,
//     Keyboard,
//     TouchableWithoutFeedback,
//     Image,
// } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';
// import {
//     onSnapshot,
//     addDoc,
//     collection,
//     query,
//     orderBy,
//     serverTimestamp
// } from 'firebase/firestore';
// import { auth, db } from '../../services/firebaseConfig';
// import MessageBubble from '../../components/MessageBubble';
// import { SendHorizonal } from 'lucide-react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function ChatScreen() {
//     const { id } = useLocalSearchParams(); // user UID from route
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const flatListRef = useRef(null);

//     const chatId = [auth.currentUser.uid, id].sort().join('_');
//     const messagesRef = collection(db, 'chats', chatId, 'messages');

//     useEffect(() => {
//         const q = query(messagesRef, orderBy('timestamp', 'asc'));
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             setMessages(msgs);

//             setTimeout(() => {
//                 flatListRef.current?.scrollToEnd({ animated: true });
//             }, 100);
//         });

//         return () => unsubscribe();
//     }, [id]);

//     const handleSend = async () => {
//         if (input.trim() === '') return;

//         await addDoc(messagesRef, {
//             text: input,
//             sender: auth.currentUser.uid,
//             receiver: id,
//             timestamp: serverTimestamp(),
//         });

//         setInput('');
//     };

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <KeyboardAvoidingView
//                 style={styles.keyboardAvoidingView}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
//             >
//                 <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                     <View style={styles.container}>

//                         {/* 🟩 Header */}
//                         <View style={styles.header}>
//                             <View style={styles.avatarContainer}>
//                                 {/* Placeholder avatar; swap URI if you have user profile images */}
//                                 <Image
//                                     source={{
//                                         uri: 'https://ui-avatars.com/api/?name=User&background=random'
//                                     }}
//                                     style={styles.avatar}
//                                 />
//                             </View>
//                             <Text style={styles.headerText}>{id}</Text>
//                         </View>

//                         {/* 🟨 Messages */}
//                         <FlatList
//                             ref={flatListRef}
//                             data={messages}
//                             renderItem={({ item }) => (
//                                 <MessageBubble
//                                     message={item}
//                                     isSender={item.sender === auth.currentUser.uid}
//                                 />
//                             )}
//                             keyExtractor={(item) => item.id}
//                             contentContainerStyle={styles.messageList}
//                             onContentSizeChange={() =>
//                                 flatListRef.current?.scrollToEnd({ animated: true })
//                             }
//                             style={styles.flatList}
//                         />

//                         {/* 🟦 Input bar */}
//                         <SafeAreaView edges={['bottom']} style={styles.inputWrapper}>
//                             <TextInput
//                                 value={input}
//                                 onChangeText={setInput}
//                                 placeholder="Type a message..."
//                                 style={styles.input}
//                                 onSubmitEditing={handleSend}
//                                 returnKeyType="send"
//                             />
//                             <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
//                                 <SendHorizonal size={24} color="#007AFF" />
//                             </TouchableOpacity>
//                         </SafeAreaView>
//                     </View>
//                 </TouchableWithoutFeedback>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     keyboardAvoidingView: {
//         flex: 1,
//     },
//     container: {
//         flex: 1,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//         borderColor: '#eee',
//         backgroundColor: '#f9f9f9',
//     },
//     avatarContainer: {
//         marginRight: 12,
//     },
//     avatar: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#ccc',
//     },
//     headerText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//     },
//     flatList: {
//         flex: 1,
//     },
//     messageList: {
//         padding: 10,
//         paddingBottom: 60,
//     },
//     inputWrapper: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         borderTopWidth: 1,
//         borderColor: '#eee',
//         backgroundColor: '#fafafa',
//     },
//     input: {
//         flex: 1,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 20,
//         paddingHorizontal: 15,
//         paddingVertical: Platform.OS === 'ios' ? 12 : 8,
//         marginRight: 10,
//         backgroundColor: '#fff',
//     },
//     sendButton: {
//         padding: 8,
//     },
// });




import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    KeyboardEvent,
    Platform,
    Animated,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
    onSnapshot,
    addDoc,
    collection,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import MessageBubble from '../../components/MessageBubble';
import { SendHorizonal } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const flatListRef = useRef(null);
    const [bottomOffset] = useState(new Animated.Value(0)); // For animated bottom spacing

    const chatId = [auth.currentUser.uid, id].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    useEffect(() => {
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);

            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        return () => unsubscribe();
    }, [id]);

    useEffect(() => {
        const keyboardShow = Keyboard.addListener('keyboardDidShow', (e) => {
            Animated.timing(bottomOffset, {
                toValue: e.endCoordinates.height,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
            Animated.timing(bottomOffset, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        });

        return () => {
            keyboardShow.remove();
            keyboardHide.remove();
        };
    }, []);

    const handleSend = async () => {
        if (input.trim() === '') return;

        await addDoc(messagesRef, {
            text: input,
            sender: auth.currentUser.uid,
            receiver: id,
            timestamp: serverTimestamp(),
        });

        setInput('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image
                            source={{
                                uri: 'https://ui-avatars.com/api/?name=User&background=random'
                            }}
                            style={styles.avatar}
                        />
                        <Text style={styles.headerText}>{id}</Text>
                    </View>

                    {/* Messages */}
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={({ item }) => (
                            <MessageBubble
                                message={item}
                                isSender={item.sender === auth.currentUser.uid}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messageList}
                        onContentSizeChange={() =>
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }
                        style={styles.flatList}
                    />

                    {/* Input */}
                    <Animated.View style={[styles.inputWrapper, { marginBottom: bottomOffset }]}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Type a message..."
                            style={styles.input}
                            onSubmitEditing={handleSend}
                            returnKeyType="send"
                        />
                        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                            <SendHorizonal size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    flatList: {
        flex: 1,
    },
    messageList: {
        padding: 10,
        paddingBottom: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fafafa',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    sendButton: {
        padding: 8,
    },
});
