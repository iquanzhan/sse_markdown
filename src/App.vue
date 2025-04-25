<template>
  <div class="article-details">
    <div class="container">
      <div class="post-body">
        <div class="article-content" id="article-content"></div>
      </div>
      <div class="custom-sse-content">
        <div class="proj-description">
          <a href="https://github.com/pldz1/AIGC_Playground/tree/master/samples/sse_markdown" target="_blank" rel="noopener noreferrer"
            >1️⃣ Github 源码: https://github.com/pldz1/AIGC_Playground/tree/master/samples/sse_markdown</a
          >
          <a href="https://blog.csdn.net/qq_42727752/article/details/145092638" target="_blank" rel="noopener noreferrer">
            2️⃣ CSDN 博客介绍: https://blog.csdn.net/qq_42727752/article/details/145092638</a
          >
          <a href="https://juejin.cn/post/7458656534718316595" target="_blank" rel="noopener noreferrer">
            3️⃣ 掘金 博客介绍: https://juejin.cn/post/7458656534718316595</a
          >
          <a href="https://pldz1.com/codespace" target="_blank" rel="noopener noreferrer"> 4️⃣ 其他有趣内容: https://pldz1.com/codespace</a>
        </div>

        <textarea id="code-content" class="ref-content-textarea" :placeholder="placeholder"></textarea>
        <button class="start-btn" @click="yieldedSSEContent">开始模仿SSE</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import markdownIt from "./module/markdown-it";
import { deepCloneAndUpdate, buildCodeBlock } from "./module/code-block.js";
import { yieldContent } from "./module/server.js";
import { processCustomTags } from "./module/code-block.js";

const placeholder =
  '🎉当然！以下是一个使用Python实现的冒泡排序算法的示例：\n\n<think>思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容，思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容。思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容，思考内容思考内容思考内容思考内容思考内容思考内容思考内容思考内容</think>\n\n```python\ndef bubble_sort(arr):\n    n = len(arr)\n    # 遍历所有数组元素\n    for i in range(n):\n        # 最后i个元素已经是有序的\n        for j in range(0, n-i-1):\n            # 如果当前元素大于下一个元素，则交换它们测试最大的长度 ============================================================================================================ ==========\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n        # 打印每一轮排序结果用于调试\n        print(f"第{i+1}轮排序结果: {arr}")\n    return arr\n\n# 示例数组\narr = [64, 34, 25, 12, 22, 11, 90]\nprint("初始数组:", arr)\n\n# 调用冒泡排序函数\nsorted_arr = bubble_sort(arr)\nprint("排序后的数组:", sorted_arr)\n```\n\n在这个代码中：\n1. `bubble_sort`函数接受一个列表作为参数，并对其进行冒泡排序。\n2. 外层循环控制遍历的轮数。\n3. 内层循环用于比较和交换相邻的元素。\n4. 每一轮结束后，最大的元素都会被“冒泡”到列表的末尾。\n5. 在排序过程中，会打印出每一轮排序的中间结果，方便调试和观察排序过程。\n\n运行此代码将会输出每一轮排序后的数组状态，最终输出完全排序的数组。';

let htmlData = "";
let el = null;
let isRendering = false;
const renderQueue = [];

/** Step 4. 渲染markdown的 HTML Element. */
const renderMarkdown = (data) => {
  if (!el) el = document.getElementById("article-content");
  if (!el) return;

  const tmpDiv = document.createElement("div");
  tmpDiv.innerHTML = markdownIt.render(data); // 只渲染当前的块
  buildCodeBlock(tmpDiv);

  // 这里不再拼接 htmlData，而是每次渲染独立的块
  deepCloneAndUpdate(el, tmpDiv);

  //处理自定义标签
  processCustomTags(el);
};

/** Step 3. 处理异步渲染 */
const processRenderQueue = () => {
  if (renderQueue.length === 0) {
    isRendering = false; // 队列为空时标记渲染完成
    return;
  }

  const data = renderQueue.shift(); // 获取并移除队列中的第一个渲染任务
  renderMarkdown(data); // 执行渲染操作

  // 继续处理下一个渲染任务
  setTimeout(processRenderQueue, 0);
};

/** Step 2. 异步队列控制渲染, 并且只用最新的, 防抖处理 */
const enqueueRender = (data) => {
  htmlData += data; // 用最新数据覆盖
  renderQueue.length = 0; // 清空旧队列
  renderQueue.push(htmlData); // 只保留当前这次
  // 如果当前没有渲染任务在进行，启动渲染队列
  if (!isRendering) {
    isRendering = true;
    processRenderQueue();
  }
};

/** Step 1. 处理 SSE 返回的内容. */
const processStep = (generator) => {
  // 获取下一个值
  const result = generator.next();

  // 如果生成器结束，停止并设置 state 为 "done"
  if (result.done) {
    // 渲染生成器最后的值
    enqueueRender("");
    return;
  }

  if (result.value instanceof Promise) {
    // 如果值是 Promise，等待它完成再继续
    result.value
      .then(() => {
        // 继续执行下一个步骤
        processStep(generator);
      })
      .catch((error) => {
        console.error("Error occurred during promise resolution:", error);
      });
  } else {
    // 将当前的部分内容加入队列进行渲染
    enqueueRender(result.value);
    // 继续下一步
    processStep(generator);
  }
};

/** Step 0. 开始 SSE 模拟 */
const yieldedSSEContent = () => {
  // 重置 Demo 的div
  const el = document.getElementById("article-content");
  if (el) {
    htmlData = "";
    el.innerHTML = "";
  }

  // 正式的 DEMO 开始, 获取生成器
  const generator = yieldContent(document.getElementById("code-content").value || placeholder);
  // 开始处理生成器的每一步
  processStep(generator);
};
</script>

