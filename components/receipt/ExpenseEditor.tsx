import Button from "@/shared/Button";
import HalfSheet from "@/shared/HalfSheet";
import TextInput from "@/shared/TextInput";
import { useExpenseEditor } from "@/stores/expense_editor";
import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput as RNTextInput, Keyboard, Pressable } from "react-native";
import { styles } from "./ExpenseEditor.styles";
import { getErrorMessage } from "@/lib/utils";
import { globalStyles } from "@/shared/globalStyles";
import { updateExpenseEntryWithStore } from "@/actions/expenses";
import { emptyExpenseEntry } from "@/lib/supabase/expense";
import { Ionicons } from "@expo/vector-icons";
import { deleteExpenseEntryWithStore } from '@/actions/expenses'

export default function ExpenseEditor() {
    const { editorExpense, setEditorExpense, loading, setLoading, setIsOpen, error, setError, reset } = useExpenseEditor()
    const [amountStr, setAmountStr] = useState<string>( editorExpense.amount ? editorExpense.amount.toString() : '' )

    const nameInputRef = useRef<RNTextInput>(null)
    const amountInputRef = useRef<RNTextInput>(null)

    // BLUEPRINT Focus first field on open
    // BLUEPRINT Add tags & note
    // BLUEPRINT Add recurring possibility

    useEffect(() => {
        nameInputRef.current?.focus()
    }, [])

    const handleSave = async () => {
        const isValidMoney = (s: string) => /^(\d+(\.\d{0,2})?)?$/.test(s)

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
                    amount: Number(amountStr)
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
                </View>
            </View>

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