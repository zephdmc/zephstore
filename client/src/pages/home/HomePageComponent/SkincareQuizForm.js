import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiChevronDown } from 'react-icons/fi';

const skinTypes = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive / Reactive', 'Not sure'];
const skinConcerns = [
  'Acne / Breakouts',
  'Hyperpigmentation',
  'Dark spots',
  'Dull skin',
  'Uneven tone',
  'Large pores',
  'Ageing / Fine lines',
  'Other'
];
const contactMethods = ['WhatsApp', 'SMS', 'Email'];

export default function SkincareQuizForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    skinType: '',
    skinConcerns: [],
    otherConcern: '',
    routineDescription: '',
    contactMethod: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSkinTypeDropdown, setShowSkinTypeDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleConcernChange = (concern) => {
    setFormData(prev => {
      const concerns = [...prev.skinConcerns];
      if (concerns.includes(concern)) {
        return { ...prev, skinConcerns: concerns.filter(c => c !== concern) };
      } else {
        return { ...prev, skinConcerns: [...concerns, concern] };
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.skinType) newErrors.skinType = 'Please select your skin type';
    if (formData.skinConcerns.length === 0) newErrors.skinConcerns = 'Please select at least one concern';
    if (!formData.contactMethod) newErrors.contactMethod = 'Please select a contact method';
    if (!formData.consent) newErrors.consent = 'Consent is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors({});

    // Prepare the form payload
    const payload = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      skinType: formData.skinType,
      skinConcerns: formData.skinConcerns.join(','),
      otherConcern: formData.otherConcern,
      routineDescription: formData.routineDescription,
      contactMethod: formData.contactMethod,
      consent: formData.consent ? 'true' : 'false'
    };

    // Create hidden iframe for submission
    const iframe = document.createElement('iframe');
    iframe.name = 'submit-iframe-' + Date.now();
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Create form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbw692QxPLyirY9i1vOgyU7NitKJMOfbr1dMvzhFqszFmqZyHd_ywRMiYtvA3l-StpvF/exec';
    form.target = iframe.name;
    form.style.display = 'none';

    // Add all fields to the form
    Object.entries(payload).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // Submit the form
    document.body.appendChild(form);
    form.submit();
    
    // Clean up and show success
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 3000);
  };

  // ... rest of your component code remains the same ...
}
