import mongoose, { Schema, Document } from 'mongoose'

export interface IContent extends Document {
  userId: mongoose.Types.ObjectId
  templateId: string
  templateName: string
  title: string
  content: string
  inputs: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

const ContentSchema = new Schema<IContent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    templateId: {
      type: String,
      required: true,
    },
    templateName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    inputs: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
ContentSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema)