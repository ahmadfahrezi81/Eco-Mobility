import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { COLORS, styles } from "../../styles";

const InputWithLabel = ({
    text,
    value,
    onChangeText,
    placeholder = "",
    disabled = false,
    forPassword = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={{ gap: 5 }}>
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "500",
                    marginLeft: 5,
                }}
            >
                {text}
            </Text>
            <TextInput
                secureTextEntry={forPassword}
                autoCapitalize="none"
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                //some input required disabled outright.
                editable={!disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                    paddingVertical: 15,
                    paddingHorizontal: 15,
                    backgroundColor: disabled ? COLORS.GREY : COLORS.WHITE,
                    borderColor: isFocused ? COLORS.GREEN : COLORS.WHITE,
                    borderWidth: disabled ? 0 : 2,
                    borderRadius: 10,
                    fontSize: 16,
                }}
            />
        </View>
    );
};
export default InputWithLabel;
