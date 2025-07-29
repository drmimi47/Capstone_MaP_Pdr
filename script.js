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