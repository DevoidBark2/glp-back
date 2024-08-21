import { TYPES_VERTEX } from '../settings/enum/type_vertex.enum';

export enum UserRole {
  SUPER_ADMIN = 'superadmin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  MODERATOR = 'moderator',
}

export const DEFAULT_SETTINGS_FOR_NEW_USER = {
  VERTEX_COLOR: '#40b860',
  EDGE_COLOR: '#e01710',
  TYPE_VERTEX: TYPES_VERTEX.CIRCLE,
  BORDER_VERTEX: '#000',
  ENABLED_GRID: true,
  BACKGROUND_COLOR: null,
};
