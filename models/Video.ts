import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1920,
  height: 1080
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  videoFileId?: string;      // ✅ ImageKit video file ID
  thumbnailFileId?: string;  // ✅ ImageKit thumbnail file ID
  userId: string;            // ✅ owner
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    thumbnailUrl: { type: String, required: false},
    videoUrl: { type: String, required: true },
    videoFileId: { type: String },
    thumbnailFileId: { type: String },
    userId: { type: String, required: true, index: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  {
    timestamps: true
  }
);

videoSchema.index({ userId: 1, createdAt: -1 });

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;