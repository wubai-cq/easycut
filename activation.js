const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');
const { query } = require('./other');

class ActivationManager {
  constructor() {
    this.activationFile = path.join(os.homedir(), '.easycut', 'uck.dll');
    this.ensureActivationDir();
    // （伪造文件）。
    this.localSecret = 'e3c1c2aa-9c2c-4f5e-9b7c-9f7b1b7a8f12';
  }

  // 确保激活存在
  ensureActivationDir() {
    const dir = path.dirname(this.activationFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // 获取标识
  getuuid() {
    // 优先使用 Windows不受网卡更换影响
    if (process.platform === 'win32') {
      try {
        // 查询表: HKLM\SOFTWARE\Microsoft\Cryptography\MachineGuid
        const output = execSync('reg query "HKLM\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid', {
          stdio: ['ignore', 'pipe', 'ignore']
        }).toString('utf8');
        const match = output.match(/MachineGuid\s+REG_SZ\s+([\w-]+)/i);
        if (match && match[1]) {
          return match[1].trim();
        }
      } catch {}
    }

    // 回退到 MAC 地址
    try {
      const networkInterfaces = os.networkInterfaces();
      const macAddresses = [];
      for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
          if (iface && iface.mac && iface.mac !== '00:00:00:00:00:00') {
            macAddresses.push(iface.mac);
          }
        }
      }
      return macAddresses[0] || 'unknown';
    } catch (error) {
      console.error('获取ID失败:', error);
      return 'unknown';
    }
  }

  // 校
  validateActivationCode(code) {
    
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
      { pos: 0, type: 'letter' },
      { pos: 1, type: 'digit' },
      { pos: 2, type: 'letter' },
      { pos: 3, type: 'digit' },
      { pos: 4, type: 'digit' },
      { pos: 5, type: 'letter' },
      { pos: 6, type: 'digit' },
      { pos: 7, type: 'digit' },
      { pos: 8, type: 'letter' },
      { pos: 9, type: 'letter' },
      { pos: 10, type: 'digit' },
      { pos: 11, type: 'letter' },
      { pos: 12, type: 'alphanumeric' },
      { pos: 13, type: 'alphanumeric' },
      { pos: 14, type: 'alphanumeric' },
      { pos: 15, type: 'alphanumeric' }
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
        return { activated: false, uuid: this.getuuid() };
      }

      const data = fs.readFileSync(this.activationFile, 'utf8');
      const activation = JSON.parse(data);
      
      // 检查ID是否匹配
      const currentuuid = this.getuuid();

      // 验证本地签名，防止随意伪造 
      const activatedAt = activation.activatedAt || '';
      const payload = `${activation.activationCode}:${activatedAt}:${currentuuid}`;
      const expectedSig = crypto
        .createHmac('sha256', this.localSecret)
        .update(payload)
        .digest('hex');
      if (!activation.signature || activation.signature !== expectedSig) {
        return { activated: false, uuid: currentuuid };
      }

      return {
        activated: activation.activated || false,
        uuid: currentuuid, // 内部返回真实uuid，文件中无uuid字段
        activationCode: activation.activationCode,
        activatedAt: activation.activatedAt
      };
    } catch (error) {
      console.error('读取激活状态失败:', error);
      return { activated: false, uuid: this.getuuid() };
    }
  }

  // 保存激活状态（包含签名，防止本地伪造）
  saveActivationStatus(activationCode) {
    try {
      const uuid = this.getuuid();
      const activatedAt = new Date().toISOString();
      const payload = `${activationCode}:${activatedAt}:${uuid}`;
      const signature = crypto
        .createHmac('sha256', this.localSecret)
        .update(payload)
        .digest('hex');

      // 不再写 uuid 字段到文件
      const activation = {
        activated: true,
        activationCode: activationCode,
        activatedAt: activatedAt,
        signature: signature
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

  // 激活应用（数据库校验）
  async activate(activationCode) {
    // 1) 校验激活码格式
    const validation = this.validateActivationCode(activationCode);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    const cleanCode = validation.code;

    // 2) 如果本机已保存并且与本次相同，直接视为成功（避免重复注册）
    if (this.isCodeUsedOnThisMachine(cleanCode)) {
      return { success: true, message: '已激活' };
    }

    try {
   

      // 3) 查询是否存在于有效激活码表
      const validRows = await query(
        'SELECT id FROM valid_activation_codes WHERE validCode = ? LIMIT 1',
        [cleanCode]
      );
      if (validRows.length === 0) {
        return { success: false, error: '激活码不正确' };
      }

      // 4) 查询是否已在已使用表
      const usedRows = await query(
        'SELECT id FROM used_activation_codes WHERE usedCode = ? LIMIT 1',
        [cleanCode]
      );
      if (usedRows.length > 0) {
        return { success: false, error: '激活码已被使用' };
      }

      // 5) 将输入激活码注册到已使用表
      await query(
        'INSERT INTO used_activation_codes (usedCode) VALUES (?)',
        [cleanCode]
      );

      // 6) 保存本机激活状态
      const saveResult = this.saveActivationStatus(cleanCode);
      if (!saveResult.success) {
        return { success: false, error: saveResult.error };
      }

      return { success: true, message: '激活成功' };
    } catch (err) {
      // 仅在控制台记录详细错误，不向前端暴露细节
      try { console.error('（内部错误）')} catch {}
      return { success: false, error: '激活失败请检查网络连接' };
    }
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
