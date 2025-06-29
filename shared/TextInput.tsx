import { forwardRef } from 'react'
import { TextInput as ReactNativeTextInput, TextInputProps } from 'react-native'

type Props = TextInputProps

const TextInput = forwardRef<ReactNativeTextInput, Props>(
    function TextInput(props, ref) {
        return (
            <ReactNativeTextInput
                ref={ref}
                style={{
                    minHeight: 40,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                    fontSize: 16,
                    color: '#7E7E7E',
                    ...(props.style as object),
                }}
                {...props}
            />
        )
    }
)

export default TextInput