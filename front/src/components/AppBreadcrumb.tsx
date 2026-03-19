// components/AppBreadcrumb.tsx
import { Link as RouterLink } from 'react-router';
import { Breadcrumb } from '@chakra-ui/react';

export interface BreadcrumbItem {
  label?: string;
  to?: string;
}

const AppBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <Breadcrumb.Root>
    <Breadcrumb.List>
      {items.map(({ label, to }, index) => {
        const isLast = index === items.length - 1;
        return (
          <Breadcrumb.Item key={index}>
            {isLast ? (
              <Breadcrumb.CurrentLink>{label}</Breadcrumb.CurrentLink>
            ) : (
              <Breadcrumb.Link as={RouterLink} {...(to ? { to } : {})} mr={1}>
                {label}
              </Breadcrumb.Link>
            )}
            {!isLast && <Breadcrumb.Separator />}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb.List>
  </Breadcrumb.Root>
);

export default AppBreadcrumb;
