// 临时测试脚本 - 在控制台中运行
console.log('=== 开始诊断按钮问题 ===');

// 检查按钮元素
const testBtnStop = document.getElementById('btn-stop-link');
const testBtnStart = document.getElementById('btn-start-link');

console.log('停止连接按钮:', testBtnStop);
console.log('启动连接按钮:', testBtnStart);

// 检查是否有事件监听器
if (testBtnStop) {
    console.log('停止连接按钮存在');
    // 手动添加测试监听器
    testBtnStop.addEventListener('click', () => {
        console.log('测试：停止连接按钮被点击！');
        alert('停止连接按钮被点击！');
    });
} else {
    console.error('停止连接按钮不存在！');
}

if (testBtnStart) {
    console.log('启动连接按钮存在');
    // 手动添加测试监听器
    testBtnStart.addEventListener('click', () => {
        console.log('测试：启动连接按钮被点击！');
        alert('启动连接按钮被点击！');
    });
} else {
    console.error('启动连接按钮不存在！');
}

console.log('=== 诊断完成，请点击按钮测试 ===');

