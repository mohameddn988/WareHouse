import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPreprocessingStep extends Document {
  _id: string;
  datasetId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  stepType: 'clean' | 'transform' | 'filter' | 'merge' | 'aggregate' | 'normalize' | 'encode' | 'other';
  stepName: string;
  description?: string;
  parameters: Record<string, any>;
  affectedColumns?: string[];
  rowsBefore?: number;
  rowsAfter?: number;
  executionTime?: number;
  status: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PreprocessingStepSchema = new Schema<IPreprocessingStep>(
  {
    datasetId: {
      type: Schema.Types.ObjectId,
      ref: 'Dataset',
      required: [true, 'Dataset ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    stepType: {
      type: String,
      enum: ['clean', 'transform', 'filter', 'merge', 'aggregate', 'normalize', 'encode', 'other'],
      required: [true, 'Step type is required'],
    },
    stepName: {
      type: String,
      required: [true, 'Step name is required'],
      trim: true,
      maxlength: [100, 'Step name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    parameters: {
      type: Schema.Types.Mixed,
      default: {},
    },
    affectedColumns: {
      type: [String],
      default: [],
    },
    rowsBefore: {
      type: Number,
      default: null,
    },
    rowsAfter: {
      type: Number,
      default: null,
    },
    executionTime: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
PreprocessingStepSchema.index({ datasetId: 1, createdAt: -1 });
PreprocessingStepSchema.index({ userId: 1, createdAt: -1 });

const PreprocessingStep: Model<IPreprocessingStep> = 
  mongoose.models.PreprocessingStep || mongoose.model<IPreprocessingStep>('PreprocessingStep', PreprocessingStepSchema);

export default PreprocessingStep;
