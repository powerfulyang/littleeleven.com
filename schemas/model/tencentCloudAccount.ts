/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Backend API
 * The API is used for powerfulyang.com
 * OpenAPI spec version: 1.0
 */
import type { CosBucket } from './cosBucket';

export interface TencentCloudAccount {
  AppId: string;
  buckets: CosBucket[];
  id: number;
  name: string;
  SecretId: string;
  SecretKey: string;
}