/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Backend API
 * The API is used for powerfulyang.com
 * OpenAPI spec version: 1.0
 */
import type { User } from './user';
import type { PostLog } from './postLog';
import type { Asset } from './asset';

export interface Post {
  content: string;
  createBy: User;
  createdAt: string;
  id: number;
  logs: PostLog[];
  poster: Asset;
  public: boolean;
  publishYear: number;
  summary: string;
  tags: string[];
  title: string;
  updateBy: User;
  updatedAt: string;
}
