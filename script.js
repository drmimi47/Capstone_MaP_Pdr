// Scroll Progress Bar JavaScript
// Add this to your existing script.js file

document.addEventListener("DOMContentLoaded", function () {
  
  // Progress tracking function
  function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    
    // Update progress bar
    if (progressFill) {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / documentHeight) * 100;
      progressFill.style.width = Math.min(Math.max(progress, 0), 100) + '%';
    }
  }

  // Update progress on scroll with throttling for better performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
      setTimeout(() => { ticking = false; }, 10);
    }
  }

  window.addEventListener('scroll', requestTick);
  updateProgress(); // Initial call
});

//ABOVE IS SCROLLER BAR



document.addEventListener("DOMContentLoaded", function () {
  // Invert toggle button functionality
  const invertToggle = document.getElementById("invert-toggle");
  if (invertToggle) {
    invertToggle.addEventListener("click", function () {
      document.body.classList.toggle("inverted");
    });
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Also handle the footer "Jump to Top" link
  const jumpToTopLink = document.querySelector('footer a[href="#"]');
  if (jumpToTopLink) {
    jumpToTopLink.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Set desired scroll speed (pixels per second)
const SCROLL_SPEED = 70; // Adjust this value to make it faster or slower

function setScrollSpeed() {
  // Get ALL scroll wrappers instead of just the first one
  const scrollWrappers = document.querySelectorAll('.scroll-wrapper');
  
  scrollWrappers.forEach(scrollWrapper => {
    // Find the first scroll-text element within this specific wrapper
    const scrollText = scrollWrapper.querySelector('.scroll-text');
    
    if (scrollText) {
      // Get the width of one text block
      const textWidth = scrollText.offsetWidth;
      
      // Calculate duration based on text width and desired speed
      const duration = textWidth / SCROLL_SPEED;
      
      // Apply the calculated duration to this specific wrapper's animation
      scrollWrapper.style.animationDuration = `${duration}s`;
    }
  });
}

// Set speed when page loads
document.addEventListener('DOMContentLoaded', setScrollSpeed);

// Optional: Update speed if window is resized
window.addEventListener('resize', setScrollSpeed);

document.addEventListener('DOMContentLoaded', function() {
    const paragraph = document.querySelector('main p em');
    
    if (paragraph) {
        const text = paragraph.textContent;
        paragraph.textContent = '';
        
        // Add cursor styling
        paragraph.style.borderRight = '2px solid';
        paragraph.style.animation = 'blink 1s infinite';
        
        let index = 0;
        const speed = 40; // Adjust speed (lower = faster)
        
        function typeWriter() {
            if (index < text.length) {
                paragraph.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, speed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    paragraph.style.borderRight = 'none';
                    paragraph.style.animation = 'none';
                }, 1000);
            }
        }
        
        // Start typing after a small delay
        setTimeout(typeWriter, 500);
    }
});

// Auto-invert every minute
// Keep your original timer
setInterval(function() {
    document.body.classList.toggle("inverted");
}, 300000);



// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners to the entire gantt chart
  const ganttChart = document.querySelector('.gantt-chart');
  
  if (ganttChart) {
    
    // Click event listener (existing functionality)
    ganttChart.addEventListener('click', function(e) {
      // Check if the clicked element is any type of gantt bar
      if (e.target.matches('.gantt-bar1, .gantt-bar2, .gantt-bar3')) {
        console.log('Bar clicked:', e.target.className); // Debug line
        
        // Toggle the 'show-tooltips' class on the gantt chart
        this.classList.toggle('show-tooltips');
        
        console.log('Tooltips visible:', this.classList.contains('show-tooltips')); // Debug line
      }
    });
    
    // Hover event listeners (new functionality)
    ganttChart.addEventListener('mouseenter', function(e) {
      // Check if hovering over any type of gantt bar
      if (e.target.matches('.gantt-bar1, .gantt-bar2, .gantt-bar3')) {
        console.log('Bar hovered:', e.target.className); // Debug line
        
        // Add hover class to show tooltips
        this.classList.add('show-tooltips-hover');
      }
    }, true); // Use capture phase for better event handling
    
    ganttChart.addEventListener('mouseleave', function(e) {
      // Check if leaving any type of gantt bar
      if (e.target.matches('.gantt-bar1, .gantt-bar2, .gantt-bar3')) {
        console.log('Bar hover ended:', e.target.className); // Debug line
        
        // Remove hover class to hide tooltips
        this.classList.remove('show-tooltips-hover');
      }
    }, true); // Use capture phase for better event handling
    
  } else {
    console.log('Gantt chart not found'); // Debug line
  }
});


