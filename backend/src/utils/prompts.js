/**
 * Prompt templates for Claude AI content generation
 */

export const PROMPTS = {

  /**
   * Generate a summary of study notes
   */
  summarize: (noteContent) => ({
    system: 'Eres un asistente educativo experto en resumir apuntes académicos de forma clara, concisa y estructurada. Tu objetivo es ayudar a estudiantes a comprender y retener los conceptos clave.',
    user: `Analiza los siguientes apuntes y genera un resumen estructurado en español.

APUNTES:
${noteContent}

Genera un resumen que incluya:
- **Conceptos clave**: Los 3-5 puntos principales más importantes
- **Ideas secundarias**: Detalles relevantes que apoyan los conceptos clave
- **Conclusión**: Una síntesis breve que conecte todo

Formato en Markdown con encabezados y bullet points. Sé claro y directo.`
  }),

  /**
   * Generate flashcards for memorization
   */
  flashcards: (noteContent) => ({
    system: 'Eres un experto en crear tarjetas de estudio (flashcards) efectivas para memorización. Las flashcards deben ser concisas, claras y enfocadas en un solo concepto por tarjeta.',
    user: `A partir de estos apuntes, genera 8-10 flashcards de calidad en formato JSON.

APUNTES:
${noteContent}

Criterios para las flashcards:
- Cada tarjeta debe enfocarse en UN solo concepto
- La pregunta debe ser clara y específica
- La respuesta debe ser concisa pero completa
- Varía la dificultad (fácil, medio, difícil)
- Incluye conceptos clave, definiciones, y relaciones importantes

Formato de respuesta (JSON array):
[
  {
    "front": "Pregunta o concepto a recordar",
    "back": "Respuesta o definición completa",
    "difficulty": "easy|medium|hard"
  }
]

IMPORTANTE: Responde SOLO con el JSON array, sin texto adicional antes o después.`
  }),

  /**
   * Generate a multiple choice quiz
   */
  quiz: (noteContent) => ({
    system: 'Eres un profesor experimentado en crear exámenes de opción múltiple que evalúan comprensión real, no solo memorización. Las preguntas deben ser desafiantes pero justas.',
    user: `Genera un quiz de 5 preguntas de opción múltiple basado en estos apuntes.

APUNTES:
${noteContent}

Criterios para el quiz:
- 5 preguntas que cubran diferentes aspectos del contenido
- Cada pregunta debe tener 4 opciones (A, B, C, D)
- Solo UNA opción correcta por pregunta
- Las opciones incorrectas deben ser plausibles (no obvias)
- Incluye una explicación de por qué la respuesta es correcta
- Varía el tipo de preguntas: definiciones, aplicación, análisis

Formato de respuesta (JSON array):
[
  {
    "question": "Texto de la pregunta",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctAnswer": 0,
    "explanation": "Explicación de por qué esta respuesta es correcta y por qué las demás son incorrectas"
  }
]

El campo "correctAnswer" es el índice (0-3) de la opción correcta.

IMPORTANTE: Responde SOLO con el JSON array, sin texto adicional antes o después.`
  })
};

/**
 * Validate note content length
 * @param {string} content - Note content
 * @param {number} maxLength - Maximum length in characters
 * @returns {boolean}
 */
export const validateContentLength = (content, maxLength = 50000) => {
  if (!content || content.trim().length === 0) {
    throw new Error('Note content cannot be empty');
  }

  if (content.length > maxLength) {
    throw new Error(`Note content is too long (${content.length} chars). Maximum is ${maxLength} characters.`);
  }

  return true;
};
