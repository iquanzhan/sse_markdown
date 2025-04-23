<template>
  <div class="custom-think-wrapper">
    <div class="think-header">
      <span class="think-icon">🤔</span>
      <span class="think-title">思考过程</span>
      333
    </div>
    <div class="think-content">
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThinkComponent',
  props: {
    content: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.custom-think-wrapper {
  background-color: #f5f5f5;
  border-left: 4px solid #42b983;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.think-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
  color: #42b983;
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
</style> 