// Wrap everything in a function to maintain independence from other scripts
var mapboxSketch03 = function() {
  // ============================================================================
  // STEP 1: SET UP YOUR MAPBOX ACCESS TOKEN
  // ============================================================================
  mapboxgl.accessToken = 'pk.eyJ1IjoicHJvZHJpZ3VlejI1IiwiYSI6ImNtZDZuYWVzYTAyMWkyanB0OWt6NHRkdTkifQ.T1zP9pau_qqDdclgYdU8Tw';

  // ============================================================================
  // STEP 2: CREATE THE MAP OBJECT
  // ============================================================================
  const map3 = new mapboxgl.Map({
      container: 'mapbox-container-3',
      style: 'mapbox://styles/mapbox/dark-v11', // Changed to streets for better context with fountains
      center: [-73.9712, 40.7831], // Centered on Central Park
      zoom: 12, // Default zoom (will be updated when data loads)
      pitch: 0,
      bearing: 0
  });

  // ============================================================================
  // STEP 3: ADD MAP CONTROLS
  // ============================================================================
  map3.addControl(new mapboxgl.NavigationControl(), 'top-right');
  map3.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'imperial' // Changed to imperial for NYC context
  }), 'bottom-left');

  // ============================================================================
  // STEP 4: WAIT FOR THE MAP TO LOAD
  // ============================================================================
  map3.on('load', () => {
      console.log('Map 3 loaded successfully!');
      
      // ========================================================================
      // STEP 5: LOAD EXTERNAL GEOJSON DATA
      // ========================================================================
      
      // Load the GeoJSON file using fetch API
      fetch('parkdrinkingfountains.geojson')
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
              console.log('GeoJSON data loaded successfully:', data);
              console.log('Number of drinking fountains:', data.features.length);
              console.log('First fountain:', data.features[0]);
              console.log('Geometry type of first feature:', data.features[0].geometry.type);
              
              // Add the data as a source to the map
              map3.addSource('fountains-data', {
                  'type': 'geojson',
                  'data': data
              });
              
              console.log('Source added successfully');
              
              // ====================================================================
              // STEP 6: ADD LAYERS FOR DRINKING FOUNTAINS (POINT DATA)
              // ====================================================================
              
              // Add circle layer for drinking fountains
              map3.addLayer({
                  'id': 'fountains-circles',
                  'type': 'circle',
                  'source': 'fountains-data',
                  'paint': {
                      'circle-radius': [
                          'interpolate',
                          ['linear'],
                          ['zoom'],
                          10, 4,  // At zoom 10, radius is 4px
                          15, 8,  // At zoom 15, radius is 8px
                          18, 12  // At zoom 18, radius is 12px
                      ],
                      'circle-color': '#2563EB', // Blue color for water
                      'circle-opacity': 0.8,
                      'circle-stroke-color': '#1E40AF', // Dark blue border
                      'circle-stroke-width': 1
                  }
              });

              // Add halo effect for better visibility
              map3.addLayer({
                  'id': 'fountains-halo',
                  'type': 'circle',
                  'source': 'fountains-data',
                  'paint': {
                      'circle-radius': [
                          'interpolate',
                          ['linear'],
                          ['zoom'],
                          10, 6,  // At zoom 10, radius is 6px
                          15, 12, // At zoom 15, radius is 12px
                          18, 18  // At zoom 18, radius is 18px
                      ],
                      'circle-color': '#93C5FD', // Light blue halo
                      'circle-opacity': 0.3
                  }
              }, 'fountains-circles'); // Place halo behind main circles
              
              console.log('All layers added successfully');

              // ====================================================================
              // STEP 7: AUTOMATICALLY FRAME THE MAP TO FIT THE DATA
              // ====================================================================
              
              // Calculate the bounding box of all fountain locations
              const bounds = new mapboxgl.LngLatBounds();
              
              data.features.forEach(feature => {
                  if (feature.geometry.type === 'Point') {
                      bounds.extend(feature.geometry.coordinates);
                  }
              });
              
              // Fit the map to the data with some padding
              map3.fitBounds(bounds, {
                  padding: 80, // Add 80px padding around the data
                  duration: 2000, // Animate the transition over 2 seconds
                  maxZoom: 16 // Don't zoom in too far for city-wide view
              });
              
              console.log('Map automatically framed to fit fountain data');

              // ====================================================================
              // STEP 8: ADD INTERACTIVE FEATURES
              // ====================================================================
              
              // Add hover effects for fountains
              map3.on('mouseenter', 'fountains-circles', () => {
                  map3.getCanvas().style.cursor = 'pointer';
                  map3.setPaintProperty('fountains-circles', 'circle-opacity', 1.0);
                  map3.setPaintProperty('fountains-circles', 'circle-stroke-width', 2);
              });

              map3.on('mouseleave', 'fountains-circles', () => {
                  map3.getCanvas().style.cursor = '';
                  map3.setPaintProperty('fountains-circles', 'circle-opacity', 0.8);
                  map3.setPaintProperty('fountains-circles', 'circle-stroke-width', 1);
              });

              // Add click events to show detailed information
              map3.on('click', 'fountains-circles', (e) => {
                  const coordinates = e.features[0].geometry.coordinates.slice();
                  const properties = e.features[0].properties;
                  
                  // Ensure that if the map is zoomed out such that multiple
                  // copies of the feature are visible, the popup appears
                  // over the copy being pointed to.
                  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                  }
                  
                  // Create popup content based on available properties
                  let popupContent = '<div style="text-align: center;">';
                  popupContent += '<h4>NYC Park Drinking Fountain</h4>';
                  
                  // Add property information if available
                  if (properties.name) {
                      popupContent += `<p><strong>Location:</strong> ${properties.name}</p>`;
                  }
                  if (properties.park_name) {
                      popupContent += `<p><strong>Park:</strong> ${properties.park_name}</p>`;
                  }
                  if (properties.borough) {
                      popupContent += `<p><strong>Borough:</strong> ${properties.borough}</p>`;
                  }
                  if (properties.location) {
                      popupContent += `<p><strong>Description:</strong> ${properties.location}</p>`;
                  }
                  
                  popupContent += '</div>';
                  
                  new mapboxgl.Popup()
                      .setLngLat(coordinates)
                      .setHTML(popupContent)
                      .addTo(map3);
              });

              // ====================================================================
              // STEP 9: ADD SEARCH FUNCTIONALITY
              // ====================================================================
              
              // Search functionality for fountain locations
              document.getElementById('searchFeature').addEventListener('input', (e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  
                  if (searchTerm === '') {
                      // Show all fountains
                      map3.setFilter('fountains-circles', null);
                      map3.setFilter('fountains-halo', null);
                  } else {
                      // Create a filter that searches multiple fields
                      const searchFilter = [
                          'any',
                          ['in', searchTerm, ['downcase', ['to-string', ['get', 'name']]]],
                          ['in', searchTerm, ['downcase', ['to-string', ['get', 'park_name']]]],
                          ['in', searchTerm, ['downcase', ['to-string', ['get', 'borough']]]],
                          ['in', searchTerm, ['downcase', ['to-string', ['get', 'location']]]]
                      ];
                      
                      map3.setFilter('fountains-circles', searchFilter);
                      map3.setFilter('fountains-halo', searchFilter);
                  }
              });

              // ====================================================================
              // STEP 10: ADD CUSTOM BUTTON FUNCTIONALITY
              // ====================================================================
              
              // Reset filters button
              document.getElementById('resetFilters').addEventListener('click', () => {
                  document.getElementById('searchFeature').value = '';
                  
                  map3.setFilter('fountains-circles', null);
                  map3.setFilter('fountains-halo', null);
              });

              // Fit to data button
              document.getElementById('fitToData').addEventListener('click', () => {
                  map3.fitBounds(bounds, {
                      padding: 80,
                      duration: 2000,
                      maxZoom: 16
                  });
              });

              // ====================================================================
              // STEP 11: ADD KEYBOARD SHORTCUTS
              // ====================================================================
              
              document.addEventListener('keydown', (e) => {
                  switch(e.key) {
                      case 'f':
                      case 'F':
                          e.preventDefault();
                          document.getElementById('fitToData').click();
                          break;
                      case 'r':
                      case 'R':
                          e.preventDefault();
                          document.getElementById('resetFilters').click();
                          break;
                      case 'Escape':
                          e.preventDefault();
                          document.getElementById('searchFeature').value = '';
                          document.getElementById('searchFeature').dispatchEvent(new Event('input'));
                          break;
                  }
              });

              // ====================================================================
              // STEP 12: ADD CLUSTERING FOR BETTER PERFORMANCE (OPTIONAL)
              // ====================================================================
              
              // If there are many fountains, you might want to add clustering
              // This is commented out but can be enabled if needed
              /*
              map3.addSource('fountains-clustered', {
                  type: 'geojson',
                  data: data,
                  cluster: true,
                  clusterMaxZoom: 14,
                  clusterRadius: 50
              });
              
              map3.addLayer({
                  id: 'clusters',
                  type: 'circle',
                  source: 'fountains-clustered',
                  filter: ['has', 'point_count'],
                  paint: {
                      'circle-color': [
                          'step',
                          ['get', 'point_count'],
                          '#51bbd6',
                          100,
                          '#f1f075',
                          750,
                          '#f28cb1'
                      ],
                      'circle-radius': [
                          'step',
                          ['get', 'point_count'],
                          20,
                          100,
                          30,
                          750,
                          40
                      ]
                  }
              });
              */

              // ====================================================================
              // STEP 13: DEBUGGING AND CONSOLE OUTPUT
              // ====================================================================
              
              console.log('Mapbox NYC Parks Drinking Fountains Map initialized');
              console.log('Data loaded from: parkdrinkingfountains.geojson');
              console.log('Features loaded:');
              console.log(`- ${data.features.length} drinking fountains`);
              console.log('Interactive features:');
              console.log('- Hover effects on fountain markers');
              console.log('- Click popups with fountain information');
              console.log('- Search functionality for fountain locations');
              console.log('Keyboard shortcuts:');
              console.log('- F: Fit map to data');
              console.log('- R: Reset search');
              console.log('- Escape: Clear search');

          })
          .catch(error => {
              console.error('Error loading GeoJSON data:', error);
              
              // Show error message to user
              const mapContainer = document.getElementById('mapbox-container-3');
              const errorDiv = document.createElement('div');
              errorDiv.style.cssText = `
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background: #ef4444;
                  color: white;
                  padding: 20px;
                  border-radius: 8px;
                  text-align: center;
                  z-index: 1000;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              `;
              errorDiv.innerHTML = `
                  <h3>Error Loading Fountain Data</h3>
                  <p>Could not load the parkdrinkingfountains.geojson file.</p>
                  <p>Make sure you're running this on a local server.</p>
                  <p><small>Error: ${error.message}</small></p>
              `;
              mapContainer.appendChild(errorDiv);
          });
  });
};

// Execute the sketch
mapboxSketch03();