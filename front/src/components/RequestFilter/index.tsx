import BasicInput from "../BasicInput";
import SearchBar from "../SearchBar";

import { ButtonsContainer, Container, ContainerTitle, FilterContainer } from "./styles";
import { IRequestFilter } from "./types";

import ActionText from "../ActionText";
import GenericButton from "../GenericButton";

export default function RequestFilter({
  requests,
  selectedTag,
  setSelectedTag,
  plate,
  setPlate,
  name,
  nameField = true,
  setName,
  hasBorder = true,
  onSearch,
  onClearFilters
}: IRequestFilter) {

  const tags = {
    options: ["Selo de Serviço", "Liberação Eventual", "Credencial Provisória"],
    resetOption: "Qualquer"
  };

  const onChangePlate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value);
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSearch = () => {
    const filters = {
      name: name.trim(),
      plate: plate.trim(),
      state: selectedTag
    };
    
    onSearch?.(filters);
  };

  const handleClearFilters = () => {
    setSelectedTag("");
    setPlate("");
    setName("");
    
    onClearFilters?.();
  };

  const inputsWidth = "298px";
  const containerWidth = inputsWidth;
  const inputFontSize = "1em"; // Converted from 16px
  const titleFontSize = "1.125em"; // Converted from 18px

  return (
    <Container $width={containerWidth} $hasBorder={hasBorder}>
      <ContainerTitle>Filtros</ContainerTitle>

      <FilterContainer>


      {nameField ? (
        <BasicInput
          value={name}
          onChange={onChangeName}
          $width={inputsWidth}
          $fontSize={inputFontSize}
          $titleFontSize={titleFontSize}
          placeholder="Pesquise aqui"
          title="Pesquise por Nome"
          required={false}
          $inputType="Secundário"
        />) : null
      }

        <BasicInput
          value={plate}
          onChange={onChangePlate}
          $width={inputsWidth}
          $fontSize={inputFontSize}
          $titleFontSize={titleFontSize}
          placeholder="Pesquise aqui"
          title="Placa"
          required={false}
          $inputType="Secundário"
        />

        <SearchBar
          query={selectedTag}
          setQuery={setSelectedTag}
          options={tags.options}
          resetOption={tags.resetOption}
          width={inputsWidth}
          fontSize={inputFontSize}
          titleFontSize={titleFontSize}
          placeholder="Selecione o Tipo de Selo"
          title="Tipo de Selo"
          required={false}
          readOnly={false}
          inputType="Secundário"
        />

      </FilterContainer>

      <ButtonsContainer $width={inputsWidth}>
        <GenericButton 
          flexStatus="none"
          width="100%" 
          height="50px"
          content="Buscar" 
          onClick={handleSearch}
          fontSize="1.125em"
          fontWeight="900"
          buttonType="Red"
        />
        <ActionText 
          width="100%" 
          fontSize="1.125em" 
          onClick={handleClearFilters} 
          textColor="#000000" 
          underlineOnHover
        >
          Limpar Filtros
        </ActionText>
      </ButtonsContainer>
    </Container>
  );
}