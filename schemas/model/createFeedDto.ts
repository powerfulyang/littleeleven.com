/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Backend API
 * The API is used for powerfulyang.com
 * OpenAPI spec version: 1.0
 */
import type { User } from './user';

export interface CreateFeedDto {
  assets: unknown[];
  content: string;
  createBy: User;
  public?: boolean;
}
