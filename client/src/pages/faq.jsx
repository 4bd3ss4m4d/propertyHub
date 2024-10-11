import React, { useEffect, useState } from 'react';
import '../assets/styles/faq.css';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch FAQs from the API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('/api/faqs');
        if (!response.ok) {
          throw new Error("Failed to fetch FAQs");
        }
        const data = await response.json();
        setFaqs(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (id) => {
    setFaqs(faqs.map(faq => faq._id === id ? { ...faq, open: !faq.open } : faq));
  };

  return (
    <div className="faq-page">
      {/* FAQ Section */}
      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>
        {loading && <p>Loading FAQs...</p>}
        {error && <p>Error loading FAQs: {error}</p>}

        {!loading && !error && faqs.length === 0 && <p>No FAQs available at the moment.</p>}

        {!loading && !error && faqs.length > 0 && (
          <div className="faq-list">
            {faqs.map(faq => (
              <div key={faq._id} className={`faq-item ${faq.open ? 'open' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(faq._id)}>
                  {faq.question}
                  <span className="faq-toggle">{faq.open ? '-' : '+'}</span>
                </div>
                {faq.open && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                    {faq.tags && faq.tags.length > 0 && (
                      <div className="faq-meta">
                        {faq.tags.map(tag => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;