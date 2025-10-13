import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVisualization extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  datasetId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'histogram' | 'heatmap' | 'area' | 'box' | 'table' | 'other';
  config: {
    xAxis?: string;
    yAxis?: string | string[];
    groupBy?: string;
    filters?: Record<string, any>;
    colors?: string[];
    customOptions?: Record<string, any>;
  };
  thumbnail?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VisualizationSchema = new Schema<IVisualization>(
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
    datasetId: {
      type: Schema.Types.ObjectId,
      ref: 'Dataset',
      required: [true, 'Dataset ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Visualization name is required'],
      trim: true,
      maxlength: [100, 'Visualization name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    chartType: {
      type: String,
      enum: ['bar', 'line', 'pie', 'scatter', 'histogram', 'heatmap', 'area', 'box', 'table', 'other'],
      required: [true, 'Chart type is required'],
    },
    config: {
      xAxis: { type: String },
      yAxis: { type: Schema.Types.Mixed },
      groupBy: { type: String },
      filters: { type: Schema.Types.Mixed, default: {} },
      colors: { type: [String], default: [] },
      customOptions: { type: Schema.Types.Mixed, default: {} },
    },
    thumbnail: {
      type: String,
      default: null,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
VisualizationSchema.index({ userId: 1, createdAt: -1 });
VisualizationSchema.index({ projectId: 1, createdAt: -1 });
VisualizationSchema.index({ datasetId: 1, createdAt: -1 });

const Visualization: Model<IVisualization> = 
  mongoose.models.Visualization || mongoose.model<IVisualization>('Visualization', VisualizationSchema);

export default Visualization;
