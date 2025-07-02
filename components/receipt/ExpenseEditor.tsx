import Button from "@/shared/Button";
import HalfSheet from "@/shared/HalfSheet";
import TextInput from "@/shared/TextInput";
import { useExpenseEditor } from "@/stores/expense_editor";
import { useRef } from "react";
import { View, Text, TextInput as RNTextInput, Keyboard } from "react-native";
import { styles } from "./ExpenseEditor.styles";
import { getErrorMessage } from "@/lib/utils";
import { globalStyles } from "@/shared/globalStyles";
import { updateExpenseEntryWithStore } from "@/actions/expenses";

export default function ExpenseEditor() {
    const { editorExpense, setEditorExpense, loading, setLoading, setIsOpen, error, setError } = useExpenseEditor()
    const nameInputRef = useRef<RNTextInput>(null)
    const amountInputRef = useRef<RNTextInput>(null)

    // BLUEPRINT Focus first field on open
    // BLUEPRINT Add tags & note
    // BLUEPRINT Add recurring possibility

    const handleSave = async () => {
        try {
            setError('')
            setLoading(true)
            await updateExpenseEntryWithStore({ newExpense: editorExpense })
            setIsOpen(false)
        } catch (error) {
            const msg = getErrorMessage(error)
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <HalfSheet onClose={() => setIsOpen(false)}>
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
                    value={editorExpense.amount?.toString() ?? ''}
                    onChangeText={(val) => {
                        const cleaned = val
                            .replace(/[^0-9.]/g, '')
                            .replace(/(\..*)\./g, '$1')

                        // @ts-expect-error –– we know this is a string for now
                        setEditorExpense(prev => ({ ...prev, amount: cleaned }))
                    }}
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
        </HalfSheet>
    )
}