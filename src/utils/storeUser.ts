import { store } from '@/store/store';
import { setUserPayload } from '@/features/userPayload/userPayload.slice';

export const storeUser = async () => {
  const currentUser = store.getState().userPayload;

  // Safely check if user state is already stored
  if (currentUser?.brawlID && typeof currentUser.brawlID === 'string' && currentUser.brawlID.length > 0) {
    return currentUser;
  }
  
  // Get brawlID from API
  try {
    
    // Fetch user data directly from profile endpoint
    const response = await fetch('/api/profile');
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    console.log("passed in storeUser", data);
    //console.log('data: ', data);
    if (!data || !data.BrawlID) {
      throw new Error('User data not found');
    }

    
    
    // Dispatch action to update the Redux store
    store.dispatch(setUserPayload({
      brawlID: data.BrawlID || '',
      name: data.username || '',
      email: data.email || '',
      _id: data._id || '',
    }));

    return (data);
  } catch (error) {
    console.error('Error in storeUser:', error);
    return undefined;
  }
}