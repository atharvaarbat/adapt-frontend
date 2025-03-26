import React, { useRef, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const GraphVisualization = () => {
  // Parse node data
  const nodes = [
    { id: 1, name: "Village A", coordinates: "(89, 24)", riskLevel: 3 },
    { id: 2, name: "City B", coordinates: "(61, 130)", riskLevel: 1 },
    { id: 3, name: "Bridge C", coordinates: "(40, 55)", riskLevel: 8 },
    { id: 4, name: "Village D", coordinates: "(136, 81)", riskLevel: 4 },
    { id: 5, name: "City E", coordinates: "(147, 30)", riskLevel: 2 },
    { id: 6, name: "Bridge F", coordinates: "(86, 146)", riskLevel: 9 },
    { id: 7, name: "Village G", coordinates: "(114, 17)", riskLevel: 5 },
    { id: 8, name: "City H", coordinates: "(134, 23)", riskLevel: 1 },
    { id: 9, name: "Bridge I", coordinates: "(83, 9)", riskLevel: 7 },
    { id: 10, name: "Village J", coordinates: "(62, 100)", riskLevel: 6 },
    { id: 11, name: "City K", coordinates: "(78, 132)", riskLevel: 2 },
    { id: 12, name: "Bridge L", coordinates: "(142, 106)", riskLevel: 10 },
    { id: 13, name: "Village M", coordinates: "(117, 37)", riskLevel: 4 },
    { id: 14, name: "City N", coordinates: "(67, 40)", riskLevel: 1 },
    { id: 15, name: "Bridge O", coordinates: "(108, 58)", riskLevel: 8 },
    { id: 16, name: "Village P", coordinates: "(98, 135)", riskLevel: 5 },
    { id: 17, name: "City Q", coordinates: "(31, 88)", riskLevel: 2 },
    { id: 18, name: "Bridge R", coordinates: "(76, 141)", riskLevel: 10 },
    { id: 19, name: "Village S", coordinates: "(132, 11)", riskLevel: 6 },
    { id: 20, name: "City T", coordinates: "(33, 118)", riskLevel: 1 }
].map(node => {
    // Extract coordinates from string
    const coords = node.coordinates.match(/\d+/g);
    return {
      ...node,
      x: parseInt(coords[0]),
      y: parseInt(coords[1]),
    };
  });

  // Parse edge data
  const links = [
    { source: 1, target: 2, weight: 10 },
    { source: 1, target: 3, weight: 15 },
    { source: 1, target: 7, weight: 22 },
    { source: 2, target: 1, weight: 10 },
    { source: 2, target: 4, weight: 20 },
    { source: 2, target: 5, weight: 25 },
    { source: 3, target: 1, weight: 15 },
    { source: 3, target: 4, weight: 25 },
    { source: 3, target: 6, weight: 18 },
    { source: 4, target: 2, weight: 20 },
    { source: 4, target: 3, weight: 25 },
    { source: 4, target: 5, weight: 30 },
    { source: 4, target: 8, weight: 28 },
    { source: 5, target: 2, weight: 25 },
    { source: 5, target: 4, weight: 30 },
    { source: 5, target: 9, weight: 32 },
    { source: 6, target: 3, weight: 18 },
    { source: 6, target: 9, weight: 24 },
    { source: 6, target: 12, weight: 35 },
    { source: 7, target: 1, weight: 22 },
    { source: 7, target: 10, weight: 19 },
    { source: 7, target: 11, weight: 26 },
    { source: 8, target: 4, weight: 28 },
    { source: 8, target: 11, weight: 21 },
    { source: 8, target: 12, weight: 30 },
    { source: 9, target: 5, weight: 32 },
    { source: 9, target: 6, weight: 24 },
    { source: 9, target: 13, weight: 27 },
    { source: 10, target: 7, weight: 19 },
    { source: 10, target: 13, weight: 23 },
    { source: 10, target: 14, weight: 29 },
    { source: 11, target: 7, weight: 26 },
    { source: 11, target: 8, weight: 21 },
    { source: 11, target: 15, weight: 31 },
    { source: 12, target: 6, weight: 35 },
    { source: 12, target: 8, weight: 30 },
    { source: 12, target: 16, weight: 28 },
    { source: 13, target: 9, weight: 27 },
    { source: 13, target: 10, weight: 23 },
    { source: 13, target: 17, weight: 33 },
    { source: 14, target: 10, weight: 29 },
    { source: 14, target: 15, weight: 22 },
    { source: 14, target: 18, weight: 36 },
    { source: 15, target: 11, weight: 31 },
    { source: 15, target: 14, weight: 22 },
    { source: 15, target: 19, weight: 25 },
    { source: 16, target: 12, weight: 28 },
    { source: 16, target: 17, weight: 20 },
    { source: 16, target: 20, weight: 34 },
    { source: 17, target: 13, weight: 33 },
    { source: 17, target: 16, weight: 20 },
    { source: 17, target: 19, weight: 29 },
    { source: 18, target: 14, weight: 36 },
    { source: 18, target: 19, weight: 26 },
    { source: 18, target: 20, weight: 31 },
    { source: 19, target: 15, weight: 25 },
    { source: 19, target: 17, weight: 29 },
    { source: 19, target: 18, weight: 26 },
    { source: 20, target: 16, weight: 34 },
    { source: 20, target: 18, weight: 31 }
  ];

  // Color mapping for categories
  const categoryColors = {
    'City': '#4287f5',
    'Village': '#42f563',
    'Bridge': '#f54242'
  };

  // Size mapping based on risk level
  const getNodeSize = (riskLevel) => 3 + (riskLevel * 1.5);

  const fgRef = useRef();

  // Handle zoom to fit when data loads
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400);
    }
  }, []);

  // Custom node painting
  const paintNode = useCallback((node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = categoryColors[node.category] || '#aaa';
    ctx.fill();
    
    // Draw stroke based on risk level
    ctx.lineWidth = node.riskLevel / 5;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // Draw label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(label, node.x, node.y + (getNodeSize(node.riskLevel) + 8 / globalScale));
  }, []);

  // Custom link painting
  const paintLink = useCallback((link, ctx, globalScale) => {
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.lineWidth = Math.min(link.weight / 5, 3);
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.stroke();
  }, []);

  return (
    <div className='w-1/3'>
      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes, links }}
        nodeLabel={node => `
          <div style="background: white; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
            <strong>${node.name}</strong><br/>
            Category: ${node.category}<br/>
            Risk Level: ${node.riskLevel}<br/>
            Date: ${node.date}<br/>
            Coordinates: ${node.coordinates}
          </div>
        `}
        linkLabel={link => `Weight: ${link.weight}`}
        nodeCanvasObject={paintNode}
        linkCanvasObject={paintLink}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.1}
        width={window.innerWidth * 0.98}
        height={800}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current.zoomToFit(400)}
      />
      <div style={{ padding: '10px', background: '#f5f5f5' }}>
        <h2>Graph Legend</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <h4>Node Categories:</h4>
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ width: '15px', height: '15px', background: color, marginRight: '5px', borderRadius: '50%' }}></div>
                <span>{category}</span>
              </div>
            ))}
          </div>
          <div>
            <h4>Node Size:</h4>
            <p>Based on Risk Level (1-10)</p>
          </div>
          <div>
            <h4>Link Width:</h4>
            <p>Based on Weight value</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;