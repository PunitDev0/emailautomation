import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
      maxlength: [100, "Template name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      // enum: ["business", "newsletter", "promotional", "event", "announcement", "personal", "other", "welcome", "transactional", "abandoned-cart"],
      default: "other",
    },
    thumbnail: {
      type: String,
      default: null,
    },
    blocks: [
      {
        id: { type: String, required: true },
        type: {
          type: String,
          required: true,
          enum: [
            "text",
            "image",
            "button",
            "social",
            "divider",
            "spacer",
            "columns",
            "video",
            "countdown",
            "survey",
            "form",
            "map",
            "chart",
            "testimonial",
            "pricing",
            "gallery",
            "qr",
            "calendar",
          ],
        },
        content: { type: mongoose.Schema.Types.Mixed, required: true },
        styles: { type: mongoose.Schema.Types.Mixed, required: true },
        position: {
          x: { type: Number, default: 0 },
          y: { type: Number, default: 0 },
        },
        responsive: {
          mobile: { type: mongoose.Schema.Types.Mixed },
          tablet: { type: mongoose.Schema.Types.Mixed },
          desktop: { type: mongoose.Schema.Types.Mixed },
        },
      },
    ],
    styles: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      version: { type: String, default: "1.0.0" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      createdBy: { type: String, default: null },
      tags: [{ type: String, trim: true }],
      isPublic: { type: Boolean, default: false },
      isPremium: { type: Boolean, default: false }, // Added for TemplatesPage
      usageCount: { type: Number, default: 0 },
      rating: { type: Number, default: 0, min: 0, max: 5 }, // Added for TemplatesPage
    },
    responsive: {
      mobile: { type: mongoose.Schema.Types.Mixed, default: {} },
      tablet: { type: mongoose.Schema.Types.Mixed, default: {} },
      desktop: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better performance
TemplateSchema.index({ name: 1 })
TemplateSchema.index({ category: 1 })
TemplateSchema.index({ "metadata.createdBy": 1 })
TemplateSchema.index({ "metadata.isPublic": 1 })
TemplateSchema.index({ "metadata.tags": 1 })
TemplateSchema.index({ "metadata.createdAt": -1 })

// Virtual for template URL
TemplateSchema.virtual("url").get(function () {
  return `/templates/${this._id}`
})

// Pre-save middleware to update the updatedAt timestamp
TemplateSchema.pre("save", function (next) {
  this.metadata.updatedAt = new Date()
  next()
})

// Static method to find public templates
TemplateSchema.statics.findPublic = function () {
  return this.find({ "metadata.isPublic": true }).sort({ "metadata.createdAt": -1 })
}

// Instance method to increment usage count
TemplateSchema.methods.incrementUsage = function () {
  this.metadata.usageCount += 1
  return this.save()
}

export default mongoose.models.Template || mongoose.model("Template", TemplateSchema)