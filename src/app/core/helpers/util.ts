// Save export file
export function saveFile(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Calculate Age
export function calculateAge(birthTimestamp: number): number {
  const birthDate = new Date(birthTimestamp);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust age if birth month and day are after today's date
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export function setIfExists<T>(key: keyof T, value: unknown): Partial<T> {
  return value ? ({ [key]: value } as Partial<T>) : {};
}


/**
 * Converts a date string or Date object into 'yyyy-MM-dd' format
 * using Angular's DatePipe — ideal for input[type="date"].
 *
 * @param input - A date string or Date object (2022-10-31T00:00:00.000+0000)
 * @returns formatted string in 'yyyy-MM-dd' format, or '' if invalid
 */
export function formatDateYYYYMMDD(input: string | Date): string {
  if (!input) return '';

  const pipe = new DatePipe('en-US');
  const formatted = pipe.transform(input, 'yyyy-MM-dd');
  return formatted || '';
}

// Get last 100 years list
export function getYears(): number[] {
  const currentYear = new Date().getFullYear() - 10;  
  return Array.from({ length: 100 }, (_, i) => currentYear + i);
}

