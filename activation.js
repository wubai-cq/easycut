const fs = require('fs');
const path = require('path');
const os = require('os');

class ActivationManager {
  constructor() {
    this.activationFile = path.join(os.homedir(), '.easycut', 'activation.json');
    this.ensureActivationDir();
  }

  // 确保激活目录存在
  ensureActivationDir() {
    const dir = path.dirname(this.activationFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // 获取机器唯一标识
  getMachineId() {
    try {
      const networkInterfaces = os.networkInterfaces();
      const macAddresses = [];
      
      for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
          if (iface.mac && iface.mac !== '00:00:00:00:00:00') {
            macAddresses.push(iface.mac);
          }
        }
      }
      
      // 使用第一个有效的MAC地址作为机器标识
      return macAddresses[0] || 'unknown';
    } catch (error) {
      console.error('获取机器ID失败:', error);
      return 'unknown';
    }
  }

  // 校验激活码格式
  validateActivationCode(code) {
    // 激活码规则：N1Y6-7W44-JY3Q-E28A
    // 第1位：字母，第2位：数字，第3位：字母，第4位：数字
    // 第5位：数字，第6位：字母，第7位：数字，第8位：数字
    // 第9位：字母，第10位：字母，第11位：数字，第12位：字母
    // 最后四位：大写字母与数字组合随机
    
    if (!code || typeof code !== 'string') {
      return { valid: false, error: '激活码不正确' };
    }

    // 移除所有连字符并转换为大写
    const cleanCode = code.replace(/-/g, '').toUpperCase();
    
    if (cleanCode.length !== 16) {
      return { valid: false, error: '激活码不正确' };
    }

    // 定义位置规则
    const rules = [
      { pos: 0, type: 'letter', name: '第1位' },
      { pos: 1, type: 'digit', name: '第2位' },
      { pos: 2, type: 'letter', name: '第3位' },
      { pos: 3, type: 'digit', name: '第4位' },
      { pos: 4, type: 'digit', name: '第5位' },
      { pos: 5, type: 'letter', name: '第6位' },
      { pos: 6, type: 'digit', name: '第7位' },
      { pos: 7, type: 'digit', name: '第8位' },
      { pos: 8, type: 'letter', name: '第9位' },
      { pos: 9, type: 'letter', name: '第10位' },
      { pos: 10, type: 'digit', name: '第11位' },
      { pos: 11, type: 'letter', name: '第12位' },
      { pos: 12, type: 'alphanumeric', name: '第13位' },
      { pos: 13, type: 'alphanumeric', name: '第14位' },
      { pos: 14, type: 'alphanumeric', name: '第15位' },
      { pos: 15, type: 'alphanumeric', name: '第16位' }
    ];

    // 校验每一位
    for (const rule of rules) {
      const char = cleanCode[rule.pos];
      
      if (rule.type === 'letter') {
        if (!/[A-Z]/.test(char)) {
          return { valid: false, error: '激活码不正确' };
        }
      } else if (rule.type === 'digit') {
        if (!/[0-9]/.test(char)) {
          return { valid: false, error: '激活码不正确' };
        }
      } else if (rule.type === 'alphanumeric') {
        if (!/[A-Z0-9]/.test(char)) {
          return { valid: false, error: '激活码不正确' };
        }
      }
    }

    return { valid: true, code: cleanCode };
  }

  // 读取激活状态
  getActivationStatus() {
    try {
      if (!fs.existsSync(this.activationFile)) {
        return { activated: false, machineId: this.getMachineId() };
      }

      const data = fs.readFileSync(this.activationFile, 'utf8');
      const activation = JSON.parse(data);
      
      // 检查机器ID是否匹配
      const currentMachineId = this.getMachineId();
      if (activation.machineId !== currentMachineId) {
        return { activated: false, machineId: currentMachineId };
      }

      return {
        activated: activation.activated || false,
        machineId: currentMachineId,
        activationCode: activation.activationCode,
        activatedAt: activation.activatedAt
      };
    } catch (error) {
      console.error('读取激活状态失败:', error);
      return { activated: false, machineId: this.getMachineId() };
    }
  }

  // 保存激活状态
  saveActivationStatus(activationCode) {
    try {
      const activation = {
        activated: true,
        machineId: this.getMachineId(),
        activationCode: activationCode,
        activatedAt: new Date().toISOString()
      };

      fs.writeFileSync(this.activationFile, JSON.stringify(activation, null, 2));
      return { success: true };
    } catch (error) {
      console.error('保存激活状态失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 检查激活码是否已被当前机器使用
  isCodeUsedOnThisMachine(activationCode) {
    const status = this.getActivationStatus();
    return status.activated && status.activationCode === activationCode;
  }

  // 激活应用
  activate(activationCode) {
    // 校验激活码格式
    const validation = this.validateActivationCode(activationCode);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // 检查是否已被当前机器使用
    if (this.isCodeUsedOnThisMachine(validation.code)) {
      return { success: false, error: '此激活码已在本机使用过' };
    }

    // 保存激活状态
    const saveResult = this.saveActivationStatus(validation.code);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }

    return { success: true, message: '激活成功' };
  }

  // 重置激活状态（用于测试）
  resetActivation() {
    try {
      if (fs.existsSync(this.activationFile)) {
        fs.unlinkSync(this.activationFile);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = ActivationManager;
