/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Backend API
 * The API is used for powerfulyang.com
 * OpenAPI spec version: 1.0
 */
import type { OauthApplicationPlatformName } from './oauthApplicationPlatformName';

export interface OauthApplication {
  callbackUrl: string;
  clientId: string;
  clientSecret: string;
  createdAt: string;
  id: number;
  platformName: OauthApplicationPlatformName;
  updatedAt: string;
}