// API service for fetching quiz questions from Open Trivia DB
const API_BASE_URL = 'https://opentdb.com/api.php';

// Category mapping for Open Trivia DB
export const CATEGORIES = {
  '': 'Any Category',
  '9': 'General Knowledge',
  '10': 'Entertainment: Books',
  '11': 'Entertainment: Film',
  '12': 'Entertainment: Music',
  '15': 'Entertainment: Video Games',
  '17': 'Science & Nature',
  '18': 'Science: Computers',
  '19': 'Science: Mathematics',
  '20': 'Mythology',
  '21': 'Sports',
  '22': 'Geography',
  '23': 'History',
  '27': 'Animals'
};

// Difficulty levels
export const DIFFICULTIES = {
  'easy': 'Easy',
  'medium': 'Medium',
  'hard': 'Hard'
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Decode HTML entities in strings
 */
const decodeHtmlEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

/**
 * Transform API response to our app's question format
 */
const transformQuestion = (apiQuestion, index) => {
  // Combine correct and incorrect answers
  const allAnswers = [
    apiQuestion.correct_answer,
    ...apiQuestion.incorrect_answers
  ];
  
  // Shuffle the answers
  const shuffledAnswers = shuffleArray(allAnswers);
  
  // Find the index of the correct answer in shuffled array
  const correctAnswerIndex = shuffledAnswers.findIndex(
    answer => answer === apiQuestion.correct_answer
  );
  
  return {
    id: index + 1,
    question: decodeHtmlEntities(apiQuestion.question),
    options: shuffledAnswers.map(answer => decodeHtmlEntities(answer)),
    correctAnswerIndex,
    difficulty: apiQuestion.difficulty,
    category: apiQuestion.category
  };
};

/**
 * Fetch quiz questions from Open Trivia DB API
 */
export const fetchQuizQuestions = async (difficulty = 'easy', category = '', amount = 10) => {
  try {
    // Build API URL
    const params = new URLSearchParams({
      amount: amount.toString(),
      difficulty,
      type: 'multiple' // Only multiple choice questions
    });
    
    // Add category if specified
    if (category && category !== '') {
      params.append('category', category);
    }
    
    const url = `${API_BASE_URL}?${params.toString()}`;
    
    console.log('Fetching questions from:', url);
    
    // Make API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check API response code
    switch (data.response_code) {
      case 0:
        // Success
        break;
      case 1:
        throw new Error('No questions found for the specified criteria. Try different settings.');
      case 2:
        throw new Error('Invalid parameter in request.');
      case 3:
        throw new Error('Token not found.');
      case 4:
        throw new Error('Token empty.');
      case 5:
        throw new Error('Rate limit exceeded. Please wait before making another request.');
      default:
        throw new Error('Unknown API error occurred.');
    }
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No questions received from the API.');
    }
    
    // Transform questions to our format
    const transformedQuestions = data.results.map((question, index) => 
      transformQuestion(question, index)
    );
    
    console.log('Successfully fetched and transformed questions:', transformedQuestions.length);
    return transformedQuestions;
    
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    // Re-throw the error with context
    throw new Error(error.message || 'Failed to fetch quiz questions. Please try again.');
  }
};

/**
 * Get available categories from API
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch('https://opentdb.com/api_category.php');
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    
    // Transform to our format
    const categories = { '': 'Any Category' };
    data.trivia_categories.forEach(cat => {
      categories[cat.id.toString()] = cat.name;
    });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories if API fails
    return CATEGORIES;
  }
};

/**
 * Validate API connection
 */
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}?amount=1&type=multiple`);
    return response.ok;
  } catch (error) {
    return false;
  }
};