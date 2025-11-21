import React from 'react';
import './AnimatedHeader.css';

/**
 * AnimatedHeader Component
 * 
 * Renders the main application title as an SVG to allow for advanced stroke animations.
 * 
 * Structure:
 * - Uses an <svg> element as the container.
 * - Uses a <text> element for the content, which allows SEO-friendly text that is selectable.
 * - The animation is driven entirely by CSS in AnimatedHeader.css.
 * 
 * Accessibility:
 * - Includes aria-labelledby and a <title> tag for screen readers.
 */
const AnimatedHeader = () => {
    return (
        <div className="animated-header-container">
            {/* 
        viewBox="0 0 500 120" defines the coordinate system.
        If you change the text length, you may need to adjust the width (500) 
        to ensure it fits without being cut off.
      */}
            <svg
                className="animated-header-svg"
                viewBox="0 0 500 120"
                xmlns="http://www.w3.org/2000/svg"
                aria-labelledby="header-title"
            >
                <title id="header-title">Galería Pro</title>

                {/* 
          Text element centered in the SVG.
          x="50%" y="50%" with textAnchor="middle" centers it horizontally.
          dominantBaseline="middle" centers it vertically.
        */}
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="animated-header-text"
                >
                    Galería Pro
                </text>
            </svg>
        </div>
    );
};

export default AnimatedHeader;
