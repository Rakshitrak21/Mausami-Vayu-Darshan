import React, { useEffect, useRef } from 'react';

const WeatherChart = ({ data }) => {
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

    // Calculate min and max temperatures
    const temps = data.map(d => d.temp);
    const minTemp = Math.min(...temps) - 2;
    const maxTemp = Math.max(...temps) + 2;

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

    // Draw temperature line
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = padding + (index * chartWidth / (data.length - 1));
      const y = padding + chartHeight - ((item.temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#3B82F6';
    data.forEach((item, index) => {
      const x = padding + (index * chartWidth / (data.length - 1));
      const y = padding + chartHeight - ((item.temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw temperature labels
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${item.temp}°C`, x, y - 15);
      
      // Draw day labels
      ctx.fillText(item.day, x, height - 20);
    });

    // Draw y-axis labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const temp = minTemp + (i * (maxTemp - minTemp) / 5);
      const y = padding + chartHeight - (i * chartHeight / 5);
      ctx.fillText(`${Math.round(temp)}°C`, padding - 10, y + 4);
    }

  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-64 rounded-lg"
      style={{ width: '100%', height: '256px' }}
    />
  );
};

export default WeatherChart;