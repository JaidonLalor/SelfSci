import { forwardRef } from 'react'
import { TextInput as ReactNativeTextInput, TextInputProps } from 'react-native'
import { styles } from './TextInput.styles'

type Props = TextInputProps

const TextInput = forwardRef<ReactNativeTextInput, Props>(
    function TextInput({style, ...otherProps}, ref) {

        return (
            <ReactNativeTextInput
                ref={ref}
                style={[styles.textInput, style]}
                {...otherProps}
            />
        )
    }
)

export default TextInput