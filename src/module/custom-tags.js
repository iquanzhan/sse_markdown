/**
 * 自定义标签管理模块
 * 用于注册和管理自定义标签与Vue组件的映射关系
 */
import ThinkComponent from '../components/ThinkComponent.vue';

// 存储标签与组件的映射关系
const customTags = new Map();

/**
 * 注册自定义标签
 * @param {string} tagName - 标签名称，例如 'think'
 * @param {Object} component - Vue组件对象或组件配置
 */
export function registerCustomTag(tagName, component) {
  customTags.set(tagName.toLowerCase(), component);
}

/**
 * 获取标签对应的组件
 * @param {string} tagName - 标签名称
 * @returns {Object|null} - 返回对应的组件或null
 */
export function getComponentForTag(tagName) {
  const component = customTags.get(tagName.toLowerCase()) || null;
  return component;
}

/**
 * 检查标签是否已注册
 * @param {string} tagName - 标签名称
 * @returns {boolean} - 是否已注册
 */
export function isCustomTag(tagName) {
  const exists = customTags.has(tagName.toLowerCase());
  return exists;
}

/**
 * 获取所有已注册的标签
 * @returns {Array<string>} - 已注册的标签名数组
 */
export function getAllCustomTags() {
  return Array.from(customTags.keys());
}

// 预注册think标签，使用实际的ThinkComponent组件
registerCustomTag('think', ThinkComponent);

// 添加更多自定义标签
// 例如: registerCustomTag('code', CodeComponent);
// 例如: registerCustomTag('note', NoteComponent); 