<style lang="less" scoped>
.article-details {
  height: 100vh;
  width: 100vw;
}

.start-btn {
  height: 32px;
  width: 200px;
  background-color: bisque;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #d8f1f5;
}

.custom-sse-content {
  width: 40%;
  padding: 16px;
}

.proj-description {
  height: auto;
  margin-bottom: 8px;
  font-size: 13px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  white-space: nowrap;
  width: 100%;

  a {
    text-overflow: ellipsis;
  }
}

.ref-content-textarea {
  height: calc(100vh - 180px);
  width: 100%;
}

.post-body {
  margin-left: 20px;
  width: 50%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: var(--card-box-shadow);
  padding: 30px 40px;
  box-sizing: border-box;

  :deep(.article-content) {
    img {
      display: block;
      margin: 15px auto 15px;
      border-radius: 6px;
      width: 100%;
      cursor: pointer;
      cursor: zoom-in;
      box-shadow: 0 1px 15px rgba(27, 31, 35, 0.15), 0 0 1px rgba(106, 115, 125, 0.35);
    }

    h1 code,
    h2 code,
    h3 code,
    h4 code,
    h5 code,
    h6 code,
    p > code,
    li > code,
    table code {
      color: #c7254e;
      line-height: 1.2;
      font-family: consolas !important;
      vertical-align: middle;
      margin: 0 3px;
      background-color: #f9f2f4 !important;
      font-size: 14px !important;
      padding: 0.2em 0.3em !important;
      border-radius: 3px !important;
      border: 1px solid #f9f2f4 !important;
    }

    p {
      color: var(--text-color);
      font-size: 15px;
      line-height: 28px;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      overflow: hidden;
      -webkit-line-clamp: 4;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      color: #1f2d3d;
      transition: all 0.2s ease-out;
    }

    h4,
    h5,
    h6 {
      font-size: 16px;
    }

    h1 {
      font-size: 24px;
      margin: 10px 0;
    }

    h2 {
      font-size: 20px;
    }

    h3 {
      font-size: 17px;
    }

    /* 代码样式 */
    pre {
      white-space: pre;
      position: relative;
      border-radius: 7px;
      color: #bababa;
      background-color: #282c34;
      font-size: 14px;
      padding: 0;

      code {
        border: none;
        border-radius: 7px;
        font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace !important;
        line-height: 21px;
      }
    }

    kbd {
      background-color: #f7f7f7;
      color: #222325;
      border-radius: 0.25rem;
      border: 1px solid #cbcccd;
      box-shadow: 0 2px 0 1px #cbcccd;
      cursor: default;
      font-family: Arial, sans-serif;
      font-size: 0.75em;
      line-height: 1;
      min-width: 0.75rem;
      padding: 2px 5px;
      position: relative;
      top: -1px;

      &:hover {
        box-shadow: 0 1px 0 0.5px #cbcccd;
        top: 1px;
      }
    }

    a {
      color: #2d8cf0;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;

      &::after {
        content: "";
        display: block;
        width: 0;
        height: 1px;
        position: absolute;
        left: 0;
        bottom: -2px;
        background: #2d8cf0;
        transition: all 0.3s ease-in-out;
      }

      &:hover::after {
        width: 100%;
      }
    }

    hr {
      position: relative;
      margin: 20px 0;
      border: 2px dashed #bfe4fb;
      width: 100%;
      box-sizing: content-box;
      height: 0;
      overflow: visible;
      box-sizing: border-box;
    }

    hr::before {
      position: absolute;
      top: -11px;
      left: 2%;
      z-index: 1;
      color: #bfe4fb;
      content: "✂";
      font-size: 21px;
      line-height: 1;
      -webkit-transition: all 1s ease-in-out;
      -moz-transition: all 1s ease-in-out;
      -o-transition: all 1s ease-in-out;
      -ms-transition: all 1s ease-in-out;
      transition: all 1s ease-in-out;
    }

    hr:hover::before {
      left: calc(98% - 20px);
    }

    table {
      font-size: 15px;
      width: 100%;
      margin: 15px 0px;
      display: block;
      overflow-x: auto;
      border: none;
      border-collapse: collapse;
      border-spacing: 0;

      &::-webkit-scrollbar {
        height: 4px !important;
      }

      th {
        background: #bfe4fb;
        border: 1px solid #a6d6f5;
        white-space: nowrap;
        font-weight: 400;
        padding: 6px 15px;
        min-width: 100px;
      }

      td {
        border: 1px solid #a6d6f5;
        padding: 6px 15px;
        min-width: 100px;
      }
    }

    ul,
    ol {
      li {
        margin: 4px 0px;
      }
    }

    ul li {
      list-style: circle;

      &::marker {
        transition: all 0.4s;
        /* color: #49b1f5; */
        color: var(--theme-color);
        font-weight: 600;
        font-size: 1.05em;
      }

      &:hover::marker {
        color: #ff7242;
      }
    }

    blockquote {
      border: none;
      margin: 15px 0px;
      color: inherit;
      border-radius: 4px;
      padding: 1px 15px;
      border-left: 4px solid var(--theme-color);
      background-color: #f8f8f8;
    }
  }
}

@media screen and (max-width: 900px) {
  .post-body {
    width: 100%;
  }
}

@keyframes fadeInUp {
  from {
    margin-top: 50px;
    opacity: 0;
  }

  to {
    margin-top: 0;
    opacity: 1;
  }
}
</style>
