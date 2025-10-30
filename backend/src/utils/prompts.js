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
   * Generate a mixed quiz (multiple choice + true/false)
   */
  quiz: (noteContent) => ({
    system: 'Eres un profesor experimentado en crear exámenes que evalúan comprensión real, no solo memorización. Las preguntas deben ser desafiantes pero justas.',
    user: `Genera un quiz de 8 preguntas variadas basado en estos apuntes.

APUNTES:
${noteContent}

Criterios para el quiz:
- 5 preguntas de opción múltiple con 4 opciones (A, B, C, D)
- 3 preguntas de verdadero/falso
- Solo UNA opción correcta por pregunta
- Las opciones incorrectas deben ser plausibles (no obvias)
- Incluye una explicación de por qué la respuesta es correcta
- Varía el tipo de preguntas: definiciones, aplicación, análisis
- **MUY IMPORTANTE**: La respuesta correcta debe estar en DIFERENTES posiciones. NO pongas todas las respuestas correctas en la opción A o en la misma posición. Distribuye las respuestas correctas aleatoriamente entre las opciones (0, 1, 2, 3 para múltiple choice y 0, 1 para verdadero/falso).

Formato de respuesta (JSON array):
[
  {
    "type": "multiple",
    "question": "Texto de la pregunta",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctAnswer": 0,
    "explanation": "Explicación detallada"
  },
  {
    "type": "truefalse",
    "question": "Afirmación para evaluar",
    "options": ["Verdadero", "Falso"],
    "correctAnswer": 0,
    "explanation": "Explicación de por qué es verdadero o falso"
  }
]

El campo "correctAnswer" es el índice de la opción correcta (0-3 para multiple, 0-1 para truefalse).
El campo "type" debe ser "multiple" o "truefalse".

RECUERDA: Asegúrate de que las respuestas correctas estén distribuidas variadamente. Por ejemplo:
- Pregunta 1: correctAnswer: 2
- Pregunta 2: correctAnswer: 0
- Pregunta 3: correctAnswer: 3
- Pregunta 4: correctAnswer: 1
- etc.

IMPORTANTE: Responde SOLO con el JSON array, sin texto adicional antes o después.`
  }),

  /**
   * Generate short answer questions
   */
  shortAnswer: (noteContent) => ({
    system: 'Eres un profesor que crea preguntas de desarrollo para evaluar comprensión profunda. Las preguntas deben requerir respuestas elaboradas, no solo definiciones.',
    user: `Genera 5 preguntas de respuesta corta basadas en estos apuntes.

APUNTES:
${noteContent}

Criterios para las preguntas:
- Requieren respuestas de 2-4 oraciones (50-100 palabras)
- Evalúan comprensión profunda, no solo memorización
- Incluyen verbos como: explica, compara, analiza, describe, justifica
- Cada pregunta debe incluir una respuesta modelo de referencia
- Varía la dificultad entre las preguntas

Formato de respuesta (JSON array):
[
  {
    "question": "Pregunta que requiere desarrollo",
    "rubric": "Criterios de evaluación para la respuesta",
    "modelAnswer": "Respuesta modelo de referencia (2-4 oraciones)"
  }
]

IMPORTANTE: Responde SOLO con el JSON array, sin texto adicional antes o después.`
  }),

  /**
   * Grade a short answer response
   */
  gradeShortAnswer: (question, rubric, modelAnswer, studentAnswer) => ({
    system: 'Eres un profesor justo que evalúa respuestas de estudiantes. Proporciona feedback constructivo y específico.',
    user: `Evalúa la siguiente respuesta de estudiante.

PREGUNTA:
${question}

CRITERIOS DE EVALUACIÓN:
${rubric}

RESPUESTA MODELO:
${modelAnswer}

RESPUESTA DEL ESTUDIANTE:
${studentAnswer}

Evalúa la respuesta del estudiante y proporciona:
1. Puntuación (0-100)
2. Feedback específico sobre qué está bien y qué falta
3. Sugerencias para mejorar

Formato de respuesta (JSON):
{
  "score": 85,
  "feedback": "Tu respuesta identifica correctamente los conceptos principales...",
  "suggestions": "Para mejorar, podrías incluir más detalles sobre..."
}

IMPORTANTE: Responde SOLO con el JSON object, sin texto adicional antes o después.`
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
