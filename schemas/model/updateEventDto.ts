/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Backend API
 * The API is used for powerfulyang.com
 * OpenAPI spec version: 1.0
 */
import type { UpdateEventDtoExtraFieldsItem } from './updateEventDtoExtraFieldsItem';

export interface UpdateEventDto {
  createdAt?: unknown;
  displayName: string;
  extraFields?: UpdateEventDtoExtraFieldsItem[];
  icon: string;
  name: string;
  updatedAt?: unknown;
}
