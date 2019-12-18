

'use strict';

const { AopFactory } = require('./AopFactory');


const service = {};

service.calcAdd = function calcAdd(a, b) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${a}+${b}=${a + b}`);
      resolve(a + b);
    }, 2000);
  });
};

service.calcAdd2 = function calcAdd(a, b) {
  console.log(`${a}+${b}=${a + b}`);
  return a + b;
};
service.calcAdd3 = function calcAdd(a, b, c) {
  console.log(`${a}+${b}+${c}=${a + b + c}`);
  return a + b + c;
};

const timer = new AopFactory();

timer.around = async (pjp) => {
  const d = Date.now();
  const newVar = await pjp.proceed();

  console.log(`方法${pjp.funcName} 执行耗时:${Date.now() - d}ms`);
  return newVar;
};

timer.pointcut(service);

const log = new AopFactory();

log.around = async (pjp) => {
  try {
    console.log(`方法${pjp.funcName} 调用开始,参数:`, pjp.args);
    const newVar = await pjp.proceed();
    console.log(`方法${pjp.funcName} 调用成功,返回结果:`, newVar);
    return newVar;
  } catch (e) {
    console.log(`方法${pjp.funcName} 调用失败,错误原因:`, e);
  }
};

log.pointcut(service);


async function f() {
  const calcAdd = await service.calcAdd(1, 2);

  console.error('calcAdd结果', calcAdd);
  console.error('calcAdd2结果', await service.calcAdd2(1, 2));
  console.error('calcAdd3结果', await service.calcAdd3(1, 2, 3));
}

f();

service.calcAdd2(4, 2);

