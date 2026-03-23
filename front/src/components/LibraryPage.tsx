import { PageLayout } from './layouts/PageLayout';
import MobileMenu from './MobileMenu';

import homeImage from '../assets/homePageImage.jpg';

const LibraryPage = () => {
  return (
    // header
    // search bar
    /* Tab Menu
     * All books / Collections
     */
    /* Books list
     * Book cover with notes
     * Book title
     * Book author
     * dot menu with:
     * - Modify
     * - Remove
     * - See details
     */
    // App Menu
    <>
      <PageLayout imageSrc={homeImage} imagePosition="top" imageSize="25%">
        <MobileMenu />
      </PageLayout>
    </>
  );
};

export default LibraryPage;
