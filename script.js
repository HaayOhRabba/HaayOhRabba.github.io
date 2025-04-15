document.addEventListener('DOMContentLoaded', () => {
  // --- Dark/Light Mode Toggle ---
  const modeToggleButton = document.getElementById('modeToggle');
  const currentTheme = localStorage.getItem('theme');

  // Apply saved theme on load
  if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
      if(modeToggleButton) modeToggleButton.textContent = '☀️'; // Sun icon for dark mode
  } else {
      if(modeToggleButton) modeToggleButton.textContent = '🌙'; // Moon icon for light mode
  }

  if(modeToggleButton) {
      modeToggleButton.addEventListener('click', () => {
          document.body.classList.toggle('dark-mode');

          let theme = 'light';
          if (document.body.classList.contains('dark-mode')) {
              theme = 'dark';
              modeToggleButton.textContent = '☀️'; // Sun icon
          } else {
               modeToggleButton.textContent = '🌙'; // Moon icon
          }
          localStorage.setItem('theme', theme); // Save preference
      });
  }

  // --- Text Analyzer Logic ---
  const analyzeButton = document.getElementById('analyzeButton');
  const textInput = document.getElementById('textInput');
  const analysisResult = document.getElementById('analysisResult');

  // Only run analyzer logic if the elements exist (i.e., on analyzer.html)
  if (analyzeButton && textInput && analysisResult) {
      analyzeButton.addEventListener('click', () => {
          const text = textInput.value;
          analysisResult.textContent = 'Analyzing...'; // Provide immediate feedback

          // Use setTimeout to avoid blocking the UI thread for potentially large text
          setTimeout(() => {
              if (text.trim() === '') {
                  analysisResult.textContent = 'Please enter some text to analyze.';
                  return;
              }

              try {
                  const results = performAnalysis(text);
                  displayResults(results);
              } catch (error) {
                  console.error("Analysis error:", error);
                  analysisResult.textContent = "An error occurred during analysis. Please check the console.";
              }

          }, 50); // Short delay to allow UI update
      });
  }
});

// Function to perform the text analysis
function performAnalysis(text) {
  const analysis = {};

  // 1. Character Count (including spaces and newlines)
  analysis.charCount = text.length;

  // 2. Letter Count (alphabetic characters only)
  const letters = text.match(/[a-zA-Z]/g);
  analysis.letterCount = letters ? letters.length : 0;

  // 3. Space Count
  const spaces = text.match(/ /g);
  analysis.spaceCount = spaces ? spaces.length : 0;

  // 4. Word Count (simple split by whitespace)
  const words = text.trim().split(/\s+/);
  analysis.wordCount = words[0] === '' ? 0 : words.length; // Handle empty input case

  // Define lists for specific word types (case-insensitive matching)
  const pronouns = /\b(I|me|my|mine|we|us|our|ours|you|your|yours|he|him|his|she|her|hers|it|its|they|them|their|theirs)\b/gi;
  const prepositions = /\b(about|above|across|after|against|along|amid|among|around|at|before|behind|below|beneath|beside|between|beyond|but|by|concerning|despite|down|during|except|for|from|in|inside|into|like|near|of|off|on|onto|out|outside|over|past|regarding|since|through|throughout|to|toward|under|underneath|until|unto|up|upon|with|within|without)\b/gi;
  const indefiniteArticles = /\b(a|an)\b/gi;

  // 5. Pronoun Count
  const pronounMatches = text.match(pronouns);
  analysis.pronounCount = pronounMatches ? pronounMatches.length : 0;

  // 6. Preposition Count
  const prepositionMatches = text.match(prepositions);
  analysis.prepositionCount = prepositionMatches ? prepositionMatches.length : 0;

  // 7. Indefinite Article Count
  const articleMatches = text.match(indefiniteArticles);
  analysis.indefiniteArticleCount = articleMatches ? articleMatches.length : 0;

  return analysis;
}

// Function to display analysis results
function displayResults(results) {
  const analysisResult = document.getElementById('analysisResult');
  if (analysisResult) {
      analysisResult.textContent = `
Analysis Results:
-----------------
Total Characters: ${results.charCount}
Letter Count:     ${results.letterCount}
Space Count:      ${results.spaceCount}
Word Count:       ${results.wordCount}

Pronoun Count:           ${results.pronounCount}
Preposition Count:       ${results.prepositionCount}
Indefinite Article Count (a/an): ${results.indefiniteArticleCount}
      `;
  }
}

