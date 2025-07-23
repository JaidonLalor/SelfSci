# FoodEntryEditor

FoodEntryEditor.tsx is only the form.
It handles its own state internally.

It is then wrapped with FoodEditorForm, or FoodPresetEditor, for the different submit / delete logic.

Transforming occurs on form initialization and payload submission.
This is because TextInputs can only be strings, but the local store and database expect numbers.