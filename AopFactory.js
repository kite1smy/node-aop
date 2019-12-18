'use strict';

const isReg = Symbol('isReg');
const proxy = Symbol('proxy');

class AopFactory {
    // 构造函数
  constructor(before, after, around) {
    if (typeof before === 'function') {
      this.before = before;
    }
    if (typeof after === 'function') {
      this.after = after;
    }
    if (typeof around === 'function') {
      this.around = around;
    }
  }

  [isReg](v) {
      // 判断表达式是否为正则
    let isReg;
    try {
          // eslint-disable-next-line no-eval
      isReg = eval(v) instanceof RegExp;
    } catch (e) {
      isReg = false;
    }
    return isReg;
  }

  [proxy](originFun) {  // 该方法的this 是工厂
    const _self = this;
    let result;          // 保存目标函数的执行结果
    async function JoinPoint(...args) {  // 该方法的this,是传入的pointcut传入的target对象
      if (_self.before) {
        result = _self.before.apply(this, args);
      }

      if (_self.around) {
        result = await _self.around({
          funcName: originFun.name,
          args,
          proceed() {
            return originFun.apply(this, args);
          },
        });
      } else {
        result = originFun.apply(this, args);
      }

      if (_self.after) {
        result = _self.after.apply(this, args);
      }
      return result;
    }
    return JoinPoint;
  }


  pointcut(target, execution = 'allFunction') {
    if (typeof target !== 'object') {
      throw new Error('target 必须为一个类');
    }
      // 如果 execution 是正则表达式 或者自定义值
    if (this[isReg](execution)) {
      for (const funName in target) {
        if (typeof target[funName] === 'function' && execution.test(funName)) {
          target[funName] = this[proxy](target[funName]);  // 代理
        }
      }
      return;
    } else if (execution === 'allFunction') {
      for (const funName in target) {
        target[funName] = this[proxy](target[funName]);  // 代理
      }
      return;
    }
    let funName;
    if (execution === 'function') {
      funName = target.name;
    } else if (typeof a === 'string') {
      funName = target;
    } else {
      throw new Error('无效的表达式,execution可以是被代理的 函数对象,函数名,或者正则,或者 allFunction');
    }
    if (target[funName]) {
      target[funName] = proxy(target[funName]);
    }
  }

}

exports.AopFactory = AopFactory;
