"use client";

interface TextType {
  placeholder: string;
  onChange: (value: string) => void;
  label: string;
  value: number | string;
  type?: string;
}

const TextInput = ({ placeholder, onChange, label, value, type = "text" }: TextType) => {
  return (
    <div className="pt-2">
      <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>

      <input
        onChange={(e) => onChange(e.target.value)}
        type={type}
        id="first_name"
        value={value}
        placeholder={placeholder}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
  );
};

export default TextInput;
