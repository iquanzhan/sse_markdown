import { updateTagContent } from "./code-block";

// 跟踪处理标签内容的映射
const tagCollector = {
  currentTag: null,
  currentContent: "",
  tagRegex: /<(\w+)>([\s\S]*?)<\/\1>/g,
  startTagRegex: /<(\w+)>/g,
  endTagRegex: /<\/(\w+)>/g,
  isCollecting: false,
  tagId: null
};

// 重置收集器状态
function resetCollector() {
  tagCollector.currentTag = null;
  tagCollector.currentContent = "";
  tagCollector.isCollecting = false;
  tagCollector.tagId = null;
}

/**
 * 处理可能包含标签的文本
 * @param {string} text 要处理的文本
 */
function processTagContent(text) {
  // 如果当前正在收集标签内容
  if (tagCollector.isCollecting) {
    // 检查是否有结束标签
    const endTagPattern = new RegExp(`<\\/${tagCollector.currentTag}>`, 'g');
    const endMatch = endTagPattern.exec(text);
    
    if (endMatch) {
      // 找到结束标签，完成收集
      const endPos = endMatch.index;
      tagCollector.currentContent += text.substring(0, endPos);
      
      // 更新组件内容，设置完成状态为true
      if (tagCollector.tagId) {
        updateTagContent(tagCollector.tagId, tagCollector.currentContent, true);
        console.log(`标签 ${tagCollector.tagId} 已完成收集`);
      }
      
      // 重置收集器
      resetCollector();
      
      // 处理剩余部分文本
      if (endPos + endMatch[0].length < text.length) {
        processTagContent(text.substring(endPos + endMatch[0].length));
      }
    } else {
      // 继续收集内容
      tagCollector.currentContent += text;
      
      // 部分更新内容，设置完成状态为false
      if (tagCollector.tagId) {
        updateTagContent(tagCollector.tagId, tagCollector.currentContent, false);
        console.log(`标签 ${tagCollector.tagId} 正在收集中，当前长度: ${tagCollector.currentContent.length}`);
      }
    }
    return;
  }
  
  // 检查是否有开始标签
  const startTagRegex = /<(\w+)>/g;
  let startMatch;
  
  // 注意：exec是有状态的，需要在循环中使用
  while ((startMatch = startTagRegex.exec(text)) !== null) {
    // 找到开始标签，开始收集
    const tagName = startMatch[1];
    const startPos = startMatch.index;
    
    // 设置收集器状态
    tagCollector.currentTag = tagName;
    tagCollector.currentContent = "";
    tagCollector.isCollecting = true;
    tagCollector.tagId = `custom_tag_${tagName}_${Date.now()}`;
    
    // 初始化组件，设置完成状态为false
    updateTagContent(tagCollector.tagId, "", false);
    console.log(`开始收集标签 ${tagCollector.tagId}`);
    
    // 处理标签后的内容
    if (startPos + startMatch[0].length < text.length) {
      processTagContent(text.substring(startPos + startMatch[0].length));
      break; // 找到并处理了一个标签后就退出循环
    }
  }
}

export function* yieldContent(codeContent) {
  console.log("开始处理内容:", codeContent.substring(0, 30) + "...");
  
  let i = 0;
  // 重置标签收集器
  resetCollector();
  
  while (i < codeContent.length) {
    // 随机生成 1 到 20 之间的数
    const chunkSize = Math.floor(Math.random() * 20) + 1;
    // 获取一个片段
    const chunk = codeContent.slice(i, i + chunkSize);
    
    try {
      // 处理片段中可能的标签内容
      processTagContent(chunk);
    } catch (error) {
      console.error("处理标签内容时出错:", error);
    }
    
    yield chunk; // 一次性返回这部分字符
    i += chunkSize; // 更新索引，跳过已经返回的字符
    
    // 休眠 100ms
    yield new Promise((resolve) => setTimeout(resolve, 100));
  }
}
