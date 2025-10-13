import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDataset extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: 'csv' | 'json' | 'excel' | 'xml' | 'yaml' | 'yml' | 'sql';
  fileData: Buffer;
  rowCount?: number;
  columnCount?: number;
  columns?: {
    name: string;
    type: string;
    nullable: boolean;
  }[];
  status: 'uploaded' | 'processing' | 'ready' | 'error';
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DatasetSchema = new Schema<IDataset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Dataset name is required'],
      trim: true,
      maxlength: [100, 'Dataset name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    fileType: {
      type: String,
      enum: ['csv', 'json', 'excel', 'xml', 'yaml', 'yml', 'sql'],
      required: [true, 'File type is required'],
    },
    fileData: {
      type: Buffer,
      required: [true, 'File data is required'],
    },
    rowCount: {
      type: Number,
      default: 0,
    },
    columnCount: {
      type: Number,
      default: 0,
    },
    columns: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        nullable: { type: Boolean, default: true },
      },
    ],
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'ready', 'error'],
      default: 'uploaded',
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
DatasetSchema.index({ userId: 1, createdAt: -1 });
DatasetSchema.index({ projectId: 1, createdAt: -1 });


const Dataset: Model<IDataset> = mongoose.models.Dataset || mongoose.model<IDataset>('Dataset', DatasetSchema);

export default Dataset;
