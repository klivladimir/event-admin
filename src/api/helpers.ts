export function jsonToFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  for (const key in data) {
    // Handle nested objects by stringifying them
    if (data[key] !== null && typeof data[key] === 'object' && !(data[key] instanceof File)) {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  }

  return formData;
}
