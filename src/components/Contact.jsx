import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MapPin, Headphones, Shield } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setIsSubmitting(true);
    // Simulate instantaneous graceful submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: 'general',
        message: ''
      });
    }, 600);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-subtitle">Reach Out Anytime</span>
          <h2 className="section-title">
            Have Questions? <span className="text-green">We're Here to Help</span>
          </h2>
          <p className="section-description">
            Whether you need assistance setting up your budget, have a feature suggestion, or want to inquire about security, our team is ready to assist.
          </p>
        </div>

        <div className="contact-grid">
          
          {/* Left Column: Direct Contact Details */}
          <div className="contact-info-col">
            <h3 className="contact-info-heading">Contact Information</h3>
            <p className="contact-info-subtext">
              Reach out directly through any of our official channels or submit the form. We respond to all inquiries within 2 hours during active business hours.
            </p>

            <div className="contact-cards-list">
              <div className="contact-card-item">
                <div className="contact-card-icon">
                  <Mail size={22} />
                </div>
                <div className="contact-card-content">
                  <h4>Email Support</h4>
                  <a href="mailto:support@fintrack.app" className="contact-link">support@fintrack.app</a>
                  <span className="contact-badge">Avg. response &lt; 2 hrs</span>
                </div>
              </div>

              <div className="contact-card-item">
                <div className="contact-card-icon">
                  <Headphones size={22} />
                </div>
                <div className="contact-card-content">
                  <h4>Dedicated Assistance</h4>
                  <p>In-app live chat support</p>
                  <span className="contact-subdetail">Mon – Fri: 9:00 AM – 8:00 PM EST</span>
                </div>
              </div>

              <div className="contact-card-item">
                <div className="contact-card-icon">
                  <MapPin size={22} />
                </div>
                <div className="contact-card-content">
                  <h4>Headquarters</h4>
                  <p>FinTrack Technologies Inc.</p>
                  <span className="contact-subdetail">Financial District, San Francisco, CA</span>
                </div>
              </div>
            </div>

            <div className="contact-security-box">
              <Shield size={20} className="text-green" />
              <div className="security-box-text">
                <strong>Your Privacy is Guaranteed</strong>
                <span>We never share or sell your contact information. Zero spam, ever.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="contact-success-state">
                <div className="success-icon-box">
                  <CheckCircle2 size={48} className="text-green" />
                </div>
                <h3 className="success-title">Message Sent Successfully!</h3>
                <p className="success-desc">
                  Thank you for reaching out to FinTrack. One of our support specialists has received your inquiry and will reply to your email shortly.
                </p>
                <button 
                  type="button" 
                  className="btn-contact-submit"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3 className="form-heading">Send Us a Direct Message</h3>

                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">Full Name *</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">Email Address *</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">Inquiry Topic</label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical & Account Support</option>
                    <option value="feature">Feature Request or Feedback</option>
                    <option value="security">Security & Privacy Questions</option>
                    <option value="partnership">Partnership & Business</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">Your Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="4"
                    required
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn-contact-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending Message...'
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
