/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * My API
 * OpenAPI spec version: 1.0.0
 */
import type { GetApiMoment200DataItemAttachmentsItem } from './getApiMoment200DataItemAttachmentsItem';
import type { GetApiMoment200DataItemType } from './getApiMoment200DataItemType';

export type GetApiMoment200DataItem = {
  attachments: GetApiMoment200DataItemAttachmentsItem[];
  content: string;
  createdAt: string;
  id: number;
  type?: GetApiMoment200DataItemType;
  updatedAt: string;
};
