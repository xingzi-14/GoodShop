
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100vh;
  width: 100vw;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5;
  color: #303133;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
  transition: background 0.3s;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* Element Plus 全局微调 */
.el-card {
  border-radius: 8px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
  border: none !important;
  transition: box-shadow 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

.el-button {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.el-button--primary {
  background: linear-gradient(135deg, #409eff, #337ecc);
  border: none;
}

.el-button--primary:hover {
  background: linear-gradient(135deg, #66b1ff, #409eff);
}

.el-table {
  border-radius: 6px;
  overflow: hidden;
}

.el-table th.el-table__cell {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: 600;
}

.el-pagination {
  font-weight: normal;
}

.el-tabs__item {
  font-weight: 500;
}

/* 输入框聚焦效果 */
.el-input__wrapper {
  border-radius: 6px !important;
  transition: box-shadow 0.3s ease;
}

.el-select .el-input__wrapper {
  border-radius: 6px !important;
}
</style>
