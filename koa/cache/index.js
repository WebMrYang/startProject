
class Cache {
    constructor(cache=()=>{},defaultTime) {
        this.cacheList = {};
        this.time=null;
        this.initCache=cache;
        this.getData=this.getData.bind(this)
        this.init(defaultTime);
    }
    async getData(ctx,next) {
        const reg=/^\/api\/data\/[0-9]?$/;
        const url=ctx.url;
        const type=ctx.method;
        if(!reg.test(url)||type!=='GET'){
            await next()
            return ;
        }
        let result,tip='请求';
        let data = this.cacheList[url];
        if (data) {
            console.time(url + ' 缓存');
            ctx.code = 200;
            ctx.body = data;
            console.timeEnd(url + ' 缓存');
            result = data;
        } else {
            console.time(url + ' 请求完成');
            result = await this.request(url);
            console.timeEnd(url + ' 请求完成');
            this.cacheList[url] = result
            ctx.code = 200;
            ctx.body = result;
        }
        await next()
    }
    async init(defaultTime) {
        this.cacheList = {};
        await this.initCache()
        this.timer(defaultTime)
    }
    request(key) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(key)
            }, 100 + parseInt(Math.random() * 100))
        })
    }
    timer(defaultTime) {
        let time=new Date().getTime();
        const secondDay=new Date(time).setHours(23,59,59,59)+2000;
        if(this.time){
            clearTimeout(this.time)
        }
        this.time=setTimeout(()=>{
            console.log('清除缓存')
            this.init();
        },defaultTime?defaultTime:secondDay-time)
    }

}
module.exports = Cache