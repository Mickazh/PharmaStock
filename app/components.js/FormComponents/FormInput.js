import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Colors from "../../Utils/Colors";

const FormInput = ({
  placeholder,
  inputFieldTitle,
  isSecureEntry,
  onChangeText,
  isEditable,
  defaultValue,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{inputFieldTitle}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !isEditable && styles.disabledInput,
          style,
        ]}
      >
        <TextInput
          value={defaultValue}
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={styles.input}
          secureTextEntry={isSecureEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={isEditable}
          placeholderTextColor={Colors.gris}
        />
      </View>
    </View>
  );
};

FormInput.defaultProps = {
  isSecureEntry: false,
  isEditable: true,
  defaultValue: null,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.vertFonce,
  },
  inputContainer: {
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 6, 
    paddingVertical: 0, 
    shadowColor: Colors.noir,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 45,
    fontSize: 14,
    color: Colors.noir,
  },
  inputFocused: {
    borderColor: Colors.vertFonce,
  },
  disabledInput: {
    backgroundColor: Colors.gris,
  },
});

export default FormInput;
