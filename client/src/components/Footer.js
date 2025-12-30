// client/src/components/Footer.js

import React from 'react';
// Don't forget to link Font Awesome in your public/index.html or main App.js if you haven't
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
// I'll assume you add this in public/index.html for global availability.

export default function Footer() {
    const copyrightYear = 2025; // As per your request for 2025
    const phoneNumber = '0096171146914';
    const formattedPhoneNumber = '+961 71 146 914'; // A more readable format for display

    return (
        <footer style={{
            backgroundColor: 'var(--color-background-dark,rgb(44, 107, 52))', // Fallback dark blue-grey
            color: 'var(--color-text-light, #ecf0f1)', // Fallback light text color
            padding: '40px 20px',
            borderTop: '5px solid var(--color-accent-blue,rgb(100, 143, 81))', // Fallback accent blue
            boxShadow: '0 -4px 15px rgba(17, 156, 75, 0.2)',
            marginTop: '40px',
            fontSize: '0.95em',
            width: '100%', // Ensure it spans full width
            boxSizing: 'border-box' // Include padding in width
        }}>
            <div className="footer-content" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                maxWidth: '1200px',
                margin: '0 auto',
                gap: '30px',
                padding: '0 15px' // Add horizontal padding for smaller screens
            }}>
                {/* About Us Section */}
                <div className="footer-section about" style={footerSectionStyle}>
                    <h3 style={footerHeadingStyle}>About Us</h3>
                    <p style={{margin: '0', lineHeight: '1.6'}}>
                       Your window to the world. Access every headline, in any language — translated, summarized, and spoken by AI, so you never miss a story.
                    </p>
                </div>

                {/* Contact Us Section */}
                <div className="footer-section contact" style={footerSectionStyle}>
                    <h3 style={footerHeadingStyle}>Contact Us</h3>
                    <p style={{margin: '0 0 10px 0', lineHeight: '1.6'}}> {/* Added bottom margin */}
                        Email: <a href="mailto:sacha.faouz@gmail.com" style={footerLinkStyle}>sacha.faouz@gmail.com</a>
                    </p>
                    <p style={{margin: '0', lineHeight: '1.6'}}>
                        Phone: <a href={`tel:${phoneNumber}`} style={footerLinkStyle}>{formattedPhoneNumber}</a>
                    </p>
                    <div className="social-icons" style={{
                        marginTop: '20px',
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'center'
                    }}>
                        {/* Assuming Font Awesome is linked in public/index.html */}
                        <a href="#" aria-label="Facebook" style={socialIconStyle}><i className="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Twitter" style={socialIconStyle}><i className="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Instagram" style={socialIconStyle}><i className="fab fa-instagram"></i></a>
                        <a href="#" aria-label="LinkedIn" style={socialIconStyle}><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>

                {/* Quick Links Section (The "special" something) */}
                <div className="footer-section links" style={footerSectionStyle}>
                    <h3 style={footerHeadingStyle}>Quick Links</h3>
                    <ul style={{listStyle: 'none', padding: '0', margin: '0'}}>
                        <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Home</a></li>
                        <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Articles</a></li>
                        <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Privacy Policy</a></li>
                        <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Terms of Service</a></li>
                        <li style={{marginBottom: '10px'}}><a href="#" style={footerLinkStyle}>Support</a></li>
                    </ul>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="footer-bottom" style={{
                textAlign: 'center',
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(51, 155, 73, 0.27)',
                fontSize: '0.85em',
                color: 'var(--color-text-faded,rgb(46, 109, 60))' // Fallback lighter grey
            }}>
                &copy; {copyrightYear} Sacha Faouz. All rights reserved. | Built with Node.js & React
            </div>
        </footer>
    );
}

// Inline styles for reusability and to keep JSX cleaner
const footerSectionStyle = {
    flex: '1',
    minWidth: '200px',
    marginBottom: '20px',
    textAlign: 'left' // Default to left-align, responsive CSS will center
};

const footerHeadingStyle = {
    color: 'var(--color-accent-blue,rgb(255, 255, 255))', // Fallback accent color
    marginBottom: '20px',
    fontSize: '1.2em',
    position: 'relative',
    paddingBottom: '10px',
    fontWeight: 'bold'
};

const footerLinkStyle = {
    color: 'var(--color-text-light,rgb(39, 180, 81))',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
};

const socialIconStyle = {
    color: 'var(--color-text-light, #ecf0f1)',
    fontSize: '1.5em',
    transition: 'color 0.3s ease, transform 0.3s ease'
};