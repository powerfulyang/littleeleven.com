/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Backend API
 * The API is used for powerfulyang.com
 * OpenAPI spec version: 1.0
 */

export interface CreateRoleDto {
  /** 角色拥有的菜单 */
  menus?: string[];
  /** 角色名称 */
  name: string;
  /** 权限列表 */
  permissions: string[];
}