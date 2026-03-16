import { Button, Text, Box, HStack } from '@chakra-ui/react';

interface Category {
  id: number;
  name: string;
}

interface CategoriesListProps {
  categories: Category[];
  onSelectCategory: (categoryName: string) => void;
}

const CategoriesList = ({ categories, onSelectCategory }: CategoriesListProps) => {
  return (
    <Box>
      <Text fontWeight="bold" mb={2}>
        Catégories
      </Text>
      <HStack gap={3} overflowX="auto" paddingInline={2}>
        {categories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant="outline"
            onClick={() => onSelectCategory(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default CategoriesList;
