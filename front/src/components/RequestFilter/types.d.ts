export interface IRequestFilter {
  requests: string[];
  selectedTag: string;
  setSelectedTag: (state: string) => void;
  plate: string;
  setPlate: (city: string) => void;
  name: string;
  setName: (name: string) => void;
  hasBorder?: boolean;
  onSearch?: (filters: { name: string; plate: string; state: string }) => void;
  onClearFilters?: () => void;
  nameField?: boolean;
}