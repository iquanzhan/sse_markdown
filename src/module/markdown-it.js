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

// 添加自定义标签解析插件
markdownIt.use((md) => {
  // 保存原始的渲染函数
  const defaultRender = md.renderer.rules.text || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  // 预处理markdown源文本，直接在源文本层面处理自定义标签
  const originalParse = md.parse;
  md.parse = function(src, env) {
    // 处理自定义标签
    const customTags = getAllCustomTags();
    let modifiedSrc = src;
    
    console.log("处理Markdown文本:", src.substring(0, 100) + "...");
    
    // 为每个注册的标签创建正则表达式
    customTags.forEach(tagName => {
      const tagRegex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, 'gs');
      
      modifiedSrc = modifiedSrc.replace(tagRegex, (match, content) => {
        console.log(`找到${tagName}标签:`, content.substring(0, 30) + "...");
        return `<div class="custom-tag" data-tag-name="${tagName}" data-tag-content="${encodeURIComponent(content)}"></div>`;
      });
    });
    
    // 调用原始解析函数处理修改后的文本
    return originalParse.call(this, modifiedSrc, env);
  };
});

export default markdownIt;
