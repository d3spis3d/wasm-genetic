!function(e){self.webpackChunk=function(n,r){for(var _ in r)e[_]=r[_];for(;n.length;)t[n.pop()]=1};var n={},t={0:1},r={};var _={2:function(){return{"./wasm_genetic":{__wbindgen_object_drop_ref:function(e){return n[1].exports.__wbindgen_object_drop_ref(e)},__wbindgen_number_new:function(e){return n[1].exports.__wbindgen_number_new(e)},__wbg_getRandomValues_1ef11e888e5228e9:function(e,t,r){return n[1].exports.__wbg_getRandomValues_1ef11e888e5228e9(e,t,r)},__wbg_randomFillSync_1b52c8482374c55b:function(e,t,r){return n[1].exports.__wbg_randomFillSync_1b52c8482374c55b(e,t,r)},__wbg_new_3a746f2619705add:function(e,t){return n[1].exports.__wbg_new_3a746f2619705add(e,t)},__wbg_call_f54d3a6dadb199ca:function(e,t){return n[1].exports.__wbg_call_f54d3a6dadb199ca(e,t)},__wbindgen_jsval_eq:function(e,t){return n[1].exports.__wbindgen_jsval_eq(e,t)},__wbg_self_ac379e780a0d8b94:function(e){return n[1].exports.__wbg_self_ac379e780a0d8b94(e)},__wbg_require_6461b1e9a0d7c34a:function(e,t){return n[1].exports.__wbg_require_6461b1e9a0d7c34a(e,t)},__wbg_crypto_1e4302b85d4f64a2:function(e){return n[1].exports.__wbg_crypto_1e4302b85d4f64a2(e)},__wbindgen_is_undefined:function(e){return n[1].exports.__wbindgen_is_undefined(e)},__wbg_getRandomValues_1b4ba144162a5c9e:function(e){return n[1].exports.__wbg_getRandomValues_1b4ba144162a5c9e(e)},__wbg_new_e4d30a4b4735c3c3:function(){return n[1].exports.__wbg_new_e4d30a4b4735c3c3()},__wbg_push_813d9619c1a992c5:function(e,t){return n[1].exports.__wbg_push_813d9619c1a992c5(e,t)},__wbindgen_throw:function(e,t){return n[1].exports.__wbindgen_throw(e,t)}}}}};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(e){var n=[];return n.push(Promise.resolve().then(function(){t[e]||importScripts(o.p+""+e+".worker.js")})),({1:[2]}[e]||[]).forEach(function(e){var t=r[e];if(t)n.push(t);else{var i,u=_[e](),a=fetch(o.p+""+{2:"4bfffe233a38dd56c3ca"}[e]+".module.wasm");if(u instanceof Promise&&"function"==typeof WebAssembly.compileStreaming)i=Promise.all([WebAssembly.compileStreaming(a),u]).then(function(e){return WebAssembly.instantiate(e[0],e[1])});else if("function"==typeof WebAssembly.instantiateStreaming)i=WebAssembly.instantiateStreaming(a,u);else{i=a.then(function(e){return e.arrayBuffer()}).then(function(e){return WebAssembly.instantiate(e,u)})}n.push(r[e]=i.then(function(n){return o.w[e]=(n.instance||n).exports}))}}),Promise.all(n)},o.m=e,o.c=n,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)o.d(t,r,function(n){return e[n]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o.w={},o(o.s=0)}([function(e,n,t){t.e(1).then(t.bind(null,1)).then(({Simulation:e})=>{onmessage=function(n){const{iterations:t,citiesString:r,population_size:_,crossover:o,mutation:i,survival:u}=n.data,a=new e(t,r,_,o,i,u).run();self.postMessage({path:a[0],fitness:a[1]})}})}]);