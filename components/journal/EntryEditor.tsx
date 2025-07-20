import { ScrollView, View, Text, Pressable, Keyboard, Alert, KeyboardAvoidingView, Platform } from "react-native"
import Screen from "../shared/Screen"
import { globalStyles } from "../shared/globalStyles"
import { useRouter } from "expo-router"
import { styles } from "./EntryEditor.styles"
import TextInput from "../shared/TextInput"
import { useEffect, useRef, useState } from "react"
import { updateJournalEntryWithStore } from "@/actions/journalEntries"
import { getErrorMessage } from "@/lib/utils"

export default function EntryEditor() {
    const router = useRouter()
    const [isKeyboardVisible, setKeyboardVisible] = useState(false)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [saved, setSaved] = useState<boolean>(false)

    const today = new Date()
    const displayDate = today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))

        return () => {
            showSub.remove()
            hideSub.remove()
        }
    }, [])

    // Autosave
    const DEBOUNCE_TIMEOUT = 5000 // 5 seconds
    const autosaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const latestTitle = useRef(title)
    const latestContent = useRef(content)
    const [entryId, setEntryId] = useState<string>('')
    
    useEffect(() => {
        latestTitle.current = title
        latestContent.current = content

        if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current)

        setSaved(false)

        autosaveTimeout.current = setTimeout(() => {
            const autosave = async () => {
                if (title.trim() || content.trim()) {

                    try {
                        const savedEntry = await updateJournalEntryWithStore({
                            newEntry: {
                                id: entryId || '', // blank string triggers insert
                                title: latestTitle.current,
                                content_md: latestContent.current,
                            }
                        })
                        if (!entryId) setEntryId(savedEntry.id)
                        setSaved(true)
                    } catch (error) {
                        const msg = getErrorMessage(error)
                        Alert.alert('Error Saving Entry', msg)
                    }
                }
            }

            void autosave()
        }, DEBOUNCE_TIMEOUT)

        return () => {
            if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current)
        }
    }, [title, content])

    const handleBack = async () => {
        if (!content.trim() && !title.trim()) router.back()
            
        if (!saved) {
            const waitUntilSaved = async () => {
                while (!saved) {
                    await new Promise(resolve => setTimeout(resolve, 100))
                }
            }
            await waitUntilSaved()
        }
        router.back()
    }

    const handleCloseKeyboard = () => {
        Keyboard.dismiss()
    }

    return (
        <Screen>
            <View style={styles.header} >
                <Pressable onPress={handleBack}>
                    <Text style={styles.headerLink} >&lt; Back</Text>
                </Pressable>
                <View style={styles.headerLinkRightCol} >
                    {isKeyboardVisible ? (
                        <Pressable onPress={handleCloseKeyboard}>
                            <Text style={styles.darkHeaderLink} >Done</Text>
                        </Pressable>
                    ) : (
                        <Pressable onPress={() => router.push('/back')}>
                            <Text style={styles.headerLink} >Previous Entries</Text>
                        </Pressable>
                    )}
                </View>
            </View>

            <View style={globalStyles.content}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        <View style={styles.hero}>
                            <Text style={styles.date}>{displayDate}</Text>
                            <TextInput
                                multiline
                                placeholder='New journal title...'
                                value={title}
                                onChangeText={setTitle}
                                style={styles.titleInput}
                            />
                            <View style={styles.horizontalLine}/>
                        </View>
                        <TextInput
                            multiline
                            placeholder="# My Journal Entry"
                            value={content}
                            onChangeText={setContent}
                            style={styles.markdownInput}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Screen>
    )
}