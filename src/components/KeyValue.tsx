import React from "react";
import { Text } from "@shopify/polaris";

interface KeyValueProps {
  label: string;
  value: React.ReactNode;
}

const KeyValue: React.FC<KeyValueProps> = ({ label, value }) => {
  return (
    <Text variant="bodyMd" as="p">
      <strong>{label}:</strong> {value}
    </Text>
  );
};

export default KeyValue;
