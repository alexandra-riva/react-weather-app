import { View, TextInput, Button, StyleSheet } from "react-native";

type CitySearchProps = {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  style?: any;  
};

export function CitySearch({ value, onChange, onSubmit, style }: CitySearchProps) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        placeholderTextColor="#ffffff" 
        value={value}
        onChangeText={onChange}
      />
      <Button 
        title="Search" 
        onPress={onSubmit}
        color="#ffffff"  
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 32,
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,  
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent", 
    color: "#ffffff",  
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",  
  },
});
