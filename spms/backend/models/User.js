const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    enrollment: {
      type: String,
      required: [true, 'Enrollment number is required'],
      unique: true,
      trim: true
    },
    department: {
      type: String,
      default: 'Computer Science Engineering',
      trim: true
    },
    semester: {
      type: String,
      default: 'Semester 1',
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    mobile: {
      type: String,
      default: '',
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    salt: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving (Mongoose 9 compatible hook)
userSchema.pre('save', function () {
  if (!this.isModified('password')) return;

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(this.password, salt, 1000, 64, 'sha512').toString('hex');
  this.salt = salt;
  this.password = hash;
});

// Method to verify password
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.salt) {
    return this.password === candidatePassword;
  }
  const hash = crypto.pbkdf2Sync(candidatePassword, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.password === hash;
};

// Return user object without sensitive fields
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.salt;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
