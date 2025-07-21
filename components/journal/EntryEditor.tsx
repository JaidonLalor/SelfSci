import { ScrollView, View, Text, Pressable, Keyboard, Alert, KeyboardAvoidingView, Platform } from "react-native"
import Screen from "../shared/Screen"
import { globalStyles } from "../shared/globalStyles"
import { usePathname, useRouter } from "expo-router"
import { styles } from "./EntryEditor.styles"
import TextInput from "../shared/TextInput"
import { useEffect, useRef, useState } from "react"
import { deleteJournalEntryWithStore, fetchJournalEntriesWithStore, updateJournalEntryWithStore } from "@/actions/journalEntries"
import { getErrorMessage } from "@/lib/utils"
import { useJournalEntries } from "@/stores/journal_entries"
import { JournalEntry } from "@/lib/supabase/journal_entries"

export default function EntryEditor() {
    
    // Initialize with existing entry ////////////////
    const pathname = usePathname()
    const slug = pathname.split('/').pop()
    const { journalEntries } = useJournalEntries()
    const [entry, setEntry] = useState<JournalEntry | undefined>(undefined)

    useEffect(() => {
        if (slug === 'new') {
            return
        } else {
            if (!journalEntries) {
                fetchJournalEntriesWithStore()
                return
            }
            const entry = journalEntries.find(entry => entry.id === slug)
            setEntry(entry)
        }
    }, [slug, journalEntries])

    useEffect(() => {
        if (entry) {
            setTitle(entry.title || '')
            setContent(entry.content_md || '')
            setEntryId(entry.id)
        }
    }, [entry])
    /////////////////////////////////////////////


    const [isKeyboardVisible, setKeyboardVisible] = useState(false)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [entryId, setEntryId] = useState<string>('')

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

    // Autosave ////////////////////
    const DEBOUNCE_TIMEOUT = 5000 // 5 seconds
    const autosaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const latestTitle = useRef(title)
    const latestContent = useRef(content)
    
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false)
    
    useEffect(() => {
        latestTitle.current = title
        latestContent.current = content

        if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current)

        setHasUnsavedChanges(true)

        autosaveTimeout.current = setTimeout(() => {
            const autosave = async () => {
                if (title.trim() || content.trim()) {

                    setIsSaving(true)

                    try {
                        const savedEntry = await updateJournalEntryWithStore({
                            newEntry: {
                                id: entryId || '', // blank string triggers insert
                                title: latestTitle.current,
                                content_md: latestContent.current,
                            }
                        })
                        if (!entryId) setEntryId(savedEntry.id)
                        setHasUnsavedChanges(false)
                    } catch (error) {
                        const msg = getErrorMessage(error)
                        Alert.alert('Error Saving Entry', msg)
                    } finally {
                        setIsSaving(false)
                    }
                }
            }

            void autosave()
        }, DEBOUNCE_TIMEOUT)

        return () => {
            if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current)
        }
    }, [title, content])


    const router = useRouter()

    const handleBack = () => router.back()

    const handleCloseKeyboard = () => Keyboard.dismiss()
    
    const handleDelete = () => {
        Alert.alert(
            'Delete Entry?',
            'This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (!entry?.id) {
                            router.back()
                            return
                        }
                        const deleteEntry = async () => {
                            await deleteJournalEntryWithStore(entry?.id)
                            router.back()
                        }
                        deleteEntry()
                    },
                },
            ],
            { cancelable: true }
        )
    }

    return (
        <Screen>
            <View style={styles.header} >
                {(isSaving || hasUnsavedChanges) ? (
                    <Text style={styles.headerText}>Saving...</Text>
                ) : (
                    <Pressable onPress={handleBack}>
                        <Text style={styles.headerLink} >&lt; Back</Text>
                    </Pressable>
                )}
                <View style={styles.headerLinkRightCol} >
                    {isKeyboardVisible ? (
                        <Pressable onPress={handleCloseKeyboard}>
                            <Text style={styles.darkHeaderLink} >Done</Text>
                        </Pressable>
                    ) : (
                        <Pressable onPress={handleDelete}>
                            <Text style={styles.headerLink} >Delete Entry</Text>
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