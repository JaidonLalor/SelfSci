import { Platform } from "react-native";
import ReactNativeSlider from "@react-native-community/slider";

type SliderProps = {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
}

{/* BLUEPRINT: Style web slider to match ReactNative style */}

export default function Slider({ value, onChange, min, max, step }: SliderProps) {
    if (Platform.OS === 'web') return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ flex: 1 }}
        />  
    )
    
    return (
        <ReactNativeSlider
            style={{
                flex: 1,
                flexShrink: 1
            }}
            value={value}
            onValueChange={onChange}
            minimumValue={min}
            maximumValue={max}
            step={step}
            minimumTrackTintColor="#666666"
            maximumTrackTintColor="#B4B4B4"
            thumbTintColor="#666666"
        />
    )
}