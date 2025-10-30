import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import { callClaude } from '../services/claude.service.js';

const require = createRequire(import.meta.url);

// Mock DOMMatrix globally to prevent pdf-parse errors in Node.js environment
if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    }
  };
}

// Mock ImageData as well
if (typeof global.ImageData === 'undefined') {
  global.ImageData = class ImageData {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.data = new Uint8ClampedArray(width * height * 4);
    }
  };
}

// Mock Path2D
if (typeof global.Path2D === 'undefined') {
  global.Path2D = class Path2D {
    constructor() {}
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = path.join(__dirname, '../../uploads');

/**
 * Upload a file
 * POST /api/upload
 */
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Extract text from PDF
    let extractedText = null;
    let cleanedText = null;

    try {
      // Fix file permissions (in case it was created with wrong perms)
      try {
        fs.chmodSync(req.file.path, 0o644);
      } catch (permError) {
        console.log('⚠️ Could not set file permissions:', permError.message);
      }

      console.log(`📄 Reading PDF file: ${req.file.path}`);
      const dataBuffer = fs.readFileSync(req.file.path);
      console.log(`📦 Buffer size: ${dataBuffer.length} bytes`);

      // Load pdf-parse using require for compatibility
      const pdfParse = require('pdf-parse');

      // Configure pdf-parse to not use canvas (which causes DOMMatrix errors)
      const pdfData = await pdfParse(dataBuffer, {
        pagerender: (pageData) => {
          // Custom text renderer - just extract text content
          return pageData.getTextContent().then((textContent) => {
            return textContent.items.map(item => item.str).join(' ');
          });
        }
      });

      extractedText = pdfData.text;

      console.log(`✅ Extracted ${extractedText.length} characters from PDF`);
      console.log(`📊 PDF info: ${pdfData.numpages} pages`);

      if (extractedText.length === 0) {
        console.log('⚠️ WARNING: No text extracted from PDF. PDF may be image-based or encrypted.');
      } else {
        console.log(`📝 First 100 chars: ${extractedText.substring(0, 100)}`);
      }

      // Clean up the extracted text using Claude only if there's text
      if (extractedText && extractedText.length > 0) {
        try {
          console.log(`🤖 Cleaning extracted text with Claude...`);

          const cleanPrompt = `El siguiente texto fue extraído de un PDF y puede contener problemas de formato (saltos de línea incorrectos, espacios extras, etc.).

Tu tarea es limpiar y reformatear el texto para que sea legible y bien estructurado, manteniendo TODO el contenido original.

Instrucciones:
- Corrige saltos de línea incorrectos (une párrafos que fueron divididos artificialmente)
- Elimina espacios duplicados o innecesarios
- Mantén la estructura de títulos, listas y párrafos
- NO resumas ni omitas información
- NO agregues contenido nuevo
- Devuelve el texto limpio y formateado en Markdown

Texto extraído:
${extractedText}`;

          cleanedText = await callClaude(cleanPrompt, 'Eres un asistente que limpia y formatea texto extraído de PDFs. Tu única tarea es mejorar el formato sin modificar el contenido.', 'summary');

          console.log(`✅ Text cleaned: ${cleanedText.length} characters`);
        } catch (cleanError) {
          console.log(`⚠️ Text cleaning failed, using raw text:`, cleanError.message);
          cleanedText = extractedText; // Fallback to raw text
        }
      }
    } catch (pdfError) {
      console.error('❌ PDF text extraction failed:', pdfError.message);
      console.error('Error details:', pdfError);
      // Continue even if text extraction fails
    }

    // Return file information with cleaned extracted text
    const finalText = cleanedText || extractedText; // Use cleaned text if available, otherwise raw

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: `/api/upload/${req.file.filename}`,
          size: req.file.size,
          mimeType: req.file.mimetype,
          uploadedAt: new Date().toISOString(),
          extractedText: finalText, // Cleaned and formatted text
          extractedTextPreview: finalText ? finalText.substring(0, 200) : null, // Preview for UI
          rawTextLength: extractedText?.length || 0, // Original extraction length
          cleanedTextLength: cleanedText?.length || 0, // Cleaned text length
          wasCleaned: !!cleanedText // Whether text was cleaned by AI
        }
      }
    });
  } catch (error) {
    // Clean up file if error occurs
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    next(error);
  }
};

/**
 * Delete a file
 * DELETE /api/upload/:filename
 */
export const deleteFile = async (req, res, next) => {
  try {
    const { filename } = req.params;

    // Validate filename (prevent directory traversal)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }

    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get/download a file
 * GET /api/upload/:filename
 */
export const getFile = async (req, res, next) => {
  try {
    const { filename } = req.params;

    // Validate filename (prevent directory traversal)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }

    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};
