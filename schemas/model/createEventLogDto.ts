/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Backend API
 * The API is used for powerfulyang.com
 * OpenAPI spec version: 1.0
 */
import type { CreateEventLogDtoExtra } from './createEventLogDtoExtra';

export interface CreateEventLogDto {
  comment?: string;
  createdAt?: unknown;
  eventName: string;
  eventTime?: unknown;
  extra?: CreateEventLogDtoExtra;
  id?: number;
  updatedAt?: unknown;
}