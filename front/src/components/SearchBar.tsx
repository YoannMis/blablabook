import { Button, HStack, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';

interface SearchBarProps {
  searchValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClear?: () => void;
  placeholder?: string;
}

const SearchBar = ({
  searchValue,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Rechercher par mot-clé, auteur...',
}: SearchBarProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <InputGroup
      endElement={
        <HStack gap={1} paddingInline={0}>
          {searchValue && (
            <Button aria-label="Clear search" variant="plain" onClick={onClear} color="brown.600">
              Effacer
            </Button>
          )}
          <IconButton aria-label="Search book" size="md" onClick={onSubmit} color="brown.600">
            <LuSearch />
          </IconButton>
        </HStack>
      }
    >
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
    </InputGroup>
  );
};

export default SearchBar;
