import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="social-icons" style={{ marginBottom: "10px" }}>
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-linkedin-in"></i></a>
      </div>

      <div className="footer-links" style={{ marginBottom: "10px" }}>
        <a href="#">Privacy Policy</a> · 
        <a href="#"> Terms of Service</a> · 
        <a href="#"> Contact Us</a>
      </div>

      <p>© 2025 Explore & Learn Blog. All rights reserved.</p>
    </footer>
  );
}
