import MarkdownIt from "markdown-it";
import emoji from "markdown-it-emoji";
import deflist from "markdown-it-deflist";
import abbr from "markdown-it-abbr";
import footnote from "markdown-it-footnote";
import ins from "markdown-it-ins";
import mark from "markdown-it-mark";
import taskLists from "markdown-it-task-lists";
import container from "markdown-it-container";
import toc from "markdown-it-toc-done-right";
import mermaid from "@DatatracCorporation/markdown-it-mermaid";
import { getAllCustomTags } from "./custom-tags";

var config = {
  html: true,
  xhtmlOut: true,
  breaks: true,
  langPrefix: "lang-",
  linkify: false,
  typographer: true,
  quotes: "“”‘’",
};
let markdownIt = new MarkdownIt(config);

markdownIt
  .use(emoji)
  .use(deflist)
  .use(abbr)
  .use(footnote)
  .use(ins)
  .use(mark)
  .use(taskLists)
  .use(container)
  .use(container, "hljs-left")
  .use(container, "hljs-center")
  .use(container, "hljs-right")
  .use(toc)
  .use(mermaid);

let chunkCounter = 0;

// 添加自定义标签渐进式解析插件
markdownIt.use((md) => {
  // 预处理markdown源文本，处理开始标签和结束标签
  const originalParse = md.parse;
  md.parse = function (src, env) {
    // 获取所有已注册的自定义标签
    const customTags = getAllCustomTags();
    let modifiedSrc = src;


    for (const tagName of customTags) {
      // 创建开始和结束标签的正则表达式
      const startTagRegex = new RegExp(`<${tagName}>`, "g");
      const fullTagRegex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, "gs");

      // 查找完整的标签对并处理
      const matches = [...modifiedSrc.matchAll(fullTagRegex)];
      for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];
        const content = match[1];
        const index = match.index;
        const fullMatch = match[0];
        
        const chunkId = `custom_tag_${tagName}_${index}`;

        // 使用 substring 和索引进行替换
        const replacement = `<div class="custom-tag" data-tag-id="${chunkId}" data-tag-name="${tagName}" data-tag-complete="true" data-tag-content="${encodeURIComponent(content)}"></div>`;
        
        modifiedSrc = modifiedSrc.substring(0, index) + replacement + modifiedSrc.substring(index + fullMatch.length);
      }

      // 如果仍有未匹配的开始标签，创建占位符
      let startMatches = [...modifiedSrc.matchAll(startTagRegex)];
      for (const match of startMatches) {
        const startIndex = match.index;
        const chunkId = `custom_tag_${tagName}_${startIndex}`;

        //获取匹配标签之后的内容
        const afterContent = modifiedSrc.substring(
          startIndex + tagName.length + 2
        );

        // 替换开始标签为占位符
        modifiedSrc =
          modifiedSrc.substring(0, startIndex) +
          `<div class="custom-tag" data-tag-id="${chunkId}" data-tag-name="${tagName}" data-tag-content="${encodeURIComponent(
            afterContent
          )}" data-tag-complete="false"></div>`;
      }
    }

    // 调用原始解析函数处理修改后的文本
    return originalParse.call(this, modifiedSrc, env);
  };
});

export default markdownIt;
