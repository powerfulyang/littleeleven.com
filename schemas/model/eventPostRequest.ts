/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * My API
 * OpenAPI spec version: 1.0.0
 */
import type { EventExtraFields } from './eventExtraFields';

export interface EventPostRequest {
  displayName: string;
  extraFields?: EventExtraFields;
  icon: string;
  name: string;
}