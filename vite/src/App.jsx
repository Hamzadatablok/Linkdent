import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';

// auth provider
import { AppProvider } from './AppContext'; // تأكد من مطابقة مسار الملف

// ==============================|| APP ||============================== //

export default function App() {
  
  // --- Start of ID capture hook ---
  useEffect(() => {
    // Read the link and extract the ID from it
    const queryParams = new URLSearchParams(window.location.search);
    const locationId = queryParams.get('locationId');

    // If we find the ID, save it in memory for use by other pages
    if (locationId) {
      localStorage.setItem('ghl_location_id', locationId);
      console.log('Clinic ID captured successfully:', locationId);
    }
  }, []);
  // --- End of hook ---

  return (
    <ThemeCustomization>
      <NavigationScroll>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </NavigationScroll>
    </ThemeCustomization>
  );
}