// ANIMATED WORDS// ANIMATED WORDS// ANIMATED WORDS// ANIMATED WORDS// ANIMATED WORDS// ANIMATED WORDS
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Simple split text function
function createSplitTextAnimation(element, options = {}) {
    const {
        splitType = 'chars',
        delay = 25,           // Changed from 100 to 25 (faster)
        duration = 0.4,       // Changed from 0.6 to 0.4 (faster)
        ease = 'power3.out',
        threshold = 0.1,
        onComplete = null
    } = options;

    const text = element.textContent.trim();
    element.innerHTML = '';

    let pieces = [];

    if (splitType === 'chars') {
        // Split into words first, then characters within each word
        const words = text.split(' ');
        
        words.forEach((word, wordIndex) => {
            // Create a word wrapper that can break to new lines
            const wordWrapper = document.createElement('span');
            wordWrapper.style.display = 'inline-block';
            wordWrapper.style.whiteSpace = 'nowrap'; // Keep word intact
            wordWrapper.style.marginRight = '0.3em'; // Space between words
            
            // Split each word into characters
            const chars = word.split('').map(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'split-char';
                span.style.display = 'inline-block';
                wordWrapper.appendChild(span);
                pieces.push(span); // Add to pieces array for animation
                return span;
            });
            
            element.appendChild(wordWrapper);
        });
    } else if (splitType === 'words') {
        // Split into words
        pieces = text.split(' ').map((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.className = 'split-char';
            span.style.marginRight = '0.3em';
            element.appendChild(span);
            return span;
        });
    }

    // Set initial state
    gsap.set(pieces, { 
        opacity: 0, 
        y: 0,
        force3D: true 
    });

    // Create scroll-triggered animation
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: element,
            start: `top ${(1 - threshold) * 100}%`,
            toggleActions: "play none none none",
            once: true,
            // markers: true, // Uncomment to see scroll trigger markers
        },
        onComplete: () => {
            // Don't clear any properties - let GSAP maintain the final state
            if (onComplete) onComplete();
            console.log('Animation completed for:', element.textContent.substring(0, 20) + '...');
        }
    });

    // Animate pieces in sequence
    tl.to(pieces, {
        opacity: 1,
        y: 0,
        duration: duration,
        ease: ease,
        stagger: delay / 1000, // Convert ms to seconds
        force3D: true
    });

    return tl;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with split-text class
    const splitElements = document.querySelectorAll('.split-text');
    
    splitElements.forEach(element => {
        // Get options from data attributes
        const options = {
            splitType: element.dataset.split || 'chars',
            delay: parseInt(element.dataset.delay) || 100,
            duration: parseFloat(element.dataset.duration) || 0.6,
            ease: element.dataset.ease || 'power3.out',
            threshold: parseFloat(element.dataset.threshold) || 0.1,
            onComplete: () => {
                console.log('Finished animating:', element.textContent);
            }
        };

        // Create the animation
        createSplitTextAnimation(element, options);
    });
});

// Optional: Add a simple version for immediate animation (no scroll trigger)
function animateTextImmediately(selector, options = {}) {
    const element = document.querySelector(selector);
    if (!element) return;

    const {
        splitType = 'chars',
        delay = 100,
        duration = 0.6,
        ease = 'power3.out'
    } = options;

    const text = element.textContent.trim();
    element.innerHTML = '';

    const pieces = text.split('').map(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px)';
        element.appendChild(span);
        return span;
    });

    gsap.to(pieces, {
        opacity: 1,
        y: 0,
        duration: duration,
        ease: ease,
        stagger: delay / 1000,
        onComplete: () => {
            // Don't clear properties - let GSAP maintain final state
        }
    });
}
// ANIMATED WORDS// ANIMATED WORDS// ANIMATED WORDS// ANIMATED WORDS// ANIMATED WORDS// ANIMATED WORDS

// floating book tooltip for multiple images
const images = document.querySelectorAll('.book-image');
const tooltip = document.getElementById('tooltip');

images.forEach(image => {
    image.addEventListener('mouseenter', function(e) {
        const tooltipContent = this.getAttribute('data-tooltip');
        tooltip.innerHTML = tooltipContent; // Use innerHTML to render HTML content
        tooltip.style.display = 'block';
    });

    image.addEventListener('mousemove', function(e) {
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top = (e.pageY - 30) + 'px';
    });

    image.addEventListener('mouseleave', function(e) {
        tooltip.style.display = 'none';
    });
});
// floating book tooltip