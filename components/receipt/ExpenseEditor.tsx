import Button from "@/components/shared/Button";
import HalfSheet from "@/components/shared/HalfSheet";
import TextInput from "@/components/shared/TextInput";
import { useExpenseEditor } from "@/stores/expense_editor";
import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput as RNTextInput, Keyboard, Pressable } from "react-native";
import { styles } from "./ExpenseEditor.styles";
import { getErrorMessage } from "@/lib/utils";
import { globalStyles } from "@/components/shared/globalStyles";
import { updateExpenseEntryWithStore } from "@/actions/expenses";
import { emptyExpenseEntry } from "@/lib/supabase/expense";
import { Ionicons } from "@expo/vector-icons";
import { deleteExpenseEntryWithStore } from '@/actions/expenses'

export default function ExpenseEditor() {
    const { editorExpense, setEditorExpense, loading, setLoading, setIsOpen, error, setError, reset } = useExpenseEditor()
    const [amountStr, setAmountStr] = useState<string>( editorExpense.amount ? editorExpense.amount.toString() : '' )
    const [noteOpen, setNoteOpen] = useState<boolean>(false)
    const [note, setNote] = useState<string>('')
    const [contextOpen, setContextOpen] = useState<boolean>(false)
    const [dateOpen, setDateOpen] = useState<boolean>(false)
    const [timeOpen, setTimeOpen] = useState<boolean>(false)

    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [day, setDay] = useState('')
    const [time, setTime] = useState('')
    
    const noteInputRef = useRef<RNTextInput>(null)
    const nameInputRef = useRef<RNTextInput>(null)
    const amountInputRef = useRef<RNTextInput>(null)
    const yearInputRef = useRef<RNTextInput>(null)
    const monthInputRef = useRef<RNTextInput>(null)
    const dayInputRef = useRef<RNTextInput>(null)

    const handleOpenNote = () => {
        setNoteOpen(true)
        setTimeout(() => {
            noteInputRef.current?.focus()
        }, 50)
    }
    const handleCloseNote = () => {
        setNoteOpen(false)
        setNote('')
    }
    const handleDateOpen = () => {
        setDateOpen(true)
        setTimeout(() => {
            yearInputRef.current?.focus()
        }, 50)
    }
    const handleDateClose = () => {
        setDateOpen(false)
        setYear('')
        setMonth('')
        setDay('')
        setTimeOpen(false)
        setTime('00:00')
    }
    const handleTagsOpen = () => setContextOpen(true)
    const handleTagsClose = () => {
        setContextOpen(false)
        setEditorExpense(prev => ({ ...prev, context: undefined }))
    }
    const handleYearChange = (text: string) => {
        if (/^\d{0,4}$/.test(text)) {
            const wasAdding = text.length > year.length
            setYear(text)
            if (wasAdding && text.length === 4) {
                monthInputRef.current?.focus()
            }
        }
    }
    const handleMonthChange = (text: string) => {
        if (/^\d{0,2}$/.test(text)) {
            const wasAdding = text.length > month.length
            setMonth(text)
            if (wasAdding && text.length === 2) {
                dayInputRef.current?.focus()
            }
        }
    }

    // BLUEPRINT Add tags & note
    // BLUEPRINT Add recurring possibility

    useEffect(() => {
        nameInputRef.current?.focus()
    }, [])

    // If there is a date, show it
    useEffect(() => {
        if (editorExpense.entry_timestamp) {
            const date = new Date(editorExpense.entry_timestamp)

            if (!isNaN(date.getTime())) {
                setYear(String(date.getFullYear()))
                setMonth(String(date.getMonth() + 1).padStart(2, '0'))
                setDay(String(date.getDate()).padStart(2, '0'))
                setTime(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`)
                setDateOpen(true)
            }
        }
    }, [editorExpense.entry_timestamp])

    // If there is a note, show it
    useEffect(() => {
        if (editorExpense.note) {
            setNote(editorExpense.note)
            setNoteOpen(true)
        }
    }, [editorExpense.note])
    
    // If there is a context, show it
    useEffect(() => {
        if (editorExpense.context !== 'untracked') {
            setContextOpen(true)
        }
    }, [editorExpense.context])

    const handleSave = async () => {
        const isValidMoney = (s: string) => /^(\d+(\.\d{0,2})?)?$/.test(s)

        const isValidDate =
            year.length === 4 &&
            month.length <= 2 &&
            day.length <= 2 &&
            year &&
            month &&
            day

        let entry_timestamp: string | undefined

        if (isValidDate) {
            const paddedMonth = month.padStart(2, '0')
            const paddedDay = day.padStart(2, '0')
            const datePart = `${year}-${paddedMonth}-${paddedDay}`
            const raw = time ? `${datePart}T${time}:00` : `${datePart}T00:00:00`
            const date = new Date(raw)
            if (isNaN(date.getTime())) {
                setError('Invalid date (YYYY-MM-DD)')
                return
            }
            entry_timestamp = date.toISOString()
        } else if (year || month || day) {
            // Incomplete date — block save
            setError('Invalid date (YYYY-MM-DD)')
            return
        }

        // Num check
        if (!isValidMoney(amountStr)) {
            setError('Total is not a number!')
            return
        }

        try {
            setError('')
            setLoading(true)
            await updateExpenseEntryWithStore({
                newExpense: {
                    ...editorExpense,
                    entry_timestamp: entry_timestamp ?? new Date().toISOString(),
                    note: note ?? undefined,
                    amount: Number(amountStr),
                    ...(note ? { note } : {})
                }
            })
            setIsOpen(false)
            setEditorExpense(emptyExpenseEntry)
        } catch (error) {
            const msg = getErrorMessage(error)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            setError('')
            setLoading(true)
            await deleteExpenseEntryWithStore(id)
            setIsOpen(false)
            setEditorExpense(emptyExpenseEntry)
        } catch (error) {
            const msg = getErrorMessage(error)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <HalfSheet onClose={() => reset()}>
            {error && <Text style={globalStyles.errorMessage}>{error}</Text>}

            <View>
                <Text>Expense Name</Text>
                <TextInput
                    ref={nameInputRef}
                    value={editorExpense.name}
                    onChangeText={(value) => {
                        setEditorExpense((prev) => ({ ...prev, name: value }))}
                    }
                    returnKeyType="done"
                    onSubmitEditing={() => {
                        // BLUEPRINT: Focus next field
                    }}
                />
            </View>
            
            <View>
                <Text>Total</Text>
                <TextInput
                    ref={amountInputRef}
                    value={amountStr}
                    placeholder="$0.00"
                    onChangeText={(val) => setAmountStr(val)}
                    keyboardType="decimal-pad"
                />
            </View>

            {(!noteOpen || !contextOpen || !dateOpen) && (
                <View style={styles.additionsContainer}>
                    {!contextOpen && (
                        <Button
                            text='+ Context'
                            color='white'
                            size="small"
                            layout="fit"
                            onPress={handleTagsOpen}
                        />
                    )}
                    {!dateOpen && (
                        <Button
                            text='+ Custom Date'
                            color='white'
                            size="small"
                            layout="fit"
                            onPress={handleDateOpen}
                        />
                    )}
                    {!noteOpen && (
                        <Button
                            text='+ Note'
                            color='white'
                            size="small"
                            layout="fit"
                            onPress={handleOpenNote}
                        />
                    )}
                </View>
            )}

            
            {contextOpen && (
                <View>
                    <Text>Context</Text>
                    <View style={styles.contextButtons}>
                        <Button
                            text='untracked'
                            color={(editorExpense.context === 'untracked') ? 'gray': 'white'}
                            size="small"
                            layout="fit"
                            onPress={() => setEditorExpense(prev => ({ ...prev, context: 'untracked' })) }
                        />
                        <Button
                            text='personal'
                            color={(editorExpense.context === 'personal') ? 'gray': 'white'}
                            size="small"
                            layout="fit"
                            onPress={() => setEditorExpense(prev => ({ ...prev, context: 'personal' })) }
                        />
                        <Button
                            text='business'
                            color={(editorExpense.context === 'business') ? 'gray': 'white'}
                            size="small"
                            layout="fit"
                            onPress={() => setEditorExpense(prev => ({ ...prev, context: 'business' })) }
                        />
                        <Button
                            text='x'
                            color='white'
                            size="small"
                            layout="fit"
                            onPress={handleTagsClose}
                        />
                    </View>
                </View>
            )}

            {dateOpen && (
                <View>
                    <Text>Date</Text>
                    <View style={styles.dateContainer}>
                        <View style={styles.dateInputs}>
                            <TextInput
                                style={styles.yearInput}
                                ref={yearInputRef}
                                placeholder="YYYY" 
                                keyboardType="number-pad"
                                value={year}
                                onChangeText={handleYearChange}
                                maxLength={4}
                            />
                            <TextInput
                                style={styles.monthInput}
                                ref={monthInputRef}
                                placeholder="MM"
                                keyboardType="number-pad"
                                value={month}
                                onChangeText={handleMonthChange}
                                maxLength={2}
                            />
                            <TextInput
                                style={styles.dayInput}
                                ref={dayInputRef}
                                placeholder="DD"
                                keyboardType="number-pad"
                                value={day}
                                onChangeText={setDay}
                                maxLength={2}
                            />
                        </View>
                        <Button
                            text="x"
                            layout="fit"
                            size="small"
                            color="white"
                            onPress={handleDateClose}
                        />
                    </View>
                </View>
            )}

            {noteOpen && (
                <View>
                    <Text>Note</Text>
                    <View style={styles.noteContainer}>
                        <TextInput
                            ref={noteInputRef}
                            value={note}
                            onChangeText={setNote}
                            style={styles.noteInput}
                        />
                        <Button
                            text='x'
                            layout="fit"
                            size="small"
                            color="white"
                            onPress={handleCloseNote}
                        />
                    </View>
                </View>
            )}

            <Button
                text={loading
                    ? 'Loading...'
                    : 'Save'
                }
                layout="fill"
                color="dark"
                onPress={() => handleSave()}
            />

            {editorExpense.id && (
                    <Pressable
                        style={styles.deleteButton}
                        onPress={() => handleDelete(editorExpense.id)}
                    >
                        <Ionicons name="trash-outline" size={24} color="#666666" />
                    </Pressable>
            )}
        </HalfSheet>
    )
}