document.addEventListener('DOMContentLoaded', () => {

  // --- Dark/Light Mode Toggle ---
  const modeToggle = document.getElementById("modeToggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Function to apply the theme
  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.remove("light-mode");
      if (modeToggle) modeToggle.textContent = "🌙";
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add("light-mode");
      if (modeToggle) modeToggle.textContent = "☀️";
      localStorage.setItem('theme', 'light');
    } // <-- Added missing brace
  } // <-- Added missing brace

  // Initialize theme based on saved preference or OS setting
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme === 'dark');
  } else {
    setTheme(prefersDarkScheme.matches);
  } // <-- Added missing brace

  // Add event listener for the toggle button
  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      const isCurrentlyLight = document.body.classList.contains("light-mode");
      setTheme(!isCurrentlyLight); // Toggle the theme
    }); // <-- Added missing brace
  } // <-- Added missing brace

  // Optional: Listen for changes in OS theme preference
  prefersDarkScheme.addEventListener("change", (e) => {
    // Only change if the user hasn't manually set a theme via the button
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    } // <-- Added missing brace
  }); // <-- Added missing brace

  // --- Q2: Event Logging (Click & View) ---
  function getElementDescription(element) {
    if (!element) return 'unknown';

    const tagName = element.tagName.toLowerCase();
    let description = tagName; // Default to tag name

    if (element.id) {
      description += `#${element.id}`;
    } else if (element.classList.length > 0) {
      description += `.${element.classList[0]}`; // Use first class
    }

    // Add more specific info based on tag
    switch (tagName) {
      case 'a':
        description += ` (href: ${element.getAttribute('href') || 'N/A'})`;
        break;
      case 'button':
        description += ` (text: ${element.textContent.trim().slice(0, 20) || 'N/A'})`;
        break;
      case 'img':
        description += ` (src: ${element.getAttribute('src')?.split('/').pop() || 'N/A'})`; // Just filename
        break;
      case 'input':
      case 'textarea':
      case 'select':
        description += ` (name: ${element.name || 'N/A'})`;
        break;
      case 'section':
         const heading = element.querySelector('h1, h2, h3');
         description += ` (heading: ${heading ? heading.textContent.trim().slice(0,30) : 'N/A'})`;
         break;
      default:
        // Use the generated ID/class description
        break;
    } // <-- Added missing brace for switch
    return description;
  } // <-- Added missing brace for function

  function logEvent(type, element) {
    const timestamp = new Date().toLocaleString();
    const description = getElementDescription(element);
    // Format: Timestamp_of_click , type of event (click/view) , event object (description)
    console.log(`${timestamp}, ${type}, ${description}`);
  } // <-- Added missing brace for function

  // Log Clicks on specific interactive elements
  document.body.addEventListener("click", (e) => {
    const targetElement = e.target.closest('a, button, input, select, textarea, img'); // Target specific elements
    if (targetElement) {
      logEvent("click", targetElement);
    } // <-- Added missing brace
  }); // <-- Added missing brace

  // Log Section Views (and potentially other specified elements)
  const elementsToObserve = document.querySelectorAll('section, header, footer, nav, .card, .profile-image'); // Define elements to observe for views
  if (elementsToObserve.length > 0) {
    const viewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!entry.target.dataset.viewLogged) { // Log only once per session unless reset
            logEvent("view", entry.target);
            entry.target.dataset.viewLogged = 'true';
            // Optional: Reset log flag after a delay if needed for re-logging views
            // setTimeout(() => { delete entry.target.dataset.viewLogged; }, 60000);
          } // <-- Added missing brace for inner if
        } else {
            // Optionally reset the flag when it goes out of view
             delete entry.target.dataset.viewLogged;
        } // <-- Added missing brace for else
      }); // <-- Added missing brace for forEach
    }, { threshold: 0.5 }); // Log when 50% visible

    elementsToObserve.forEach(el => viewObserver.observe(el));
  } // <-- Added missing brace for outer if

  // --- Active Navigation Link Highlighting ---
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href')?.split("/").pop() || "index.html";
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    } // <-- Added missing brace
  }); // <-- Added missing brace

  // --- Q3: Text Analyzer Logic ---
  const textInput = document.getElementById('textInput');
  const analyzeButton = document.getElementById('analyzeButton');
  const analysisResult = document.getElementById('analysisResult');

  // Only run if we are on the analyzer page (elements exist)
  if (textInput && analyzeButton && analysisResult) {

    // Define word lists (lowercase)
    const PRONOUNS = new Set(['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs']);
    const PREPOSITIONS = new Set(['aboard', 'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'but', 'by', 'concerning', 'considering', 'despite', 'down', 'during', 'except', 'following', 'for', 'from', 'in', 'inside', 'into', 'like', 'minus', 'near', 'next', 'of', 'off', 'on', 'onto', 'opposite', 'out', 'outside', 'over', 'past', 'per', 'plus', 'regarding', 'round', 'save', 'since', 'than', 'through', 'to', 'toward', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'versus', 'via', 'with', 'within', 'without']);
    const INDEFINITE_ARTICLES = new Set(['a', 'an']);

    analyzeButton.addEventListener('click', () => {
      const text = textInput.value;
      let resultsText = "";

      try {
        // Basic Counts
        const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const spaceCount = (text.match(/ /g) || []).length;
        const newlineCount = (text.match(/\n/g) || []).length;
        const specialSymbolCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;

        resultsText += `--- Basic Counts ---\n`;
        resultsText += `Letters: ${letterCount}\n`;
        resultsText += `Words: ${wordCount}\n`;
        resultsText += `Spaces: ${spaceCount}\n`;
        resultsText += `Newlines: ${newlineCount}\n`;
        resultsText += `Special Symbols: ${specialSymbolCount}\n\n`;

        // Tokenization
        const tokens = (text.toLowerCase().match(/\b[a-z']+\b/g) || []);

        // Grouped Counts
        const pronounCounts = {};
        const prepositionCounts = {};
        const indefiniteArticleCounts = {};

        tokens.forEach(token => {
          if (PRONOUNS.has(token)) {
            pronounCounts[token] = (pronounCounts[token] || 0) + 1;
          } // <-- Added missing brace
          if (PREPOSITIONS.has(token)) {
            prepositionCounts[token] = (prepositionCounts[token] || 0) + 1;
          } // <-- Added missing brace
          if (INDEFINITE_ARTICLES.has(token)) {
            indefiniteArticleCounts[token] = (indefiniteArticleCounts[token] || 0) + 1;
          } // <-- Added missing brace
        }); // <-- Added missing brace for forEach

        // Format Grouped Results
        function formatGroupedCounts(title, counts) {
          let output = `--- ${title} ---\n`;
          const sortedKeys = Object.keys(counts).sort();
          if (sortedKeys.length === 0) {
            output += "None found.\n";
          } else {
            sortedKeys.forEach(key => {
              output += `${key}: ${counts[key]}\n`;
            }); // <-- Added missing brace
          } // <-- Added missing brace
          return output + "\n";
        } // <-- Added missing brace for function

        resultsText += formatGroupedCounts("Pronoun Counts", pronounCounts);
        resultsText += formatGroupedCounts("Preposition Counts", prepositionCounts);
        resultsText += formatGroupedCounts("Indefinite Article Counts", indefiniteArticleCounts);

        // Display results
        analysisResult.textContent = resultsText;
        logEvent('analyze', 'Text Analysis Performed');

      } catch (error) {
        analysisResult.textContent = "Error analyzing text. Please check the input or console for details.";
        console.error("Text Analysis Error:", error);
        logEvent('error', 'Text Analysis Failed');
      } // <-- Added missing brace for catch
    }); // <-- Added missing brace for event listener
  } // End if (analyzer elements exist) <-- Added missing brace

}); // End DOMContentLoaded
