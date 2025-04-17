/**
 * Document Processor Service
 * 
 * This service handles processing different types of documents (images, PDFs, etc.)
 * for use with AI services.
 */

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Supported file types
 */
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const SUPPORTED_DOCUMENT_TYPES = ['application/pdf', 'text/plain'];
export const SUPPORTED_FILE_TYPES = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_DOCUMENT_TYPES];

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Processed file result
 */
export interface ProcessedFile {
  type: 'image' | 'text';
  dataUrl?: string;
  text?: string;
  originalFile: File;
}

/**
 * Validates a file for size and type
 * @param file The file to validate
 * @returns Validation result
 */
export const validateFile = (file: File): FileValidationResult => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported. Supported types: ${SUPPORTED_FILE_TYPES.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Converts a file to a data URL
 * @param file The file to convert
 * @returns Promise with the data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Reads a text file
 * @param file The file to read
 * @returns Promise with the text content
 */
export const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

/**
 * Processes a file for use with AI services
 * @param file The file to process
 * @returns Promise with the processed file
 */
export const processFile = async (file: File): Promise<ProcessedFile> => {
  // Validate the file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Process based on file type
  if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    // Process image file
    const dataUrl = await fileToDataUrl(file);
    return {
      type: 'image',
      dataUrl,
      originalFile: file
    };
  } else if (file.type === 'application/pdf') {
    // For PDFs, we'll just use the data URL for now
    // In a real implementation, we would extract text from the PDF
    const dataUrl = await fileToDataUrl(file);
    return {
      type: 'text',
      dataUrl,
      text: 'PDF content extraction not implemented yet',
      originalFile: file
    };
  } else if (file.type === 'text/plain') {
    // Process text file
    const text = await readTextFile(file);
    return {
      type: 'text',
      text,
      originalFile: file
    };
  }

  // This should never happen due to validation, but TypeScript needs it
  throw new Error(`Unsupported file type: ${file.type}`);
};

/**
 * Processes multiple files for use with AI services
 * @param files The files to process
 * @returns Promise with the processed files
 */
export const processFiles = async (files: File[]): Promise<ProcessedFile[]> => {
  return Promise.all(files.map(processFile));
};
