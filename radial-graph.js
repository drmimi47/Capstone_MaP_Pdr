// radial-graph.js - Radial Network Graph with D3.js
// Creates a radial layout with one central node and outer nodes arranged in a circle

var radialGraph = function() {
  // ============================================================================
  // CANVAS DIMENSIONS
  // ============================================================================
  const containerWidth = document.getElementById('d3-container-3').clientWidth || 800;
  const width = Math.min(800, containerWidth - 30); // 30px for padding
  const height = width; // Keep it square
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.3; // Scale radius with container

  // ============================================================================
  // CSV DATA LOADING
  // ============================================================================
  Promise.all([
    d3.csv('nodes.csv'),
    d3.csv('edges.csv')
  ]).then(function([nodesData, edgesData]) {
    console.log('Loaded nodes:', nodesData);
    console.log('Loaded edges:', edgesData);

    // Process the nodes data
    const nodes = nodesData.map(d => ({
      id: d.id,
      name: d.name,
      connections: +d.connections,
      size: +d.size,
      color: d.color,
      type: d.type
    }));

    // Process the edges data
    const links = edgesData.map(d => ({
      source: d.source,
      target: d.target,
      strength: +d.strength,
      type: d.type
    }));

    createGraph(nodes, links);
  }).catch(function(error) {
    console.error('Error loading CSV files:', error);
    const fallbackNodes = [
      { id: 'error', name: 'CSV Load Error', connections: 0, size: 20, color: '#ff0000', type: 'center' }
    ];
    const fallbackLinks = [];
    createGraph(fallbackNodes, fallbackLinks);
  });

  // ============================================================================
  // GRAPH CREATION FUNCTION
  // ============================================================================
  function createGraph(nodes, links) {
    // ============================================================================
    // RADIAL POSITIONING
    // ============================================================================
    
    // Find center, outer, and floating nodes
    const centerNode = nodes.find(d => d.type === 'center');
    const outerNodes = nodes.filter(d => d.type === 'outer');
    const floatingNodes = nodes.filter(d => d.type === 'floating');
    
    console.log('Center node:', centerNode);
    console.log('Outer nodes:', outerNodes.length);
    console.log('Floating nodes:', floatingNodes.length);
    
    // Position center node (initial position only, not fixed)
    if (centerNode) {
      centerNode.x = centerX;
      centerNode.y = centerY;
    }
    
    // Position outer nodes in a circle (initial positions only)
    outerNodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / outerNodes.length;
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
    });

    // Position floating nodes randomly around the diagram
    floatingNodes.forEach((node, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const distance = radius * 1.45 + Math.random() * 100; // Outside the main circle
      node.x = centerX + distance * Math.cos(angle);
      node.y = centerY + distance * Math.sin(angle);
      console.log('Positioned floating node:', node.id, 'at', node.x, node.y);
    });

    // ============================================================================
    // SVG SETUP
    // ============================================================================
    const svg = d3.select('#d3-container-3')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', '#ffffffff');

    const g = svg.append('g');

    // Add arrow markers for different types
    const defs = g.append('defs');
    
    // Standard arrowhead pointing right (for directed edges)
    defs.append('marker')
      .attr('id', 'arrow-end')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)  // POSITION: Distance from node edge (higher = further from node)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 3.5)  // THICKNESS: Width of arrow (higher = thicker)
      .attr('markerHeight', 8)  // THICKNESS: Height of arrow (higher = thicker)
      .append('path')
      .attr('fill-opacity', 0.75)  // OPACITY: 0.5 = 50% transparent, 1 = fully opaque
      .attr('d', 'M0,-5L10,0L0,5')  // SHAPE: Arrow shape (can make longer/shorter)
      .attr('fill', '#666')
      .attr('stroke-width', 2);  // THICKNESS: Outline thickness

    // Arrowhead pointing left (for bidirectional start)
    defs.append('marker')
      .attr('id', 'arrow-start')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 0)  // POSITION: Distance from node edge (more negative = further from node)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 3.5)  // THICKNESS: Width of arrow
      .attr('markerHeight', 8)  // THICKNESS: Height of arrow
      .append('path')
      .attr('fill-opacity', 0.75)  // OPACITY: 0.5 = 50% transparent, 1 = fully opaque
      .attr('d', 'M10,-5L0,0L10,5')  // SHAPE: Arrow shape
      .attr('fill', '#666')
      .attr('stroke-width', 2);  // THICKNESS: Outline thickness

    // ============================================================================
    // ZOOM BEHAVIOR
    // ============================================================================
    const zoom = d3.zoom()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Set initial zoom level (smaller number = more zoomed out)
    svg.call(zoom.transform, d3.zoomIdentity.scale(0.8)); // 70% zoom (more zoomed out)

    // ============================================================================
    // FORCE SIMULATION WITH PHYSICS
    // ============================================================================
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(d => d.source.type === 'center' || d.target.type === 'center' ? radius * 0.9 : 100)
        .strength(0.3))
      .force('charge', d3.forceManyBody()
        .strength(d => d.type === 'center' ? -1000 : -300))
      .force('center', d3.forceCenter(centerX, centerY).strength(0.1))
      .force('collision', d3.forceCollide()
        .radius(d => d.size + 10)
        .strength(0.7));

    // ============================================================================
    // LINK VISUALIZATION
    // ============================================================================
    const link = g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 3)
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('marker-end', d => {
        console.log('Link type:', d.type, 'Source:', d.source, 'Target:', d.target);
        // Hide arrowheads for material_insite links initially
        if (d.source === 'material_insite' || d.target === 'material_insite') {
          return null;
        }
        return d.type === 'directed' || d.type === 'bidirectional' ? 'url(#arrow-end)' : null;
      })
      .attr('marker-start', d => {
        // Hide arrowheads for material_insite links initially
        if (d.source === 'material_insite' || d.target === 'material_insite') {
          return null;
        }
        return d.type === 'bidirectional' ? 'url(#arrow-start)' : null;
      })
      // Hide links connected to material_insite initially
      .style('opacity', d => {
        return (d.source === 'material_insite' || d.target === 'material_insite') ? 0 : 1;
      });

    // ============================================================================
    // NODE VISUALIZATION (HOLLOW CIRCLES)
    // ============================================================================
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', d => d.size)
      .attr('fill', '#fff')  // NO FILL - transparent interior
      .attr('stroke', d => d.color)  // Colored border
      .attr('stroke-width', 2)  // 2px border thickness
      .style('cursor', 'pointer')
      // Hide material_insite node initially
      .style('opacity', d => d.id === 'material_insite' ? 0 : 1)
      .call(drag(simulation)); // Add drag behavior

    // Add hover effects
    node.on('mouseover', function(event, d) {
      // Only show hover effects if the node is visible
      if (d3.select(this).style('opacity') == 1) {
        // Highlight connected links
        link.style('stroke-opacity', l => 
          l.source.id === d.id || l.target.id === d.id ? 1 : 0.2
        );
        // Change color instead of width to avoid arrow repositioning
        link.style('stroke', l => 
          l.source.id === d.id || l.target.id === d.id ? '#666' : '#999'
        );
        
        showTooltip(event, d);
      }
    })
    .on('mouseout', function(event, d) {
      if (d3.select(this).style('opacity') == 1) {
        link.style('stroke-opacity', 0.7);
        link.style('stroke', '#999'); // Reset color
        hideTooltip();
      }
    })
    .on('click', function(event, d) {
      console.log('Clicked on:', d.name, 'Type:', d.type, 'Connections:', d.connections);
    });

    // ============================================================================
    // LABELS WITH MULTI-LINE TEXT
    // ============================================================================
    const label = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('text-anchor', 'middle')
      .style('pointer-events', 'none')
      // Hide material_insite label initially
      .style('opacity', d => d.id === 'material_insite' ? 0 : 1);

    // Function to wrap text into multiple lines
    function wrapText(text, maxCharsPerLine) {
      // First check if there are manual line breaks (using | as separator)
      if (text.includes('|')) {
        return text.split('|').map(line => line.trim()); // Split on | and trim whitespace
      }
      
      // If no manual breaks, use automatic wrapping
      const words = text.split(/\s+/);
      const lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + word).length <= maxCharsPerLine) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) lines.push(currentLine);
      
      return lines;
    }

    // Add multi-line text to each node
    label.each(function(d) {
      const group = d3.select(this);
      const lines = wrapText(d.name, d.type === 'center' ? 12 : 8);
      const fontSize = d.type === 'center' ? 12 : 10;
      const lineHeight = fontSize + 4; // INCREASED spacing between lines
      
      // Calculate starting Y position to center the text block
      const startY = -(lines.length - 1) * lineHeight / 2;
      
      lines.forEach((line, i) => {
        group.append('text')
          .attr('dy', startY + (i * lineHeight))
          .attr('font-size', fontSize + 'px')
          .attr('font-weight', d.type === 'center' ? 'bold' : 'normal')
          .attr('fill', '#333')
          .text(line);
      });
    });

    // ============================================================================
    // CLICK EVENT TO REVEAL HIDDEN NODE
    // ============================================================================
    let materialInsiteRevealed = false;
    
    svg.on('click', function(event) {
      // Only reveal if not already revealed and click is not on a node
      if (!materialInsiteRevealed && !event.target.closest('circle')) {
        materialInsiteRevealed = true;
        
        // Animate the appearance of material_insite node
        node.filter(d => d.id === 'material_insite')
          .transition()
          .duration(800)
          .style('opacity', 1);
        
        // Animate the appearance of material_insite label
        label.filter(d => d.id === 'material_insite')
          .transition()
          .duration(800)
          .style('opacity', 1);
        
        // Animate the appearance of links connected to material_insite
        link.filter(d => d.source.id === 'material_insite' || d.target.id === 'material_insite')
          .transition()
          .duration(800)
          .style('opacity', 1)
          .attr('marker-end', d => d.type === 'directed' || d.type === 'bidirectional' ? 'url(#arrow-end)' : null)
          .attr('marker-start', d => d.type === 'bidirectional' ? 'url(#arrow-start)' : null);
        
        console.log('Material In-Site node revealed!');
      }
    });

    // ============================================================================
    // ANIMATION LOOP
    // ============================================================================
    simulation.on('tick', () => {
      // Update link positions
      link
        .attr('x1', d => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const rSource = d.source.size;
          return d.source.x + (dx * rSource) / dist;
        })
        .attr('y1', d => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const rSource = d.source.size;
          return d.source.y + (dy * rSource) / dist;
        })
        .attr('x2', d => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const rTarget = d.target.size;
          return d.target.x - (dx * rTarget) / dist;
        })
        .attr('y2', d => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const rTarget = d.target.size;
          return d.target.y - (dy * rTarget) / dist;
        });

      // Update node positions
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      // Update label positions
      label
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    // Stop simulation quickly since positions are fixed
    simulation.alpha(0.1);

    // ============================================================================
    // DRAG BEHAVIOR
    // ============================================================================
    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }
};

// Execute the radial graph
radialGraph();