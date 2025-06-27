// utils/draftUtils.js

export const saveDraft = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadDraft = (key) => {
  const draft = localStorage.getItem(key);
  return draft ? JSON.parse(draft) : null;
};

export const clearDraft = (key) => {
  localStorage.removeItem(key);
};
