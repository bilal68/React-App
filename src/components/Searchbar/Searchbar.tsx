import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./Searchbar.css";

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
}

function SearchBar({ placeholder, onChange }: SearchBarProps) {
  return (
    <div className="search-bar-container">
      <Input
        className="search-bar"
        placeholder={placeholder}
        allowClear
        prefix={<SearchOutlined style={{ color: "#fff", opacity: 0.8 }} />}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
