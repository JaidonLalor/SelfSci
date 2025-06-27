import { Pressable, Text } from "react-native";
import { colorVariants, sizeVariants, layoutVariants } from './Button.styles'

type Props = {
    text: string
    color?: 'gray' | 'white'
    size?: 'medium' | 'small'
    layout?: 'fill' | 'fit'
    disabled?: boolean
    onPress: () => void
}

//BLUEPRINT add disabled state

export default function Button({ text, onPress, color = 'gray', size = 'medium', layout = 'fit', disabled = false }: Props) {

    return (
        <Pressable
            style={[
                sizeVariants[size],
                colorVariants[color],
                layoutVariants[layout],
                { alignItems: 'center', justifyContent: 'center' },
            ]}
            onPress={onPress}
        >
            <Text style={[
                colorVariants[color],
                sizeVariants[size]
            ]}>{text}</Text>
        </Pressable>
    )
}