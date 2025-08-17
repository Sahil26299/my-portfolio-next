interface keysType {
  SUBMIT_USER_PROMPT_FROM_OUTSIDE: string;
  CURRENT_CHATS_DONE: string;
}

export const keys: keysType = {
  SUBMIT_USER_PROMPT_FROM_OUTSIDE: "submit_user_prompt_from_skills",
  CURRENT_CHATS_DONE: "current_chats_done",
};

// Function to set a value in sessionStorage
export const setSessionStorageItem = (key: string, value: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("sessionStorageUpdated"));
  } catch (error) {
    console.error(`Error setting item in sessionStorage: ${error}`);
  }
};

// Function to get a value from sessionStorage
export const getSessionStorageItem = (key: string) => {
  try {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error(`Error getting item from sessionStorage: ${error}`);
    return null;
  }
};

// Function to remove an item from sessionStorage
export const removeSessionStorageItem = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from sessionStorage: ${error}`);
  }
};
