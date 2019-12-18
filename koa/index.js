const koa =require('koa');
const { promisify } = require('util')
const request = promisify(require('request'))
const Cache =require('./cache/index')
const app = new koa();
async function  testCache() {
    const max=20;
    let count=1;
    while(count<=max){
        var num=parseInt(Math.random() * 10);
        count++;
        await request(`http://localhost:3001/api/data/${num}`);
    }
}
const cache=new Cache(testCache,1000);
app.use(cache.getData)
app.listen(3001)