<template>
  <div class="custom-think-wrapper" :class="{ 'is-complete': isComplete }">
    <div class="think-header">
      <span class="think-icon">🤔</span>
      <span class="think-title">思考过程</span>
      <span v-if="!isComplete" class="thinking-status">思考中...</span>
    </div>
    {{ isComplete }}<button @click="click">按钮</button>
    <div class="think-content">
      {{ content }}
    </div>
    <div v-if="!isComplete" class="loading-indicator">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 定义组件的属性
const props = defineProps({
  // 内容
  content: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

const click = () => {
  debugger;
  alert("click");
};
</script>

<style scoped>
.custom-think-wrapper {
  background-color: #f5f5f5;
  border-left: 4px solid #42b983;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.custom-think-wrapper.is-complete {
  background-color: #f5f5f5;
  border-left-color: #42b983;
}

.custom-think-wrapper:not(.is-complete) {
  background-color: #f9f9f9;
  border-left-color: #ffa500;
}

.think-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
  color: #42b983;
  position: relative;
}

.thinking-status {
  margin-left: auto;
  font-size: 12px;
  color: #ff9800;
  animation: blink 1.5s infinite;
}

.think-icon {
  margin-right: 8px;
  font-size: 20px;
}

.think-title {
  font-size: 16px;
}

.think-content {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.loading-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(66, 185, 131, 0.2);
  border-radius: 50%;
  border-top-color: #42b983;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes blink {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
