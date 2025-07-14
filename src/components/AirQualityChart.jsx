import React, { useEffect, useRef } from 'react';

const AirQualityChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart settings
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Calculate min and max AQI
    const aqiValues = data.map(d => d.aqi);
    const minAqi = Math.min(...aqiValues, 0);
    const maxAqi = Math.max(...aqiValues, 100);

    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw AQI color zones
    const zones = [
      { max: 50, color: 'rgba(34, 197, 94, 0.2)' },
      { max: 100, color: 'rgba(234, 179, 8, 0.2)' },
      { max: 150, color: 'rgba(249, 115, 22, 0.2)' },
    ];

    zones.forEach((zone, index) => {
      const zoneHeight = (zone.max / maxAqi) * chartHeight;
      const y = padding + chartHeight - zoneHeight;
      
      ctx.fillStyle = zone.color;
      ctx.fillRect(padding, y, chartWidth, zoneHeight - (index > 0 ? (zones[index - 1].max / maxAqi) * chartHeight : 0));
    });

    // Draw AQI bars
    const barWidth = chartWidth / (data.length * 2);
    
    data.forEach((item, index) => {
      const x = padding + (index * chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2;
      const barHeight = (item.aqi / maxAqi) * chartHeight;
      const y = padding + chartHeight - barHeight;
      
      // Get color based on AQI value
      let color = '#22C55E'; // Green
      if (item.aqi > 50) color = '#EAB308'; // Yellow
      if (item.aqi > 100) color = '#F97316'; // Orange
      if (item.aqi > 150) color = '#EF4444'; // Red
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw AQI value labels
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${item.aqi}`, x + barWidth / 2, y - 10);
      
      // Draw day labels
      ctx.fillText(item.day, x + barWidth / 2, height - 20);
    });

    // Draw y-axis labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const aqi = minAqi + (i * (maxAqi - minAqi) / 5);
      const y = padding + chartHeight - (i * chartHeight / 5);
      ctx.fillText(`${Math.round(aqi)}`, padding - 10, y + 4);
    }

    // Draw legend
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('AQI Levels:', padding, 30);
    
    const legendItems = [
      { color: '#22C55E', label: 'Good (0-50)' },
      { color: '#EAB308', label: 'Moderate (51-100)' },
      { color: '#F97316', label: 'Unhealthy for Sensitive (101-150)' },
    ];
    
    legendItems.forEach((item, index) => {
      const x = padding + 80 + (index * 140);
      ctx.fillStyle = item.color;
      ctx.fillRect(x, 20, 12, 12);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(item.label, x + 20, 30);
    });

  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64 rounded-lg"
      style={{ width: '100%', height: '256px' }}
    />
  );
};

export default AirQualityChart;