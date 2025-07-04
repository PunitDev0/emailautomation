import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    default: '',
  },
  company: {
    type: String,
    trim: true,
    default: '',
  },
  custom1: {
    type: String,
    trim: true,
    default: '',
  },
  custom2: {
    type: String,
    trim: true,
    default: '',
  },
  listName: {
    type: String,
    required: [true, 'List name is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;
